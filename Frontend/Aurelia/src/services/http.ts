import axios, { type AxiosRequestConfig } from "axios";

export const api_Response = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: unknown,
  headers?: AxiosRequestConfig["headers"]
): Promise<T> => {
  const response = await axios.request<T>({
    url,
    method,
    data,
    headers,
    withCredentials: true,
  });
  return response.data;
};
