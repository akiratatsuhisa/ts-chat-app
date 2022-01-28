import { default as axios, AxiosRequestConfig, AxiosInstance } from "axios";

export interface IUser {
  username: string;
  displayName: string;
  avatarUrl: string;
  email?: string;
}

export interface IChatRoom {
  _id: string;
  name: string;
  users?: IUser[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChatMessage {
  _id: string;
  content: string;
  chatRoom_id?: string;
  user_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAuthUser {
  username: string;
  displayName: string;
  avatarUrl: string;
  email?: string;
  [key: string]: any;
}

export const apiUrl: URL = new URL(
  "/api",
  process.env.REACT_APP_SERVER_API_URL as string
);

export const wsUrl = new URL(
  "/",
  process.env.REACT_APP_SERVER_API_URL as string
);

wsUrl.protocol = apiUrl.protocol === "http:" ? "ws" : "wss:";

const config: AxiosRequestConfig = {
  baseURL: apiUrl.toString(),
};

export const apiInstance: AxiosInstance = axios.create(config);
