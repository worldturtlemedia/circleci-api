import axios, { AxiosPromise, AxiosRequestConfig } from "axios";

function get<T>(
  token: string,
  url: string,
  options: AxiosRequestConfig = {}
): AxiosPromise<T> {
  return axios.get(url, createAuthorizedOptions(token, options));
}

function post<T, R>(
  token: string,
  url: string,
  body: T,
  options: AxiosRequestConfig = {}
): AxiosPromise<R> {
  return axios.post(url, body, createAuthorizedOptions(token, options));
}

function createAuthorizedOptions(
  token: string,
  options: AxiosRequestConfig = {}
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
  options: AxiosRequestConfig = {}
): AxiosPromise<T> {
  return client(token).get(url, options) as AxiosPromise<T>;
}

export function circlePost<T>(
  token: string,
  url: string,
  body?: any,
  options: AxiosRequestConfig = {}
): AxiosPromise<T> {
  return client(token).post(url, body, options) as AxiosPromise<T>;
}

export function client(token: string) {
  return {
    get: <T>(
      url: string,
      options: AxiosRequestConfig = {}
    ): AxiosPromise<T> => {
      return get(token, url, options);
    },
    post: <T>(
      url: string,
      body?: any,
      options: AxiosRequestConfig = {}
    ): AxiosPromise<T> => {
      return post(token, url, body, options);
    }
  };
}
