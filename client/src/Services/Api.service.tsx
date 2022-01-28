import { default as axios, AxiosRequestConfig, AxiosInstance } from "axios";

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
