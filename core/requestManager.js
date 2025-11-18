import createHttpClient from './httpClient.js';

let instance = null;

const createRequestManager = () => {
  if (instance) return instance;

  const baseURL = process.env.CLICKUP_BASE_URL;
  const token = process.env.CLICKUP_TOKEN;
  const httpClient = createHttpClient(baseURL, token);

  instance = {
    get: httpClient.get,
    post: httpClient.post,
    put: httpClient.put,
    delete: httpClient.delete,
  };

  return instance;
};

export default createRequestManager;