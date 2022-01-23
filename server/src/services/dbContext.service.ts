import { connect, connection, Connection } from "mongoose";

import { User } from "../models/User.model";
import { ChatRoom } from "../models/ChatRoom.model";
import { ChatMessage } from "../models/ChatMessage.model";

const { DATABASE_HOST, DATABASE_NAME, DATABASE_PORT } = process.env;

export const dbContext = async () => {
  console.info(`database connecting at port: ${DATABASE_PORT}`);
  await connect(`mongodb://${DATABASE_HOST}:${DATABASE_PORT}`, {
    dbName: DATABASE_NAME,
  });
  console.info(`database connected at port: ${DATABASE_PORT}`);

  const db: Connection = connection;
  db.on("error", console.error.bind(console, "connection error:"));

  User.createCollection();
  ChatRoom.createCollection();
  ChatMessage.createCollection();

  return db;
};
