import { default as axios, AxiosRequestConfig, AxiosInstance } from "axios";

const config: AxiosRequestConfig = {
  baseURL: process.env.REACT_APP_BASE_API_URL,
};

export const apiInstance: AxiosInstance = axios.create(config);
