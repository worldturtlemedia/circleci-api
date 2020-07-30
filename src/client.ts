import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import { API_BASE } from "./types";
import { addUserAgentHeader } from "./util";

function get<T>(
  token: string,
  url: string,
  options: AxiosRequestConfig
): AxiosPromise<T> {
  return axios.get(addTokenParam(token, url), options);
}

function post<T, R>(
  token: string,
  url: string,
  body: T,
  options: AxiosRequestConfig
): AxiosPromise<R> {
  return axios.post(addTokenParam(token, url), body, options);
}

function doDelete<T>(
  token: string,
  url: string,
  options: AxiosRequestConfig
): AxiosPromise<T> {
  return axios.delete(addTokenParam(token, url), options);
}

function addTokenParam(token: string, url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}circle-token=${token}`;
}

/**
 * Create a custom GET request for CircleCI
 *
 * @deprecated In favour of using the [client] instead.
 */
export function circleGet<T>(
  token: string,
  url: string,
  options?: AxiosRequestConfig
): AxiosPromise<T> {
  console.warn("circleGet is deprecated, use `client('token').get(...)`");
  return client(token).get(url, addUserAgentHeader(options));
}

/**
 * Create a custom POST request for CircleCI
 *
 * @deprecated In favour of using the [client] instead.
 */
export function circlePost<T>(
  token: string,
  url: string,
  body?: any,
  options?: AxiosRequestConfig
): AxiosPromise<T> {
  console.warn("circlePost is deprecated, use `client('token').post(...)`");
  return client(token).post(url, body, addUserAgentHeader(options));
}

/**
 * Create a custom DELETE request for CircleCI
 *
 * @deprecated In favour of using the [client] instead.
 */
export function circleDelete<T>(
  token: string,
  url: string,
  options?: AxiosRequestConfig
): AxiosPromise<T> {
  console.warn("circleDelete is deprecated, use `client('token').delete(...)`");
  return client(token).delete(url, addUserAgentHeader(options));
}

export interface ClientFactory {
  get: <T>(url: string, options?: AxiosRequestConfig) => Promise<T>;
  post: <T>(
    url: string,
    body?: any,
    options?: AxiosRequestConfig
  ) => Promise<T>;
  delete: <T>(url: string, options?: AxiosRequestConfig) => Promise<T>;
}

/**
 * Create a client for interacting with the CircleCI API.
 *
 * @param token CircleCI API token
 * @param circleHost Custom host address for CircleCI
 */
export function client(token: string, circleHost: string = API_BASE) {
  const baseOptions: AxiosRequestConfig = { baseURL: circleHost };
  const factory: ClientFactory = {
    get: async <T>(
      url: string,
      options: AxiosRequestConfig = {}
    ): Promise<T> => {
      const config = addUserAgentHeader(mergeOptions(baseOptions, options));
      return (await get<T>(token, url, config)).data;
    },
    post: async <T>(
      url: string,
      body?: any,
      options: AxiosRequestConfig = {}
    ): Promise<T> => {
      const config = addUserAgentHeader(mergeOptions(baseOptions, options));
      return (await post<any, T>(token, url, body, config)).data;
    },
    delete: async <T>(
      url: string,
      options: AxiosRequestConfig = {}
    ): Promise<T> => {
      const config = addUserAgentHeader(mergeOptions(baseOptions, options));
      return (await doDelete<T>(token, url, config)).data;
    },
  };

  return factory;
}

function mergeOptions(
  base: AxiosRequestConfig,
  provided: AxiosRequestConfig
): AxiosRequestConfig {
  return {
    ...base,
    ...provided,
  };
}
