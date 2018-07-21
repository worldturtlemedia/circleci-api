import { circleci, CircleCIFactory, getLatestArtifacts } from "../../src";
import { Artifact } from "../../src/types/api";
import * as client from "../../src/client";

jest.mock("../../src/client");

const mock = client as any;

describe("API - Artifacts", () => {
  const TOKEN = "test-token";
  const artifact: Artifact = {
    url: "http://test.com/1.txt",
    path: "docs"
  };

  let circle: CircleCIFactory = circleci({
    token: TOKEN,
    vcs: { owner: "test", repo: "proj" }
  });

  beforeEach(() => {
    mock.__reset();
  });

  it("should fetch latest artifact for project", async () => {
    mock.__setResponse(artifact);
    const result = await getLatestArtifacts(TOKEN, {
      vcs: { owner: "t", repo: "r" }
    });

    expect(mock.client).toBeCalledWith(TOKEN);
    expect(mock.__getMock).toBeCalledWith(
      expect.stringContaining("t/r/latest/artifacts")
    );
    expect(result).toEqual(artifact);
  });

  it("should fetch aritfacts for different project", async () => {
    mock.__setResponse(artifact);
    const result = await circle.latestArtifacts({
      vcs: { owner: "test2" }
    });

    expect(mock.client).toBeCalledWith(TOKEN);
    expect(mock.__getMock).toBeCalledWith(
      expect.stringContaining("test2/proj/latest/artifacts")
    );
    expect(result).toEqual(artifact);
  });

  it("should fetch latest aritfacts specific branch", async () => {
    mock.__setResponse(artifact);
    const result = await getLatestArtifacts(TOKEN, {
      vcs: { owner: "test", repo: "test" },
      options: { branch: "develop" }
    });

    expect(mock.client).toBeCalledWith(TOKEN);
    expect(mock.__getMock).toBeCalledWith(
      expect.stringContaining("branch=develop")
    );
    expect(result).toEqual(artifact);
  });

  it("should throw an error if request fails", async () => {
    mock.__setError({ code: 404 });

    const check = circle.me();
    await expect(check).rejects.toEqual({ code: 404 });
  });
});
