import createHttpClient from "./httpClient.js";

let instance = null;

const createRequestManager = () => {
  if (instance) return instance;

  const baseUrl = process.env.CLICKUP_BASE_URL;
  const token = process.env.CLICKUP_TOKEN;
  const httpClient = createHttpClient(baseUrl, token);

  instance = {
    get: httpClient.get,
    post: httpClient.post,
    put: httpClient.put,
    delete: httpClient.delete,

    // Method for custom authentication (security testing)
    requestWithCustomAuth: (method, endpoint, data, customToken) => {
      const customClient = createHttpClient(baseUrl, customToken);
      return customClient[method](endpoint, data);
    },
  };

  return instance;
};

export default createRequestManager;
