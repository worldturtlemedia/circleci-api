import mockAxios from "jest-mock-axios";

import { client, circleGet, circlePost } from "../src/client";
import { AxiosRequestConfig } from "axios";

const TOKEN = "test-token-123";
const URL = "cats.com";
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
    it("should create an auth header for get", () => {
      client(TOKEN)
        .get(URL)
        .catch(jest.fn());
      expect(mockAxios.get).toBeCalledWith(URL, AUTH_OBJECT);
    });

    it("should create an auth header for post", () => {
      client(TOKEN)
        .post(URL, null)
        .catch(jest.fn());
      expect(mockAxios.post).toBeCalledWith(URL, null, AUTH_OBJECT);
    });

    it("should merge options with auth header", () => {
      client(TOKEN)
        .post(URL, "test", { timeout: 1000 })
        .catch(jest.fn());
      expect(mockAxios.post).toBeCalledWith(URL, "test", {
        ...AUTH_OBJECT,
        timeout: 1000
      });
    });
  });

  describe("circleGet", () => {
    it("should get url", () => {
      circleGet(TOKEN, URL).catch(jest.fn());
      expect(mockAxios.get).toBeCalledWith(URL, AUTH_OBJECT);
    });

    it("should get url with options", () => {
      circleGet(TOKEN, URL, { timeout: 1000 }).catch(jest.fn());
      expect(mockAxios.get).toBeCalledWith(URL, {
        ...AUTH_OBJECT,
        timeout: 1000
      });
    });

    it("should handle null options", () => {
      circleGet(TOKEN, URL, undefined).catch(jest.fn());
      expect(mockAxios.get).toBeCalledWith(URL, AUTH_OBJECT);
    });

    it("should return data after awaiting promise", () => {
      const catchFn = jest.fn();
      const thenFn = jest.fn();

      client(TOKEN)
        .get("/biz/baz")
        .then(thenFn)
        .catch(catchFn);

      expect(mockAxios.get).toHaveBeenCalledWith(
        "/biz/baz",
        expect.objectContaining({
          auth: { username: TOKEN, password: "" }
        })
      );

      mockAxios.mockResponse({ data: "okay" });
    });
  });

  describe("circlePost", () => {
    it("should post url", () => {
      circlePost(TOKEN, URL, null).catch(jest.fn());
      expect(mockAxios.post).toBeCalledWith(URL, null, AUTH_OBJECT);
    });

    it("should post url with options", () => {
      circlePost(TOKEN, URL, { cat: "meow" }, { timeout: 1 }).catch(jest.fn());
      expect(mockAxios.post).toBeCalledWith(
        URL,
        { cat: "meow" },
        { ...AUTH_OBJECT, timeout: 1 }
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
        "/biz/baz",
        { foo: "bar" },
        expect.objectContaining({
          auth: { username: TOKEN, password: "" }
        })
      );

      mockAxios.mockResponse({ data: "okay" });
    });
  });
});
