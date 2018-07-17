import { circleci, CircleCIFactory, API_ALL_PROJECTS } from "../../src";
import { Me, AllProjectsResponse } from "../../src/types/api";
import * as client from "../../src/client";

jest.mock("../../src/client");

const mock = client as any;

describe("API - Projects", () => {
  describe("All Projects", () => {
    const TOKEN = "test-token";
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

    let circle: CircleCIFactory = circleci({ token: TOKEN });

    beforeEach(() => {
      mock.__reset();
    });

    it('should call the "allProjects" endpoint', async () => {
      mock.__setResponse({ data: response });
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
});
