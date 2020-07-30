import * as axios from "axios";

import {
  CircleCI,
  FullCheckoutKey,
  DeleteCheckoutKeyResponse,
} from "../../src";
import { createJsonHeader, addUserAgentHeader } from "../../src/util";

jest.mock("axios");

const mockAxios = axios.default as any;

describe("API - Checkout Keys", () => {
  const TOKEN = "token";
  const variable: FullCheckoutKey = {
    public_key: "FOO",
    fingerprint: "foo",
    preferred: true,
    time: "bar",
    type: "deploy-key",
  };

  let circle: CircleCI;

  beforeEach(() => {
    mockAxios.reset();
    circle = new CircleCI({
      token: TOKEN,
      vcs: { owner: "foo", repo: "bar" },
    });
  });

  describe("List Keys", () => {
    beforeEach(() => {
      mockAxios._setMockResponse({ data: [variable] });
    });

    it("should get all checkout keys for project", async () => {
      const result = await circle.listCheckoutKeys();

      expect(mockAxios.get).toBeCalledWith(
        `/project/github/foo/bar/checkout-key?circle-token=${TOKEN}`,
        expect.anything()
      );
      expect(result[0]).toEqual(variable);
    });

    it("should override client settings with custom token", async () => {
      const result = await circle.listCheckoutKeys({ token: "BUZZ" });
      expect(mockAxios.get).toBeCalledWith(
        expect.stringContaining(
          "/github/foo/bar/checkout-key?circle-token=BUZZ"
        ),
        expect.anything()
      );
      expect(result[0]).toEqual(variable);
    });

    it("should use a custom circleci host", async () => {
      await new CircleCI({
        token: TOKEN,
        vcs: { owner: "test", repo: "proj" },
        circleHost: "foo.bar/api",
      }).listCheckoutKeys();

      expect(mockAxios.get).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({ baseURL: "foo.bar/api" })
      );
    });
  });

  describe("Create checkout key", () => {
    beforeEach(() => {
      mockAxios._setMockResponse({ data: variable });
    });

    it("should hit the create endpoint with JSON headers", async () => {
      const result = await circle.addCheckoutKey("deploy-key");
      expect(mockAxios.post).toBeCalledWith(
        `/project/github/foo/bar/checkout-key?circle-token=${TOKEN}`,
        { type: "deploy-key" },
        expect.objectContaining(addUserAgentHeader(createJsonHeader()))
      );

      expect(result).toEqual(variable);
    });

    it("should override token and project", async () => {
      const result = await circle.addCheckoutKey("deploy-key", {
        token: "BAR",
        vcs: { owner: "buzz" },
      });
      expect(mockAxios.post).toBeCalledWith(
        expect.stringContaining("/buzz/bar/checkout-key?circle-token=BAR"),
        { type: "deploy-key" },
        expect.any(Object)
      );

      expect(result).toEqual(variable);
    });

    it("should use a custom circleci host", async () => {
      await new CircleCI({
        token: TOKEN,
        vcs: { owner: "test", repo: "proj" },
        circleHost: "foo.bar/api",
      }).addCheckoutKey("deploy-key");

      expect(mockAxios.post).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ baseURL: "foo.bar/api" })
      );
    });
  });

  describe("Get Checkout key", () => {
    beforeEach(() => {
      mockAxios._setMockResponse({ data: variable });
    });

    it("should get single checkout key", async () => {
      const result = await circle.getCheckoutKey("foo");

      expect(mockAxios.get).toBeCalledWith(
        `/project/github/foo/bar/checkout-key/foo?circle-token=${TOKEN}`,
        expect.anything()
      );
      expect(result).toEqual(variable);
    });

    it("should override client settings with custom token", async () => {
      const result = await circle.getCheckoutKey("foo", {
        token: "BUZZ",
        vcs: { owner: "bar" },
      });
      expect(mockAxios.get).toBeCalledWith(
        expect.stringContaining("/bar/bar/checkout-key/foo?circle-token=BUZZ"),
        expect.anything()
      );
      expect(result).toEqual(variable);
    });

    it("should use a custom circleci host", async () => {
      await new CircleCI({
        token: TOKEN,
        vcs: { owner: "test", repo: "proj" },
        circleHost: "foo.bar/api",
      }).getCheckoutKey("test");

      expect(mockAxios.get).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({ baseURL: "foo.bar/api" })
      );
    });
  });

  describe("Delete Key", () => {
    const response: DeleteCheckoutKeyResponse = {
      message: "success",
    };

    beforeEach(() => {
      mockAxios._setMockResponse({ data: response });
    });

    it("should hit delete endpoint", async () => {
      const result = await circle.deleteCheckoutKey("foo");

      expect(mockAxios.delete).toBeCalledWith(
        `/project/github/foo/bar/checkout-key/foo?circle-token=${TOKEN}`,
        expect.anything()
      );
      expect(result).toEqual(response);
    });

    it("should override client settings with custom token", async () => {
      const result = await circle.deleteCheckoutKey("foo", {
        token: "BUZZ",
        vcs: { owner: "bar" },
      });
      expect(mockAxios.delete).toBeCalledWith(
        expect.stringContaining("/bar/bar/checkout-key/foo?circle-token=BUZZ"),
        expect.anything()
      );
      expect(result).toEqual(response);
    });

    it("should use a custom circleci host", async () => {
      await new CircleCI({
        token: TOKEN,
        vcs: { owner: "test", repo: "proj" },
        circleHost: "foo.bar/api",
      }).deleteCheckoutKey("foo");

      expect(mockAxios.delete).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({ baseURL: "foo.bar/api" })
      );
    });
  });
});
