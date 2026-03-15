import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  AUTH_SESSION_EXPIRED_EVENT,
} from "./authStorage";

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
}

interface ExtendAxiosRequestConfig extends InternalAxiosRequestConfig {
  headers: InternalAxiosRequestConfig["headers"] & {
    "x-access-token"?: string;
    "Content-Type"?: string;
    Authorization?: string;
  };
}

const headers: Readonly<Record<string, string>> = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8",
};

const injectToken = (
  config: ExtendAxiosRequestConfig,
): ExtendAxiosRequestConfig => {
  const tokenFromParams = (config.params as Record<string, unknown>)?.token;
  const tokenFromStorage =
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
  const token = tokenFromParams || tokenFromStorage;
  if (token != null) {
    config.headers.Authorization = `Bearer ${String(token)}`;
  }
  if (config.url === "/file/upload") {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
};

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  meta?: ApiMeta;
}

class Http {
  private instance: AxiosInstance | null = null;

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp();
  }

  private initHttp(): AxiosInstance {
    const http = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers,
    });

    http.interceptors.request.use(
      (config) => injectToken(config as ExtendAxiosRequestConfig),
      (error) => Promise.reject(error),
    );

    http.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<unknown>>) =>
        response.data as unknown as AxiosResponse<ApiResponse<unknown>>,
      (error) => {
        const response: AxiosResponse | undefined = error?.response;
        return this.handleError(response, error);
      },
    );

    this.instance = http;
    return http;
  }

  request<T, R = ApiResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this.http.request(config) as unknown as Promise<R>;
  }

  get<T, R = ApiResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.get<T, R>(url, config);
  }

  post<T, R = ApiResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.post<T, R>(url, data, config);
  }

  put<T, R = ApiResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.put<T, R>(url, data, config);
  }

  patch<T, R = ApiResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.patch<T, R>(url, data, config);
  }

  delete<T, R = ApiResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.delete<T, R>(url, config);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleError(error?: AxiosResponse<any>, originalError?: unknown) {
    const status = error?.status;

    switch (status) {
      case StatusCode.Unauthorized: {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("ro_game_user");
          window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
        }
        break;
      }
      case StatusCode.Forbidden: {
        break;
      }
      case StatusCode.TooManyRequests: {
        break;
      }
      case StatusCode.InternalServerError: {
        break;
      }
      default:
        break;
    }

    return Promise.reject(originalError ?? error);
  }
}

export const https = new Http();
