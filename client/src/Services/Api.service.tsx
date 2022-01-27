import { default as axios, AxiosRequestConfig, AxiosInstance } from "axios";

export const apiUrl: string = process.env.REACT_APP_BASE_API_URL as string;

const config: AxiosRequestConfig = {
  baseURL: apiUrl,
};

export const apiInstance: AxiosInstance = axios.create(config);
