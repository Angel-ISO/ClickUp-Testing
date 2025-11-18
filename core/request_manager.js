import create_http_client from './http_client.js';

let instance = null;

const create_request_manager = () => {
  if (instance) return instance;

  const base_url = process.env.CLICKUP_BASE_URL;
  const token = process.env.CLICKUP_TOKEN;
  const http_client = create_http_client(base_url, token);

  instance = {
    get: http_client.get,
    post: http_client.post,
    put: http_client.put,
    delete: http_client.delete,
  };

  return instance;
};

export default create_request_manager;