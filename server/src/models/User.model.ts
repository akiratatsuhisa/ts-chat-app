import { model, Model, Document, Schema, Query } from "mongoose";
import { default as bcrypt } from "bcryptjs";
import { Canvas, createCanvas } from "canvas";
import { createWriteStream, WriteStream } from "fs";
import { default as path } from "path";

export interface IUser {
  username: string;
  email?: string;
  displayName: string;
  password: string;
  avatarUrl?: string;
}

function randomColorHex(): string {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, "0")}`;
}

function getFontColorByBackgroundColor(backgroundColor: string): string {
  var color =
    backgroundColor.charAt(0) === "#"
      ? backgroundColor.substring(1, 7)
      : backgroundColor;
  var red = parseInt(color.substring(0, 2), 16);
  var green = parseInt(color.substring(2, 4), 16);
  var blue = parseInt(color.substring(4, 6), 16);
  return red * 0.299 + green * 0.587 + blue * 0.114 > 186 ? "black" : "white";
}

function getAvatarText(name: string): string {
  name = name.trim();
  if (!name.trim().length) return "_";
  const words = name.split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (
    words[0].charAt(0).toUpperCase() +
    words[words.length - 1].charAt(0).toUpperCase()
  );
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
  const canvas: Canvas = createCanvas(200, 200);
  const context = canvas.getContext("2d");

  // Draw background
  const backgroundColor: string = randomColorHex();
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text
  context.font = "bold 80px Sans";
  context.fillStyle = getFontColorByBackgroundColor(backgroundColor);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(
    getAvatarText(this.displayName),
    canvas.width / 2,
    canvas.height / 2
  );

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
