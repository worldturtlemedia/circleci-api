import { CircleCI, CircleCIFactory, getGitType, GitType } from "../src";

describe("Lib", () => {
  it("should export the circleci wrapper", () => {
    const circleci = new CircleCI({ token: "foo" });
    expect(circleci).toBeInstanceOf(CircleCI);
    expect(circleci.me).toBeInstanceOf(Function);
  });

  it("should export required components", () => {
    expect(getGitType("bitbucket")).toEqual(GitType.BITBUCKET);
    expect(CircleCIFactory(" ").get).toBeInstanceOf(Function);
  });
});
