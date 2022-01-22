import { connect, connection, Connection } from "mongoose";

import { User } from "../models/User.model";
import { ChatRoom } from "../models/ChatRoom.model";
import { ChatMessage } from "../models/ChatMessage.model";

const CONNECTION_STRING: string = process.env.CONNECTION_STRING as string;
const DATABASE_NAME: string = process.env.DATABASE_NAME as string;

export const dbContext = async () => {
  await connect(CONNECTION_STRING, { dbName: DATABASE_NAME });
  console.info("connection connected");

  const db: Connection = connection;
  db.on("error", console.error.bind(console, "connection error:"));

  User.createCollection();
  ChatRoom.createCollection();
  ChatMessage.createCollection();
  
  return db;
};
