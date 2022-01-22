import mongoose, { model, Model, Document, Schema, Types } from "mongoose";
import { IUserDocument } from "./User.model";

export interface IChatRoom {
  name: string;
  users: Types.Array<Types.ObjectId>;
}

export interface IChatRoomDocument extends IChatRoom, Document {}

export interface IChatRoomModel extends Model<IChatRoomDocument> {
  hasUserInRoom: (roomId: string, userId: string) => Promise<boolean>;
}

export interface IPopludateChatRoom {
  users: Types.Array<IUserDocument> | null;
}
const schema = new Schema<IChatRoomDocument, IChatRoomModel>({
  name: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

schema.statics.hasUserInRoom = async function (roomId: string, userId: string) {
  return !!(await this.findOne({
    _id: new Types.ObjectId(roomId),
    users: new Types.ObjectId(userId),
  }));
};

export const ChatRoom = model<IChatRoomDocument, IChatRoomModel>(
  "ChatRoom",
  schema
);
