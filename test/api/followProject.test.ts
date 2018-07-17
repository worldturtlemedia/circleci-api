import { circleci, CircleCIFactory, API_ALL_PROJECTS } from "../../src";
import { Me, AllProjectsResponse, FollowNewResult } from "../../src/types/api";
import * as client from "../../src/client";

jest.mock("../../src/client");

const mock = client as any;

describe("API - FollowProject", () => {
  const TOKEN = "test-token";
  const response: FollowNewResult = {
    followed: true,
    first_build: {
      branch: "master"
    }
  };

  let circle: CircleCIFactory = circleci({ token: TOKEN });

  beforeEach(() => {
    mock.__reset();
  });

  it("should follow a specific repository", async () => {
    mock.__setResponse({ data: response });
    const result = await circle.followProject({
      vcs: {
        owner: "johnsmith",
        repo: "tinker"
      }
    });

    expect(mock.client).toBeCalledWith(TOKEN);
    expect(mock.__postMock).toBeCalledWith(
      expect.stringContaining("johnsmith/tinker/follow")
    );
  });

  it("should throw an error if request fails", async () => {
    mock.__setError({ code: 404 });

    const check = circle.followProject({ vcs: { owner: "t", repo: "t" } });
    await expect(check).rejects.toEqual({ code: 404 });
  });
});
