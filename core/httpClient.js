import axios from 'axios';
import Result from './result.js';

const createHttpClient = (baseURL, token) => {
  const client = axios.create({
    baseURL,
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
      return Result.ok(response.data);
    } catch (err) {
      return Result.error(err.message || 'Request failed');
    }
  };

  return {
    get: (endpoint) => request('GET', endpoint),
    post: (endpoint, data) => request('POST', endpoint, data),
    put: (endpoint, data) => request('PUT', endpoint, data),
    delete: (endpoint) => request('DELETE', endpoint),
  };
};

export default createHttpClient;