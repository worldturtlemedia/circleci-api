const mockClient: any = jest.genMockFromModule("./client")

let mockResponse: any | null
let mockErrorResponse: any | null

export function __reset() {
  mockResponse = null
  mockErrorResponse = null
}

/* tslint:disable-next-line:function-name */
export function __setResponse(result: any) {
  mockResponse = result
}

/* tslint:disable-next-line:function-name */
export function __setError(result: any) {
  mockErrorResponse = result
}

function handleResponse() {
  if (mockResponse !== null) {
    return Promise.resolve(mockResponse)
  }
  return Promise.reject(mockErrorResponse || mockResponse)
}

/* tslint:disable-next-line:variable-name */
export const __getMock = jest.fn(() => handleResponse())

/* tslint:disable-next-line:variable-name */
export const __postMock = jest.fn(() => handleResponse())

/* tslint:disable-next-line:variable-name */
export const __deleteMock = jest.fn(() => handleResponse())

export const client = jest.fn((token: string) => ({
  get: __getMock,
  post: __postMock,
  delete: __deleteMock,
}))

export default mockClient
