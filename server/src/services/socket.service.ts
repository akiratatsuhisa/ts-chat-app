import { Server as HttpServer } from "http";
import { Server, Socket, Namespace, ServerOptions } from "socket.io";
import { Types } from "mongoose";
import { verifyJwtToken } from "./auth.service";
import { ChatRoom } from "../models/ChatRoom.model";
import { ChatMessage } from "../models/ChatMessage.model";
import { User } from "../models/User.model";
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
    1;
    socket.on("joinRoom", async ({ chatRoomId }) => {
      if (!(await ChatRoom.hasUserInRoom(chatRoomId, socket.data.user.id))) {
        return;
      }

      socket.join(chatRoomId);
      console.log(
        `user: ${socket.data.user.username} joined chatroom: ${chatRoomId}`
      );
    });

    socket.on("leaveRoom", ({ chatRoomId }) => {
      socket.leave(chatRoomId);
      console.log(
        `user: ${socket.data.user.username} left chatroom: ${chatRoomId}`
      );
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
      const user = await User.findById(socket.data.user.id);
      io.in(chatRoomId).emit("receiveMessage", {
        id: chatMessage.id,
        chatRoomId,
        userId: socket.data.user.id,
        user: user,
        content,
        createdAt: chatMessage.createdAt,
        updatedAt: chatMessage.updatedAt,
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

      io.in(chatRoomId).emit("admitMessage", {
        id: chatMessage.id,
        chatRoomId: chatMessage.chatRoomId,
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

        const result = await ChatRoom.findByIdAndUpdate(
          chatRoomId,
          { users: updateUsers.map((x) => new Types.ObjectId(x)) },
          { new: true }
        ).populate("users");

        console.log(`users: ${updateUsers.join(", ")} in room: ${chatRoom.id}`);

        io.in(chatRoomId).emit("modifyUsers", {
          chatRoomId,
          users: result?.users ?? [],
        });
      }
    );
  });

  return io;
};
