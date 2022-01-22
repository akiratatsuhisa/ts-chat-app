import { model } from "mongoose";
import { verify, sign, JwtPayload } from "jsonwebtoken";
import { IUserDocument } from "../models/User.model";

const PRIVATE_KEY: string = process.env.PRIVATE_KEY as string;
const AUDIENCE: string = process.env.AUDIENCE as string;
const ISSUER: string = process.env.ISSUER as string;
const JWT_TOKEN_EXPIRES: number = parseInt(
  process.env.JWT_TOKEN_EXPIRES as string,
  10
);

export const verifyJwtToken = (token: string): JwtPayload | null => {
  try {
    if (!token) return null;
    return verify(token, PRIVATE_KEY, {
      issuer: ISSUER,
      audience: AUDIENCE,
    }) as JwtPayload;
  } catch (error: any) {
    console.error(error.message);
    return null;
  }
};

export const generateJwtToken = (user: IUserDocument): string => {
  const { id, username, email, displayName } = user;
  return sign({ id, username, email, displayName }, PRIVATE_KEY, {
    subject: id,
    issuer: ISSUER,
    audience: AUDIENCE,
    expiresIn: JWT_TOKEN_EXPIRES,
  });
};
