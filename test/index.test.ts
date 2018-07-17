import { circleci } from "../src/index";

describe("Lib", () => {
  it("should export the circleci wrapper", () => {
    expect(circleci).toBeInstanceOf(Function);
    expect(circleci({ token: "t" }).me).toBeInstanceOf(Function);
  });
});
