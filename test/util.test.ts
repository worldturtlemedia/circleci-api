import { queryParams, validateVCSRequest } from "../src/util";
import { FullRequest } from "../src/types/lib";

describe("Util", () => {
  describe("Validate Git required request", () => {
    const blank: FullRequest = {
      token: "",
      vcs: { type: "", owner: "", repo: "" }
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
        vcs: { type: "t", owner: "o", repo: "r" }
      };
      expect(validateVCSRequest(valid)).toBeTruthy();
    });
  });

  describe("Query Parameters", () => {
    it("should add default query params", () => {
      const t = queryParams();
      expect(t).toEqual("?branch=master&filter=successful");
    });

    it("should set branch", () => {
      expect(queryParams({ branch: "develop" })).toContain("branch=develop");
    });

    it("should set the filter", () => {
      expect(queryParams({ filter: "failed" })).toContain("filter=failed");
    });
  });
});
