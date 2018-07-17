import { circleci, CircleCIFactory, API_ME } from "../../src";
import { Me } from "../../src/types/api";
import * as client from "../../src/client";

jest.mock("../../src/client");

const mock = client as any;

describe("CircleCI", () => {
  const TOKEN = "test-token";
  const me: Me = {
    name: "Test",
    student: false,
    login: "test@test.com"
  };

  let circle: CircleCIFactory = circleci({ token: TOKEN });

  beforeEach(() => {
    mock.__reset();
  });

  it('should call the "me" endpoint', async () => {
    mock.__setResponse({ data: me });
    const result = await circle.me();

    expect(mock.client).toBeCalledWith(TOKEN);
    expect(mock.__getMock).toBeCalledWith(API_ME);
    expect(result).toEqual(me);
  });
});
