import { CircleCI, getLatestArtifacts } from "../../src"
import { Artifact } from "../../src/types/api"
import * as client from "../../src/client"

jest.mock("../../src/client")

const mock = client as any

describe("API - Artifacts", () => {
  const TOKEN = "test-token"
  const artifact: Artifact = {
    url: "http://test.com/1.txt",
    path: "docs",
  }

  let circle: CircleCI

  beforeEach(() => {
    mock.__reset()
    circle = new CircleCI({
      token: TOKEN,
      vcs: { owner: "test", repo: "proj" },
    })
  })

  describe("Build Artifacts", () => {
    it("should get artifacts for specific build", async () => {
      mock.__setResponse(artifact)
      const result = await circle.artifacts(42)

      expect(mock.__getMock).toBeCalledWith(
        expect.stringContaining("test/proj/42/artifacts"),
      )
      expect(result).toEqual(artifact)
    })
  })

  it("should get artifacts for specific build with options", async () => {
    mock.__setResponse(artifact)
    const result = await circle.artifacts(42, { vcs: { repo: "baz" } })

    expect(mock.__getMock).toBeCalledWith(
      expect.stringContaining("test/baz/42/artifacts"),
    )
    expect(result).toEqual(artifact)
  })

  it("should use a custom circleci host", async () => {
    mock.__setResponse(artifact)
    await new CircleCI({
      token: TOKEN,
      vcs: { owner: "test", repo: "proj" },
      circleHost: "foo.bar/api",
    }).artifacts(42)

    expect(mock.client).toBeCalledWith(TOKEN, "foo.bar/api", undefined)
  })

  describe("Latest Artifacts", () => {
    it("should fetch latest artifact for project", async () => {
      mock.__setResponse(artifact)
      const result = await getLatestArtifacts(TOKEN, {
        vcs: { owner: "t", repo: "r" },
      })

      expect(mock.client).toBeCalledWith(TOKEN, undefined, undefined)
      expect(mock.__getMock).toBeCalledWith(
        expect.stringContaining("t/r/latest/artifacts"),
      )
      expect(result).toEqual(artifact)
    })

    it("should fetch aritfacts for different project", async () => {
      mock.__setResponse(artifact)
      const result = await circle.latestArtifacts(undefined, {
        vcs: { owner: "test2" },
      })

      expect(mock.client).toBeCalledWith(TOKEN, undefined, undefined)
      expect(mock.__getMock).toBeCalledWith(
        expect.stringContaining("test2/proj/latest/artifacts"),
      )
      expect(result).toEqual(artifact)
    })

    it("should fetch latest aritfacts specific branch", async () => {
      mock.__setResponse(artifact)
      const result = await getLatestArtifacts(TOKEN, {
        vcs: { owner: "test", repo: "test" },
        options: { branch: "develop" },
      })

      expect(mock.client).toBeCalledWith(TOKEN, undefined, undefined)
      expect(mock.__getMock).toBeCalledWith(
        expect.stringContaining("branch=develop"),
      )
      expect(result).toEqual(artifact)
    })

    it("should use a custom circleci host", async () => {
      mock.__setResponse(artifact)
      await new CircleCI({
        token: TOKEN,
        vcs: { owner: "test", repo: "proj" },
        circleHost: "foo.bar/api",
      }).latestArtifacts()

      expect(mock.client).toBeCalledWith(TOKEN, "foo.bar/api", undefined)
    })

    it("should use the custom headers", async () => {
      mock.__setResponse(artifact)
      await getLatestArtifacts(TOKEN, {
        vcs: { owner: "test", repo: "proj" },
        customHeaders: { someHeader: "some_header_value" },
      })

      expect(mock.client).toBeCalledWith(TOKEN, undefined, {
        someHeader: "some_header_value",
      })
    })

    it("should throw an error if request fails", async () => {
      mock.__setError({ code: 404 })

      const check = circle.me()
      await expect(check).rejects.toEqual({ code: 404 })
    })
  })
})
