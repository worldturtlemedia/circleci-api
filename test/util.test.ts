import {
  queryParams,
  validateVCSRequest,
  getGitType,
  createJsonHeader
} from "../src/util";
import { FullRequest, GitType } from "../src/types/lib";

describe("Util", () => {
  describe("Validate Git required request", () => {
    const blank: FullRequest = {
      token: "",
      vcs: { owner: "", repo: "" }
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
        vcs: { type: GitType.GITHUB, owner: "o", repo: "r" }
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
});
