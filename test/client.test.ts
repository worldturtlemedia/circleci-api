import mockAxios from "jest-mock-axios";

import { client, circleGet, circlePost } from "../src/client";
import { AxiosRequestConfig } from "axios";

/**
 * TODO
 * Add tests for the auth param adder
 */

const TOKEN = "test-token";
const URL = "cats.com";
const URL_WITH_TOKEN = `${URL}?circle-token=${TOKEN}`;
const AUTH_OBJECT: AxiosRequestConfig = {
  auth: {
    username: TOKEN,
    password: ""
  }
};

describe("Client", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe("Factory", () => {
    it("should add token param to url for get", () => {
      client(TOKEN)
        .get(URL)
        .catch(jest.fn());
      expect(mockAxios.get).toBeCalledWith(URL_WITH_TOKEN, {});
    });

    it("should add token param to url for post", () => {
      client(TOKEN)
        .post(URL, null)
        .catch(jest.fn());
      expect(mockAxios.post).toBeCalledWith(URL_WITH_TOKEN, null, {});
    });

    it("should use options", () => {
      client(TOKEN)
        .post(URL, "test", { timeout: 1000 })
        .catch(jest.fn());
      expect(mockAxios.post).toBeCalledWith(URL_WITH_TOKEN, "test", {
        timeout: 1000
      });
    });
  });

  describe("circleGet", () => {
    it("should get url with auth token", () => {
      circleGet(TOKEN, URL).catch(jest.fn());
      expect(mockAxios.get).toBeCalledWith(URL_WITH_TOKEN, {});
    });

    it("should get url with options", () => {
      circleGet(TOKEN, URL, { timeout: 1000 }).catch(jest.fn());
      expect(mockAxios.get).toBeCalledWith(URL_WITH_TOKEN, {
        timeout: 1000
      });
    });

    it("should handle null options", () => {
      circleGet(TOKEN, URL, undefined).catch(jest.fn());
      expect(mockAxios.get).toBeCalledWith(URL_WITH_TOKEN, {});
    });

    it("should return data after awaiting promise", () => {
      const catchFn = jest.fn();
      const thenFn = jest.fn();

      client(TOKEN)
        .get("/biz/baz")
        .then(thenFn)
        .catch(catchFn);

      expect(mockAxios.get).toHaveBeenCalledWith(
        `/biz/baz?circle-token=${TOKEN}`,
        {}
      );

      mockAxios.mockResponse({ data: "okay" });
    });
  });

  describe("circlePost", () => {
    it("should post url", () => {
      circlePost(TOKEN, URL, null).catch(jest.fn());
      expect(mockAxios.post).toBeCalledWith(URL_WITH_TOKEN, null, {});
    });

    it("should post url with options", () => {
      circlePost(TOKEN, URL, { cat: "meow" }, { timeout: 1 }).catch(jest.fn());
      expect(mockAxios.post).toBeCalledWith(
        URL_WITH_TOKEN,
        { cat: "meow" },
        { timeout: 1 }
      );
    });

    it("should return data after awaiting promise", () => {
      const catchFn = jest.fn();
      const thenFn = jest.fn();

      client(TOKEN)
        .post("/biz/baz", { foo: "bar" })
        .then(thenFn)
        .catch(catchFn);

      expect(mockAxios.post).toHaveBeenCalledWith(
        `/biz/baz?circle-token=${TOKEN}`,
        { foo: "bar" },
        {}
      );

      mockAxios.mockResponse({ data: "okay" });
    });
  });
});
