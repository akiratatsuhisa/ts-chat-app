import { connect, connection, Connection } from "mongoose";

import { User } from "../models/User.model";
import { ChatRoom } from "../models/ChatRoom.model";
import { ChatMessage } from "../models/ChatMessage.model";

const {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASS,
} = process.env;

export const dbContext = async () => {
  const connectionStr: string = DATABASE_HOST?.startsWith("mongodb+srv://")
    ? DATABASE_HOST
    : `mongodb://${DATABASE_HOST}:${DATABASE_PORT}`;

  await connect(connectionStr, {
    dbName: DATABASE_NAME,
    user: DATABASE_USER,
    pass: DATABASE_PASS,
  });
  console.info(`database connected at ${connectionStr}`);

  const db: Connection = connection;
  db.on("error", console.error.bind(console, "connection error:"));

  User.createCollection();
  ChatRoom.createCollection();
  ChatMessage.createCollection();

  return db;
};
