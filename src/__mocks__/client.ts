import { AxiosResponse, AxiosError } from "axios";

const mockClient: any = jest.genMockFromModule("./client");

let mockResponse: AxiosResponse | null;
let mockErrorResponse: AxiosError | null;

export function __reset() {
  mockResponse = null;
  mockErrorResponse = null;
}

/* tslint:disable-next-line:function-name */
export function __setResponse(result: AxiosResponse) {
  mockResponse = result;
}

/* tslint:disable-next-line:function-name */
export function __setError(result: AxiosError) {
  mockErrorResponse = result;
}

function handleResponse() {
  if (
    mockResponse !== null &&
    (mockResponse.status === 200 || mockResponse.data)
  ) {
    return Promise.resolve(mockResponse);
  }
  return Promise.reject(mockErrorResponse || mockResponse);
}

/* tslint:disable-next-line:variable-name */
export const __getMock = jest.fn(() => handleResponse());

/* tslint:disable-next-line:variable-name */
export const __postMock = jest.fn(() => handleResponse());

export const client = jest.fn((token: string) => ({
  get: __getMock,
  post: __postMock
}));

export default mockClient;
