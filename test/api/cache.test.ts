import * as axios from "axios";

import { CircleCI, ClearCacheResponse } from "../../src";

jest.mock("axios");

const mockAxios = axios.default as any;

describe("API - Cache", () => {
  const TOKEN = "test-token";
  const response: ClearCacheResponse = { status: "BAR" };

  let circle: CircleCI;

  beforeEach(() => {
    mockAxios.reset();
    circle = new CircleCI({
      token: TOKEN,
      vcs: { owner: "foo", repo: "bar" }
    });
    mockAxios._setMockResponse({ data: response });
  });

  describe("Clear Cache", () => {
    it("should hit clear cache endpoint", async () => {
      const result = await circle.clearCache();

      expect(mockAxios.delete).toBeCalledWith(
        `https://circleci.com/api/v1.1/project/github/foo/bar/build-cache?circle-token=${TOKEN}`,
        {}
      );
      expect(result).toEqual(response);
    });

    it("should override client settings with custom token", async () => {
      const result = await circle.clearCache({
        token: "BUZZ",
        vcs: { repo: "foo" }
      });
      expect(mockAxios.delete).toBeCalledWith(
        expect.stringContaining("/foo/foo/build-cache?circle-token=BUZZ"),
        {}
      );
      expect(result).toEqual(response);
    });
  });
});
