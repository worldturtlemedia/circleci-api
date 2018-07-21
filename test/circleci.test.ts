import { circleci } from "../src";
import * as client from "../src/client";
import { GitType } from "../src/types/lib";

jest.mock("../src/client");

const mock = client as any;
const token = "test-token";

describe("CircleCI", () => {
  describe("Factory", () => {
    beforeEach(() => {
      mock.__reset();
    });

    it("should override all options", () => {
      const circle = circleci({
        token,
        vcs: {
          type: GitType.BITBUCKET,
          owner: "test",
          repo: "test"
        },
        options: {
          branch: "develop",
          filter: "successful"
        }
      });

      // Override options, they shouldn't save
      circle
        .latestArtifacts({
          vcs: { type: GitType.GITHUB, owner: "foo", repo: "bar" }
        })
        .catch(jest.fn());

      expect(circle.defaults().vcs.owner).toBe("test");
    });

    it("should add token to url", () => {
      const circle = circleci({ token });
      const expected = `test?circle-token=${token}`;
      expect(circle.addToken("test")).toEqual(expected);
    });

    it("should throw credentials error", () => {
      const circle = circleci({ token });
      expect(() => circle.latestArtifacts()).toThrow();
    });

    it("should override request options and not fail", () => {
      const circle = circleci({ token });
      mock.__setResponse({ data: [1, 2, 3] });

      expect(() =>
        circle.latestArtifacts({
          token: "new-token",
          vcs: { type: GitType.BITBUCKET, owner: "j", repo: "d" }
        })
      ).not.toThrow();
    });
  });
});
