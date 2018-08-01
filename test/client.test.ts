import axios from "axios";

import { client, circleGet, circlePost, circleDelete } from "../src/client";

jest.mock("axios");

const mockAxios = axios as any;

/**
 * TODO
 * Add tests for the auth param adder
 */

const TOKEN = "test-token";
const URL = "cats.com";
const URL_WITH_TOKEN = `${URL}?circle-token=${TOKEN}`;

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

    it("should add circle-token param with ?", () => {
      circleGet("foo", "bar.com").catch(jest.fn());
      expect(mockAxios.get).toBeCalledWith("bar.com?circle-token=foo", {});
    });

    it("should add circle-token param with &", () => {
      circleGet("foo", "bar.com?fizz=buzz").catch(jest.fn());
      expect(mockAxios.get).toBeCalledWith(
        "bar.com?fizz=buzz&circle-token=foo",
        {}
      );
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

      mockAxios._setMockResponse({ data: "okay" });
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

      mockAxios._setMockResponse({ data: "okay" });
    });
  });

  describe("circleDelete", () => {
    it("should send delete to url", () => {
      circleDelete("foo", "bar.com").catch(jest.fn());
      expect(mockAxios.delete).toBeCalledWith("bar.com?circle-token=foo", {});
    });

    it("should delete url with options", () => {
      circleDelete(TOKEN, URL, { timeout: 1000 }).catch(jest.fn());
      expect(mockAxios.delete).toBeCalledWith(URL_WITH_TOKEN, {
        timeout: 1000
      });
    });

    it("should be able to use the factory to delete", () => {
      const catchFn = jest.fn();
      const thenFn = jest.fn();

      client(TOKEN)
        .delete("/biz/baz")
        .then(thenFn)
        .catch(catchFn);

      expect(mockAxios.delete).toHaveBeenCalledWith(
        `/biz/baz?circle-token=${TOKEN}`,
        {}
      );

      mockAxios._setMockResponse({ data: "okay" });
    });
  });
});
