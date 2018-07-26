import { CircleCI } from "../src";

describe("Lib", () => {
  it("should export the circleci wrapper", () => {
    const circleci = new CircleCI({ token: "foo" });
    expect(circleci).toBeInstanceOf(CircleCI);
    expect(circleci.me).toBeInstanceOf(Function);
  });
});
