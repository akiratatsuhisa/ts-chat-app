import { Server as HttpServer } from "http";
import { Server, Socket, Namespace, ServerOptions } from "socket.io";
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
    console.log(`Connected: ${socket.data.user.id}`);

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.data.user.id}`);
    });

    socket.on("joinRoom", ({ chatRoomId }) => {
      socket.join(chatRoomId);
      console.log(`user joined chatroom: ${chatRoomId}`);
    });

    socket.on("leaveRoom", ({ chatRoomId }) => {
      socket.leave(chatRoomId);
      console.log(`user left chatroom: ${chatRoomId}`);
    });

    socket.on("sendMessage", async ({ chatRoomId, content }) => {
      content = content?.trim();
      if (!content) {
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
  });

  return io;
};
