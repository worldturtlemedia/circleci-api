import * as axios from "axios";

import { CircleCI } from "../../src";
import { EnvVariable, DeleteEnvVarResponse } from "../../src/types/api";

jest.mock("axios");

const mockAxios = axios.default as any;

describe("API - Env", () => {
  const TOKEN = "test-token";
  const variable: EnvVariable = { name: "FOO", value: "BAR" };

  let circle: CircleCI;

  beforeEach(() => {
    mockAxios.reset();
    circle = new CircleCI({
      token: TOKEN,
      vcs: { owner: "foo", repo: "bar" }
    });
  });

  describe("List Env", () => {
    beforeEach(() => {
      mockAxios._setMockResponse({ data: [variable] });
    });

    it("should get all env variables for project", async () => {
      const result = await circle.listEnvVars();

      expect(mockAxios.get).toBeCalledWith(
        `https://circleci.com/api/v1.1/project/github/foo/bar/envvar?circle-token=${TOKEN}`,
        {}
      );
      expect(result[0]).toEqual(variable);
    });

    it("should override client settings with custom token", async () => {
      const result = await circle.listEnvVars({ token: "BUZZ" });
      expect(mockAxios.get).toBeCalledWith(
        expect.stringContaining("/github/foo/bar/envvar?circle-token=BUZZ"),
        {}
      );
      expect(result[0]).toEqual(variable);
    });
  });

  describe("Add Env", () => {
    beforeEach(() => {
      mockAxios._setMockResponse({ data: variable });
    });

    it("should hit the add env endpoint with JSON headers", async () => {
      const result = await circle.addEnvVar(variable);
      expect(mockAxios.post).toBeCalledWith(
        `https://circleci.com/api/v1.1/project/github/foo/bar/envvar?circle-token=${TOKEN}`,
        variable,
        {
          headers: {
            "Content-Type": "application/json",
            Accepts: "application/json"
          }
        }
      );

      expect(result).toEqual(variable);
    });

    it("should override token and project", async () => {
      const result = await circle.addEnvVar(variable, {
        token: "BAR",
        vcs: { owner: "buzz" }
      });
      expect(mockAxios.post).toBeCalledWith(
        expect.stringContaining("/buzz/bar/envvar?circle-token=BAR"),
        variable,
        expect.any(Object)
      );

      expect(result).toEqual(variable);
    });
  });

  describe("Get Env", () => {
    beforeEach(() => {
      mockAxios._setMockResponse({ data: variable });
    });

    it("should get single environment variable", async () => {
      const result = await circle.getEnvVar("foo");

      expect(mockAxios.get).toBeCalledWith(
        `https://circleci.com/api/v1.1/project/github/foo/bar/envvar/foo?circle-token=${TOKEN}`,
        {}
      );
      expect(result).toEqual(variable);
    });

    it("should override client settings with custom token", async () => {
      const result = await circle.getEnvVar("foo", {
        token: "BUZZ",
        vcs: { owner: "bar" }
      });
      expect(mockAxios.get).toBeCalledWith(
        expect.stringContaining("/bar/bar/envvar/foo?circle-token=BUZZ"),
        {}
      );
      expect(result).toEqual(variable);
    });
  });

  describe("Get Env", () => {
    const response: DeleteEnvVarResponse = {
      message: "success"
    };

    beforeEach(() => {
      mockAxios._setMockResponse({ data: response });
    });

    it("should hit delete endpoint", async () => {
      const result = await circle.deleteEnvVar("foo");

      expect(mockAxios.delete).toBeCalledWith(
        `https://circleci.com/api/v1.1/project/github/foo/bar/envvar/foo?circle-token=${TOKEN}`,
        {}
      );
      expect(result).toEqual(response);
    });

    it("should override client settings with custom token", async () => {
      const result = await circle.deleteEnvVar("foo", {
        token: "BUZZ",
        vcs: { owner: "bar" }
      });
      expect(mockAxios.delete).toBeCalledWith(
        expect.stringContaining("/bar/bar/envvar/foo?circle-token=BUZZ"),
        {}
      );
      expect(result).toEqual(response);
    });
  });
});
