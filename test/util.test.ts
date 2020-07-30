import {
  queryParams,
  validateVCSRequest,
  getGitType,
  createJsonHeader,
  addUserAgentHeader,
} from "../src/util";
import { FullRequest, GitType } from "../src/types/lib";
import { AxiosRequestConfig } from "axios";

jest.mock(
  "../package.json",
  () => ({
    organization: "foo",
    name: "bar",
    version: "42",
  }),
  { virtual: true }
);

describe("Util", () => {
  describe("Validate Git required request", () => {
    const blank: FullRequest = {
      token: "",
      vcs: { owner: "", repo: "" },
    };

    it("should throw with all empty values", () => {
      expect(() => validateVCSRequest(blank)).toThrow(Error);
    });

    it("should throw on missing vcs", () => {
      expect(() => validateVCSRequest({ ...blank, token: "token" })).toThrow(
        /type||owner||repo/
      );
    });

    it("should successfully validate", () => {
      const valid: FullRequest = {
        token: "token",
        vcs: { type: GitType.GITHUB, owner: "o", repo: "r" },
      };
      expect(() => validateVCSRequest(valid)).not.toThrow();
    });
  });

  describe("Query Parameters", () => {
    it("should set branch", () => {
      expect(queryParams({ branch: "develop" })).toContain("branch=develop");
    });

    it("should set the filter", () => {
      expect(queryParams({ filter: "failed" })).toContain("filter=failed");
    });

    it("should return nothing", () => {
      expect(queryParams({})).toBe("");
      expect(queryParams()).toBe("");
    });

    it("should handle keys with undefined values", () => {
      expect(queryParams({ offset: undefined })).toBe("");
    });
  });

  it("should properly convert git type", () => {
    expect(getGitType("")).toEqual("github");
    expect(getGitType("bitbucket")).toEqual("bitbucket");
    expect(getGitType("BitB u ckeT ")).toEqual("bitbucket");
  });

  it("should create a json header object", () => {
    const { headers } = createJsonHeader();
    expect(headers).toBeInstanceOf(Object);
    expect(headers["Content-Type"]).toEqual("application/json");
    expect(headers.Accepts).toEqual("application/json");
  });

  it("should create the appropriate user agent string from the package.json", () => {
    const { headers } = addUserAgentHeader();
    expect(headers["User-Agent"]).not.toBeUndefined();
    expect(headers["User-Agent"]).toEqual("foo/bar 42");
  });

  it("should merge config object and only overwrite the user-agent header", () => {
    const config: AxiosRequestConfig = {
      baseURL: "foobar.com",
      headers: {
        foo: "bar",
      },
    };

    const mergedConfig = addUserAgentHeader(config);
    expect(mergedConfig).toEqual(
      expect.objectContaining({
        baseURL: "foobar.com",
        headers: {
          foo: "bar",
          "User-Agent": "foo/bar 42",
        },
      })
    );
  });
});
