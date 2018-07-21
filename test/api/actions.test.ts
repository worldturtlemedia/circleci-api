import { CircleCI, GitType, postTriggerNewBuild } from "../../src";
import { BuildActionResponse, TriggerBuildResponse } from "../../src/types/api";
import * as client from "../../src/client";

jest.mock("../../src/client");

const mock = client as any;
const TOKEN = "test-token";

describe("API - Actions", () => {
  let circle: CircleCI;

  beforeEach(() => {
    mock.__reset();

    circle = new CircleCI({
      token: TOKEN,
      vcs: { owner: "test", repo: "repotest" }
    });
  });

  describe("Retry & Cancel", () => {
    const response: BuildActionResponse = {
      outcome: "success",
      status: "finished",
      build_num: 42
    };

    describe("Retry", () => {
      it("should use defaults to retry build", async () => {
        mock.__setResponse(response);
        const result = await circle.retry(5);

        expect(mock.client).toBeCalledWith(TOKEN);
        expect(mock.__postMock).toBeCalledWith(
          "https://circleci.com/api/v1.1/project/github/test/repotest/5/retry"
        );
        expect(result).toEqual(response);
      });

      it("should use passed in options", async () => {
        mock.__setResponse(response);
        const result = await circle.retry(5, {
          token: "test",
          vcs: { type: GitType.BITBUCKET, repo: "square" }
        });

        expect(mock.client).toBeCalledWith(TOKEN);
        expect(mock.__postMock).toBeCalledWith(
          "https://circleci.com/api/v1.1/project/bitbucket/test/square/5/retry"
        );
        expect(result).toEqual(response);
      });

      it("should throw an error if request fails", async () => {
        mock.__setError({ code: 404 });

        const check = circle.retry(5);
        await expect(check).rejects.toEqual({ code: 404 });
      });
    });

    describe("Cancel", () => {
      it("should use defaults to cancel build", async () => {
        mock.__setResponse(response);
        const result = await circle.cancel(5);

        expect(mock.client).toBeCalledWith(TOKEN);
        expect(mock.__postMock).toBeCalledWith(
          "https://circleci.com/api/v1.1/project/github/test/repotest/5/cancel"
        );
        expect(result).toEqual(response);
      });

      it("should use passed in options", async () => {
        mock.__setResponse(response);
        const result = await circle.cancel(5, {
          token: "test",
          vcs: { type: GitType.BITBUCKET, repo: "square" }
        });

        expect(mock.client).toBeCalledWith(TOKEN);
        expect(mock.__postMock).toBeCalledWith(
          "https://circleci.com/api/v1.1/project/bitbucket/test/square/5/cancel"
        );
        expect(result).toEqual(response);
      });
    });
  });

  describe("Trigger Build", () => {
    const response: TriggerBuildResponse = {
      body: "test",
      build_num: 42,
      branch: "master"
    };

    it("should use defaults to trigger a build", async () => {
      mock.__setResponse(response);
      const result = await circle.triggerBuild();

      expect(mock.client).toBeCalledWith(TOKEN);
      expect(mock.__postMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/project/github/test/repotest",
        expect.any(Object)
      );
      expect(result).toEqual(response);
    });

    it("should use passed in options", async () => {
      mock.__setResponse(response);
      const result = await circle.triggerBuild({
        token: "test",
        vcs: { type: GitType.BITBUCKET, repo: "square" },
        options: { branch: "develop" }
      });

      expect(mock.client).toBeCalledWith(TOKEN);
      expect(mock.__postMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/project/bitbucket/test/square/tree/develop",
        expect.any(Object)
      );
      expect(result).toEqual(response);
    });
  });

  describe("Trigger Build For Branch", () => {
    const response: TriggerBuildResponse = {
      body: "test",
      build_num: 42,
      branch: "master"
    };

    it("should build default master", async () => {
      mock.__setResponse(response);
      const result = await circle.triggerBuildFor();

      expect(mock.client).toBeCalledWith(TOKEN);
      expect(mock.__postMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/project/github/test/repotest/tree/master",
        expect.any(Object)
      );
      expect(result).toEqual(response);
    });

    it("should use passed in options", async () => {
      mock.__setResponse(response);
      const result = await circle.triggerBuildFor("feat", {
        token: "test",
        vcs: { type: GitType.BITBUCKET, repo: "square" },
        options: { newBuildOptions: { tag: "foo" } }
      });

      expect(mock.client).toBeCalledWith(TOKEN);
      expect(mock.__postMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/project/bitbucket/test/square/tree/feat",
        expect.objectContaining({
          tag: "foo"
        })
      );
      expect(result).toEqual(response);
    });

    it("should handle no options", async () => {
      mock.__setResponse(response);
      const result = await postTriggerNewBuild(TOKEN, {
        vcs: { owner: "foo", repo: "bar" }
      });
      expect(mock.__postMock).toBeCalledWith(
        "https://circleci.com/api/v1.1/project/github/foo/bar",
        expect.any(Object)
      );
      expect(result).toEqual(response);
    });
  });
});
