import axios from "axios"

import { client, circleGet, circlePost, circleDelete } from "../src/client"
import { API_BASE } from "../src"
import { addUserAgentHeader } from "../src/util"

jest.mock("axios")

const mockAxios = axios as any

/**
 * TODO
 * Add tests for the auth param adder
 */

const TOKEN = "test-token"
const URL = "cats.com"
const URL_WITH_TOKEN = `${URL}?circle-token=${TOKEN}`

describe("Client", () => {
  beforeEach(() => {
    mockAxios.reset()
  })

  describe("Factory", () => {
    it("should call the default Circle URL", () => {
      client(TOKEN).get(URL).catch(jest.fn())
      expect(mockAxios.get).toBeCalledWith(URL_WITH_TOKEN, {
        baseURL: API_BASE,
        ...addUserAgentHeader(),
      })
    })

    it("should call a custom Circle URL", () => {
      client(TOKEN, "foo.bar/api").get(URL).catch(jest.fn())
      expect(mockAxios.get).toBeCalledWith(URL_WITH_TOKEN, {
        baseURL: "foo.bar/api",
        ...addUserAgentHeader(),
      })
    })

    it("should override the custom url with another url", () => {
      client(TOKEN, "foo.bar/api")
        .get(URL, { baseURL: "biz.baz/api" })
        .catch(jest.fn())
      expect(mockAxios.get).toBeCalledWith(URL_WITH_TOKEN, {
        baseURL: "biz.baz/api",
        ...addUserAgentHeader(),
      })
    })

    it("should add token param to url for get", () => {
      client(TOKEN).get(URL).catch(jest.fn())
      expect(mockAxios.get).toBeCalledWith(URL_WITH_TOKEN, expect.anything())
    })

    it("should add token param to url for post", () => {
      client(TOKEN).post(URL, null).catch(jest.fn())
      expect(mockAxios.post).toBeCalledWith(
        URL_WITH_TOKEN,
        null,
        expect.anything(),
      )
    })

    it("should use custom headers", () => {
      client(TOKEN, undefined, { someHeader: "some_header_value" })
        .get(URL)
        .catch(jest.fn())
      expect(mockAxios.get).toBeCalledWith(
        URL_WITH_TOKEN,
        expect.objectContaining({
          headers: expect.objectContaining({ someHeader: "some_header_value" }),
        }),
      )
    })

    it("should use options", () => {
      client(TOKEN).post(URL, "test", { timeout: 1000 }).catch(jest.fn())
      expect(mockAxios.post).toBeCalledWith(
        URL_WITH_TOKEN,
        "test",
        expect.objectContaining({
          timeout: 1000,
        }),
      )
    })

    it("should add the user-agent to the get request", () => {
      client(TOKEN).get(URL).catch(jest.fn())
      expect(mockAxios.get).toBeCalledWith(
        URL_WITH_TOKEN,
        expect.objectContaining(addUserAgentHeader()),
      )
    })

    it("should add the user-agent to the post request", () => {
      client(TOKEN).post(URL, "payload").catch(jest.fn())
      expect(mockAxios.post).toBeCalledWith(
        URL_WITH_TOKEN,
        "payload",
        expect.objectContaining(addUserAgentHeader()),
      )
    })

    it("should add the user-agent to the delete request", () => {
      client(TOKEN).delete(URL).catch(jest.fn())
      expect(mockAxios.get).toBeCalledWith(
        URL_WITH_TOKEN,
        expect.objectContaining(addUserAgentHeader()),
      )
    })
  })

  describe("circleGet", () => {
    it("should get url with auth token", () => {
      /* tslint:disable-next-line:deprecation */
      circleGet(TOKEN, URL).catch(jest.fn())
      expect(mockAxios.get).toBeCalledWith(URL_WITH_TOKEN, expect.anything())
    })

    it("should get url with options", () => {
      /* tslint:disable-next-line:deprecation */
      circleGet(TOKEN, URL, { timeout: 1000 }).catch(jest.fn())
      expect(mockAxios.get).toBeCalledWith(
        URL_WITH_TOKEN,
        expect.objectContaining({
          timeout: 1000,
        }),
      )
    })

    it("should handle null options", () => {
      /* tslint:disable-next-line:deprecation */
      circleGet(TOKEN, URL, undefined).catch(jest.fn())
      expect(mockAxios.get).toBeCalledWith(URL_WITH_TOKEN, expect.anything())
    })

    it("should add circle-token param with ?", () => {
      /* tslint:disable-next-line:deprecation */
      circleGet("foo", "bar.com").catch(jest.fn())
      expect(mockAxios.get).toBeCalledWith(
        "bar.com?circle-token=foo",
        expect.anything(),
      )
    })

    it("should add circle-token param with &", () => {
      /* tslint:disable-next-line:deprecation */
      circleGet("foo", "bar.com?fizz=buzz").catch(jest.fn())
      expect(mockAxios.get).toBeCalledWith(
        "bar.com?fizz=buzz&circle-token=foo",
        expect.anything(),
      )
    })

    it("should return data after awaiting promise", () => {
      const catchFn = jest.fn()
      const thenFn = jest.fn()

      client(TOKEN).get("/biz/baz").then(thenFn).catch(catchFn)

      expect(mockAxios.get).toHaveBeenCalledWith(
        `/biz/baz?circle-token=${TOKEN}`,
        expect.anything(),
      )

      mockAxios._setMockResponse({ data: "okay" })
    })
  })

  describe("circlePost", () => {
    it("should post url", () => {
      /* tslint:disable-next-line:deprecation */
      circlePost(TOKEN, URL, null).catch(jest.fn())
      expect(mockAxios.post).toBeCalledWith(
        URL_WITH_TOKEN,
        null,
        expect.anything(),
      )
    })

    it("should post url with options", () => {
      /* tslint:disable-next-line:deprecation */
      circlePost(TOKEN, URL, { cat: "meow" }, { timeout: 1 }).catch(jest.fn())
      expect(mockAxios.post).toBeCalledWith(
        URL_WITH_TOKEN,
        { cat: "meow" },
        expect.objectContaining({ timeout: 1 }),
      )
    })

    it("should return data after awaiting promise", () => {
      const catchFn = jest.fn()
      const thenFn = jest.fn()

      client(TOKEN).post("/biz/baz", { foo: "bar" }).then(thenFn).catch(catchFn)

      expect(mockAxios.post).toHaveBeenCalledWith(
        `/biz/baz?circle-token=${TOKEN}`,
        { foo: "bar" },
        expect.anything(),
      )

      mockAxios._setMockResponse({ data: "okay" })
    })
  })

  describe("circleDelete", () => {
    it("should send delete to url", () => {
      /* tslint:disable-next-line:deprecation */
      circleDelete("foo", "bar.com").catch(jest.fn())
      expect(mockAxios.delete).toBeCalledWith(
        "bar.com?circle-token=foo",
        expect.anything(),
      )
    })

    it("should delete url with options", () => {
      /* tslint:disable-next-line:deprecation */
      circleDelete(TOKEN, URL, { timeout: 1000 }).catch(jest.fn())
      expect(mockAxios.delete).toBeCalledWith(
        URL_WITH_TOKEN,
        expect.objectContaining({
          timeout: 1000,
        }),
      )
    })

    it("should be able to use the factory to delete", () => {
      const catchFn = jest.fn()
      const thenFn = jest.fn()

      client(TOKEN).delete("/biz/baz").then(thenFn).catch(catchFn)

      expect(mockAxios.delete).toHaveBeenCalledWith(
        `/biz/baz?circle-token=${TOKEN}`,
        expect.anything(),
      )

      mockAxios._setMockResponse({ data: "okay" })
    })
  })
})
