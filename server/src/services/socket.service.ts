import { Server as HttpServer } from "http";
import { Server, Socket, Namespace, ServerOptions } from "socket.io";
import { ChatRoom } from "../models/ChatRoom.model";
import { ChatMessage } from "../models/ChatMessage.model";
import { verifyJwtToken } from "./auth.service";

var io: Server;

export const getIo = function (): Server {
  return io;
};

export const startSocketIo = (
  httpServer: HttpServer,
  options: Partial<ServerOptions> | undefined = undefined
): Server => {
  io = new Server(httpServer, options);

  //use for test socket
  io.on("connection", (socket) => {
    console.log(`Global connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Global disconnected: ${socket.id}`);
    });
  });
  return io;
};

export const registerChatSocket = (
  io: Server | Namespace
): Server | Namespace => {
  io.use((socket: Socket, next) => {
    const { authorization } = socket.handshake.headers;

    if (!authorization?.startsWith("Bearer ")) {
      return next(new Error("Authentication error"));
    }

    const token: string = authorization.split(" ")[1] as string;
    const user = verifyJwtToken(token);

    if (!user) {
      return next(new Error("Authentication error"));
    }

    socket.data.user = user;
    next();
  });

  io.on("connection", (socket) => {
    console.log(
      `user: ${socket.data.user.username} connected: ${socket.data.user.id}`
    );

    socket.on("disconnect", () => {
      console.log(
        `user: ${socket.data.user.username} disconnected: ${socket.data.user.id}`
      );
    });

    socket.on("joinRoom", ({ chatRoomId }) => {
      socket.join(chatRoomId);
      console.log(
        `user: ${socket.data.user.username} joined chatroom: ${chatRoomId}`
      );
    });

    socket.on("leaveRoom", ({ chatRoomId }) => {
      socket.leave(chatRoomId);
      `user: ${socket.data.user.username} left chatroom: ${chatRoomId}`;
    });

    socket.on("sendMessage", async ({ chatRoomId, content }) => {
      content = content?.trim();
      if (
        !content ||
        !chatRoomId ||
        !(await ChatRoom.hasUserInRoom(chatRoomId, socket.data.user.id))
      ) {
        return;
      }

      const chatMessage = new ChatMessage({
        chatRoomId,
        userId: socket.data.user.id,
        content,
      });
      await chatMessage.save();

      socket.to(chatRoomId).emit("receiveMessage", {
        id: chatMessage.id,
        userId: socket.data.user.id,
        content,
      });
    });

    socket.on("evictMessage", async ({ chatMessageId }) => {
      const chatMessage = await ChatMessage.findById(chatMessageId);

      const chatRoomId = chatMessage?.chatRoomId?.toString() ?? "";

      if (
        !chatMessage ||
        chatMessage.userId != socket.data.user.id ||
        !(await ChatRoom.hasUserInRoom(chatRoomId, socket.data.user.id))
      ) {
        return;
      }

      await chatMessage.deleteOne();

      socket.to(chatRoomId).emit("admitMessage", {
        id: chatMessage.id,
      });
    });

    socket.on(
      "updateUsers",
      async ({ chatRoomId, users = [], type = "add" }) => {
        const chatRoom = await ChatRoom.findById(chatRoomId);
        if (
          !chatRoom ||
          !(await ChatRoom.hasUserInRoom(chatRoomId, socket.data.user.id))
        ) {
          return;
        }

        let updateUsers: string[] = chatRoom.users.map((x) => x.toString());
        switch (type) {
          case "add": {
            updateUsers = [...new Set([...updateUsers, ...users])];
            break;
          }
          case "remove": {
            updateUsers = updateUsers.filter((user) => !users.includes(user));
            break;
          }
          default:
            break;
        }

        const result = await chatRoom
          .updateOne({ users: updateUsers }, { new: true })
          .populate("users");
        console.log(`users: ${updateUsers.join(", ")} in room: ${chatRoom.id}`);
        socket.to(chatRoomId).emit("modifyUsers", { users: result.users });
      }
    );
  });

  return io;
};
