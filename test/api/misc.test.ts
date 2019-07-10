import * as axios from "axios";

import {
  CircleCI,
  HerokuKey,
  addSSHKey,
  API_BASE,
  addHerokuKey
} from "../../src";

jest.mock("axios");

const mockAxios = axios.default as any;

describe("API - Misc", () => {
  const TOKEN = "token";
  let circle: CircleCI;

  beforeEach(() => {
    mockAxios.reset();
    mockAxios._setMockResponse({ data: {} });
    circle = new CircleCI({
      token: TOKEN,
      vcs: { owner: "foo", repo: "bar" }
    });
  });

  describe("Add SSH Key", () => {
    const testKey = {
      hostname: "foobar",
      private_key: "bizz"
    };

    it("should add ssh key to a project", async () => {
      await circle.addSSHKey(testKey);

      expect(mockAxios.post).toBeCalledWith(
        `/project/github/foo/bar/ssh-key?circle-token=${TOKEN}`,
        testKey,
        expect.any(Object)
      );
    });

    it("should override client settings with custom token", async () => {
      await circle.addSSHKey(testKey, { token: "BUZZ" });
      expect(mockAxios.post).toBeCalledWith(
        expect.stringContaining("/github/foo/bar/ssh-key?circle-token=BUZZ"),
        testKey,
        expect.any(Object)
      );
    });

    it("should use default CircleCI host", async () => {
      await addSSHKey(TOKEN, { owner: "test", repo: "proj" }, testKey as any);

      expect(mockAxios.post).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ baseURL: API_BASE })
      );
    });

    it("should use a custom circleci host", async () => {
      await new CircleCI({
        token: TOKEN,
        vcs: { owner: "test", repo: "proj" },
        circleHost: "foo.bar/api"
      }).addSSHKey(testKey);

      expect(mockAxios.post).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ baseURL: "foo.bar/api" })
      );
    });
  });

  describe("Add Heroku key", () => {
    const testKey: HerokuKey = { apikey: "foobar" };

    it("should add heroku key to project", async () => {
      await circle.addHerokuKey(testKey);
      expect(mockAxios.post).toBeCalledWith(
        `/user/heroku-key?circle-token=${TOKEN}`,
        testKey,
        expect.any(Object)
      );
    });

    it("should override client settings with custom token", async () => {
      await circle.addHerokuKey(testKey, { token: "BUZZ" });
      expect(mockAxios.post).toBeCalledWith(
        expect.stringContaining("/user/heroku-key?circle-token=BUZZ"),
        testKey,
        expect.any(Object)
      );
    });

    it("should use default CircleCI host", async () => {
      await addHerokuKey(TOKEN, testKey as any);

      expect(mockAxios.post).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ baseURL: API_BASE })
      );
    });

    it("should use a custom circleci host using wrapper", async () => {
      await new CircleCI({
        token: TOKEN,
        vcs: { owner: "test", repo: "proj" },
        circleHost: "foo.bar/api"
      }).addHerokuKey(testKey);

      expect(mockAxios.post).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ baseURL: "foo.bar/api" })
      );
    });
  });
});
