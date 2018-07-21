import axios, { AxiosPromise, AxiosRequestConfig } from "axios";

function get<T>(
  token: string,
  url: string,
  options: AxiosRequestConfig
): AxiosPromise<T> {
  return axios.get(url, createAuthorizedOptions(token, options));
}

function post<T, R>(
  token: string,
  url: string,
  body: T,
  options: AxiosRequestConfig
): AxiosPromise<R> {
  return axios.post(url, body, createAuthorizedOptions(token, options));
}

function createAuthorizedOptions(
  token: string,
  options: AxiosRequestConfig
): AxiosRequestConfig {
  return {
    auth: {
      username: token,
      password: ""
    },
    ...options
  };
}

export function circleGet<T>(
  token: string,
  url: string,
  options?: AxiosRequestConfig
): AxiosPromise<T> {
  return client(token).get(url, options);
}

export function circlePost<T>(
  token: string,
  url: string,
  body?: any,
  options?: AxiosRequestConfig
): AxiosPromise<T> {
  return client(token).post(url, body, options);
}

export interface ClientFactory {
  get: <T>(url: string, options?: AxiosRequestConfig) => Promise<T>;
  post: <T>(
    url: string,
    body?: any,
    options?: AxiosRequestConfig
  ) => Promise<T>;
}

export function client(token: string) {
  const factory: ClientFactory = {
    get: async <T>(
      url: string,
      options: AxiosRequestConfig = {}
    ): Promise<T> => {
      return (await get<T>(token, url, options)).data;
    },
    post: async <T>(
      url: string,
      body?: any,
      options: AxiosRequestConfig = {}
    ): Promise<T> => {
      return (await post<any, T>(token, url, body, options)).data;
    }
  };

  return factory;
}
