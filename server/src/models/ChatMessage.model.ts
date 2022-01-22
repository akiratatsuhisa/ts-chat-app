import { model, Model, Document, Schema, Types } from "mongoose";
import { IChatRoomDocument } from "./ChatRoom.model";
import { IUserDocument } from "./User.model";

export interface IChatMessage {
  chatRoom_id: Types.ObjectId;
  chatRoomId: Types.ObjectId;

  user_id: Types.ObjectId;
  userId: Types.ObjectId;

  content: string;
}

export interface IChatMessageDocument extends IChatMessage, Document {}

export interface IChatMessageModel extends Model<IChatMessageDocument> {}

export interface IPopludateChatMessage {
  chatRoom: IChatRoomDocument | null;
  user: IUserDocument | null;
}

const schema = new Schema<IChatMessageDocument, IChatMessageModel>({
  chatRoom_id: {
    type: Schema.Types.ObjectId,
    required: true,
    alias: "chatRoomId",
  },
  user_id: { type: Schema.Types.ObjectId, required: true, alias: "userId" },
  content: { type: String, required: true },
});

schema.virtual("chatRoom", {
  ref: "ChatRoom",
  localField: "_id",
  foreignField: "chatRoom_id",
  justOne: true,
});

schema.virtual("user", {
  ref: "User",
  localField: "_id",
  foreignField: "user_id",
  justOne: true,
});

export const ChatMessage = model<IChatMessageDocument, IChatMessageModel>(
  "ChatMessage",
  schema
);
