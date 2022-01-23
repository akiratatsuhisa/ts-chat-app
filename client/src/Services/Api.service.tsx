import { default as axios, AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
  baseURL: process.env.REACT_APP_BASE_API_URL,
};

export const instanceApi = axios.create(config);
