import { model, Model, Document, Schema, Query } from "mongoose";
import { default as bcrypt } from "bcryptjs";

export interface IUser {
  username: string;
  email?: string;
  displayName: string;
  password: string;
}

export interface IUserDocument extends IUser, Document {
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
  findByUsername: (username: string) => Query<any, IUserDocument>;
}

const schema = new Schema<IUserDocument, IUserModel>({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  displayName: { type: String, required: true },
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

schema.statics.findByUsername = function (
  username: string
): Query<any, IUserDocument> {
  return this.findOne({ username });
};

export const User = model<IUserDocument, IUserModel>("User", schema);
