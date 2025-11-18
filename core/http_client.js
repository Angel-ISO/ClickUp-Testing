import axios from 'axios';
import result from './result.js';

const create_http_client = (base_url, token) => {
  const client = axios.create({
    baseURL: base_url,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const request = async (method, endpoint, data = null) => {
    try {
      const response = await client.request({
        method,
        url: endpoint,
        data,
      });
      return result.ok(response.data);
    } catch (err) {
      return result.error(err.message || 'Request failed');
    }
  };

  return {
    get: (endpoint) => request('GET', endpoint),
    post: (endpoint, data) => request('POST', endpoint, data),
    put: (endpoint, data) => request('PUT', endpoint, data),
    delete: (endpoint) => request('DELETE', endpoint),
  };
};

export default create_http_client;