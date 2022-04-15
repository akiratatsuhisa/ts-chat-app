import { model, Model, Document, Schema, Query } from "mongoose";
import { default as bcrypt } from "bcryptjs";
import { Canvas, createCanvas } from "canvas";
import { createWriteStream, WriteStream } from "fs";
import { default as path } from "path";
import { generateAvatarCanvas } from "../utils/common";

export interface IUser {
  username: string;
  email?: string;
  displayName: string;
  password: string;
  avatarUrl?: string;
}

export interface IUserDocument extends IUser, Document {
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
  generateAvatar: () => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
  findByUsername: (username: string) => Query<any, IUserDocument>;
}

const schema = new Schema<IUserDocument, IUserModel>({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true, select: false },
  displayName: { type: String, required: true },
  avatarUrl: { type: String },
});

schema.methods.setPassword = async function (password: string): Promise<void> {
  const hash = await bcrypt.hash(password, 10);
  this.password = hash;
};

schema.methods.checkPassword = async function (
  password: string
): Promise<boolean> {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

schema.methods.generateAvatar = async function (): Promise<boolean> {
  const canvas = generateAvatarCanvas(this.displayName);

  const savePath: string = path.join(
    __dirname,
    "..",
    "..",
    "images",
    `avatar.${this._id}.png`
  );
  try {
    const writeStream: WriteStream = createWriteStream(savePath);
    const stream = canvas.createPNGStream();
    stream.pipe(writeStream);
    await new Promise((resolve) => writeStream.on("finish", resolve));
    this.avatarUrl = `/images/avatar.${this._id}.png`;
    await this.save();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

schema.statics.findByUsername = function (
  username: string
): Query<any, IUserDocument> {
  return this.findOne({ username });
};

export const User = model<IUserDocument, IUserModel>("User", schema);
