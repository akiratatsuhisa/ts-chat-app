import { model, Model, Document, Schema, Types, Query } from "mongoose";
import { IChatRoomDocument } from "./ChatRoom.model";
import { IUserDocument } from "./User.model";

export interface IChatMessage {
  chatRoom_id: Types.ObjectId;
  chatRoomId: Types.ObjectId;

  user_id: Types.ObjectId;
  userId: Types.ObjectId;

  content: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessageDocument extends IChatMessage, Document {}

export interface IChatMessageModel extends Model<IChatMessageDocument> {
  findByRoomId: (roomId: string) => Query<any, IChatMessageDocument>;
}

export interface IPopludateChatMessage {
  chatRoom: IChatRoomDocument | null;
  user: IUserDocument | null;
}

const schema = new Schema<IChatMessageDocument, IChatMessageModel>(
  {
    chatRoom_id: {
      type: Schema.Types.ObjectId,
      required: true,
      alias: "chatRoomId",
    },
    user_id: { type: Schema.Types.ObjectId, required: true, alias: "userId" },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

schema.virtual("chatRoom", {
  ref: "ChatRoom",
  localField: "chatRoom_id",
  foreignField: "_id",
  justOne: true,
});

schema.virtual("user", {
  ref: "User",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
});

schema.statics.findByRoomId = function (
  roomId: string
): Query<any, IChatMessageDocument> {
  return this.find({
    chatRoom_id: new Types.ObjectId(roomId),
  });
};

export const ChatMessage = model<IChatMessageDocument, IChatMessageModel>(
  "ChatMessage",
  schema
);
