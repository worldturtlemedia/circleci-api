let mockError: any;
let mockResponse: any = {};

const axiosMock: any = jest.genMockFromModule("axios");

function req() {
  return new Promise(function(resolve, reject) {
    if (mockError) {
      reject(mockError);
    } else {
      resolve(mockResponse);
    }
  });
}

axiosMock.reset = () => {
  mockError = null;
  mockResponse = {
    data: {},
    status: 200,
    statusText: "OK",
    headers: {},
    config: {}
  };
};

axiosMock.get.mockImplementation(req);

axiosMock.post.mockImplementation(req);

axiosMock.put.mockImplementation(req);

axiosMock.delete.mockImplementation(req);

axiosMock._setMockError = (err: any) => {
  mockError = err;
};

axiosMock._setMockResponse = (response: any) => {
  mockResponse = { ...mockResponse, ...response };
};

export default axiosMock;
