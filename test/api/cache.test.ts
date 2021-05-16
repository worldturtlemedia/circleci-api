import * as axios from "axios"

import { CircleCI, ClearCacheResponse } from "../../src"

jest.mock("axios")

const mockAxios = axios.default as any

describe("API - Cache", () => {
  const TOKEN = "test-token"
  const response: ClearCacheResponse = { status: "BAR" }

  let circle: CircleCI

  beforeEach(() => {
    mockAxios.reset()
    circle = new CircleCI({
      token: TOKEN,
      vcs: { owner: "foo", repo: "bar" },
    })
    mockAxios._setMockResponse({ data: response })
  })

  describe("Clear Cache", () => {
    it("should hit clear cache endpoint", async () => {
      const result = await circle.clearCache()

      expect(mockAxios.delete).toBeCalledWith(
        `/project/github/foo/bar/build-cache?circle-token=${TOKEN}`,
        expect.anything(),
      )
      expect(result).toEqual(response)
    })

    it("should override client settings with custom token", async () => {
      const result = await circle.clearCache({
        token: "BUZZ",
        vcs: { repo: "foo" },
      })
      expect(mockAxios.delete).toBeCalledWith(
        expect.stringContaining("/foo/foo/build-cache?circle-token=BUZZ"),
        expect.anything(),
      )
      expect(result).toEqual(response)
    })

    it("should use a custom circleci host", async () => {
      await new CircleCI({
        token: TOKEN,
        vcs: { owner: "test", repo: "proj" },
        circleHost: "foo.bar/api",
      }).clearCache()

      expect(mockAxios.delete).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({ baseURL: "foo.bar/api" }),
      )
    })
  })
})
