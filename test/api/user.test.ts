import { CircleCI, API_ME, getMe } from "../../src"
import { Me } from "../../src/types/api"
import * as client from "../../src/client"

jest.mock("../../src/client")

const mock = client as any

describe("API - Me", () => {
  const TOKEN = "test-token"
  const me: Me = {
    name: "Test",
    student: false,
    login: "test@test.com",
  }

  let circle: CircleCI

  beforeEach(() => {
    mock.__reset()
    circle = new CircleCI({ token: TOKEN })
  })

  it('should call the "me" endpoint', async () => {
    mock.__setResponse(me)
    const result = await circle.me()

    expect(mock.client).toBeCalledWith(TOKEN, undefined, undefined)
    expect(mock.__getMock).toBeCalledWith(API_ME)
    expect(result).toEqual(me)
  })

  it("should throw an error if request fails", async () => {
    mock.__setError({ code: 404 })

    const check = circle.me()
    await expect(check).rejects.toEqual({ code: 404 })
  })

  it("should use the default circleci host", async () => {
    mock.__setResponse(me)
    await getMe(TOKEN)

    expect(mock.client).toBeCalledWith(TOKEN, undefined, undefined)
  })

  it("should use a custom circleci host", async () => {
    mock.__setResponse(me)
    await new CircleCI({
      token: TOKEN,
      circleHost: "foo.bar/api",
    }).projects()

    expect(mock.client).toBeCalledWith(TOKEN, "foo.bar/api", undefined)
  })
})
