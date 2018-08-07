import * as axios from "axios";

import { CircleCI, TestMetadataResponse } from "../../src";

jest.mock("axios");

const mockAxios = axios.default as any;

describe("API - Test Metadata", () => {
  const TOKEN = "token";
  const variable: TestMetadataResponse = {
    tests: [
      {
        message: "ok"
      }
    ]
  };

  let circle: CircleCI;

  beforeEach(() => {
    mockAxios.reset();
    circle = new CircleCI({
      token: TOKEN,
      vcs: { owner: "foo", repo: "bar" }
    });
  });

  describe("Get Metadata", () => {
    beforeEach(() => {
      mockAxios._setMockResponse({ data: variable });
    });

    it("should get test metadata for build number", async () => {
      const result = await circle.getTestMetadata(42);

      expect(mockAxios.get).toBeCalledWith(
        `https://circleci.com/api/v1.1/project/github/foo/bar/42/tests?circle-token=${TOKEN}`,
        {}
      );
      expect(result.tests[0].message).toEqual("ok");
    });

    it("should override client settings with custom token", async () => {
      const result = await circle.getTestMetadata(42, { token: "BUZZ" });
      expect(mockAxios.get).toBeCalledWith(
        expect.stringContaining("/github/foo/bar/42/tests?circle-token=BUZZ"),
        {}
      );
      expect(result.tests[0].message).toEqual("ok");
    });
  });
});
