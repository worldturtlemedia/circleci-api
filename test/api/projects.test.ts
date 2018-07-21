import { CircleCI, API_ALL_PROJECTS } from "../../src";
import { AllProjectsResponse, FollowNewResult } from "../../src/types/api";
import * as client from "../../src/client";

jest.mock("../../src/client");

const mock = client as any;
const TOKEN = "test-token";

describe("API - Projects", () => {
  let circle: CircleCI;

  beforeEach(() => {
    mock.__reset();

    circle = new CircleCI({ token: TOKEN });
  });

  describe("All Projects", () => {
    const response: AllProjectsResponse = [
      {
        reponame: "test1",
        username: "Tom",
        branches: { master: {} }
      },
      {
        reponame: "test2",
        username: "Tom",
        branches: { master: {} }
      }
    ];

    it('should call the "allProjects" endpoint', async () => {
      mock.__setResponse(response);
      const result = await circle.projects();

      expect(mock.client).toBeCalledWith(TOKEN);
      expect(mock.__getMock).toBeCalledWith(API_ALL_PROJECTS);
      expect(result).toEqual(response);
    });

    it("should throw an error if request fails", async () => {
      mock.__setError({ code: 404 });

      const check = circle.projects();
      await expect(check).rejects.toEqual({ code: 404 });
    });
  });

  describe("FollowProject", () => {
    const response: FollowNewResult = {
      followed: true,
      first_build: {
        branch: "master"
      }
    };

    it("should follow a specific repository", async () => {
      mock.__setResponse({ data: response });
      await circle.followProject({
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
});
