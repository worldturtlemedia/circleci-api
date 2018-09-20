import { CircleCI, getBuildSummaries, getRecentBuilds } from "../../src";
import { BuildSummary } from "../../src/types/api";
import * as client from "../../src/client";

jest.mock("../../src/client");

const mock = client as any;

describe("API - Builds", () => {
  const TOKEN = "test-token";
  const response: BuildSummary = { outcome: "success" };

  let circle: CircleCI;

  beforeEach(() => {
    mock.__reset();
    circle = new CircleCI({
      token: TOKEN,
      vcs: { owner: "foo", repo: "bar" }
    });
  });

  describe("Recent Builds", () => {
    it("should get recent builds", async () => {
      mock.__setResponse(response);
      const result = await circle.recentBuilds();

      expect(mock.__getMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/recent-builds"
      );
      expect(result).toEqual(response);
    });

    it("should filter recent builds", async () => {
      mock.__setResponse(response);
      const result = await circle.recentBuilds({ limit: 5, offset: 5 });

      expect(mock.__getMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/recent-builds?limit=5&offset=5"
      );
      expect(result).toEqual(response);
    });

    it("should handle no options", async () => {
      mock.__setResponse(response);
      const result = await getRecentBuilds(TOKEN);
      expect(mock.__getMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/recent-builds"
      );
      expect(result).toEqual(response);
    });
  });

  describe("Build Summaries", () => {
    it("should fetch latest builds for a project", async () => {
      mock.__setResponse(response);
      const result = await circle.builds();

      expect(mock.__getMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/project/github/foo/bar"
      );
      expect(result).toEqual(response);
    });

    it("should fetch latest builds with options", async () => {
      mock.__setResponse(response);
      const result = await circle.builds(undefined, { options: { limit: 5 } });

      expect(mock.__getMock).toBeCalledWith(
        expect.stringContaining("?limit=5")
      );
      expect(result).toEqual(response);
    });

    it("should fetch builds for branch", async () => {
      mock.__setResponse(response);
      const result = await circle.buildsFor();

      expect(mock.__getMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/project/github/foo/bar/tree/master"
      );
      expect(result).toEqual(response);
    });

    it("should fetch builds for branch with options", async () => {
      mock.__setResponse(response);
      const result = await circle.buildsFor(
        "master",
        { limit: 5 },
        {
          options: { branch: "develop" }
        }
      );

      expect(mock.__getMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/project/github/foo/bar/tree/master?limit=5"
      );
      expect(mock.__getMock).toBeCalledWith(expect.stringContaining("limit=5"));
      expect(result).toEqual(response);
    });

    it("should handle no options", async () => {
      mock.__setResponse(response);
      const result = await getBuildSummaries(TOKEN, {
        vcs: { owner: "foo", repo: "bar" }
      });

      expect(mock.__getMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/project/github/foo/bar"
      );
      expect(result).toEqual(response);
    });
  });

  describe("Full Builds", () => {
    it("should fetch full build", async () => {
      mock.__setResponse(response);
      const result = await circle.build(42);

      expect(mock.__getMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/project/github/foo/bar/42"
      );
      expect(result).toEqual(response);
    });

    it("should handle request options", async () => {
      mock.__setResponse(response);
      const result = await circle.build(42, { vcs: { owner: "test" } });
      expect(mock.__getMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/project/github/test/bar/42"
      );
      expect(result).toEqual(response);
    });
  });
});
