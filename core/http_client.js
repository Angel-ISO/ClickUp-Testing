import axios from 'axios';
import result from './result.js';

const create_http_client = (base_url, token) => {
  const client = axios.create({
    baseURL: base_url,
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const request = async (method, endpoint, data = null) => {
    try {
      const config = {
        method,
        url: endpoint,
        data,
        headers: {}
      };

      if (method === 'GET' || method === 'DELETE') {
        config.headers['accept'] = 'application/json';
      } else {
        config.headers['Content-Type'] = 'application/json';
      }

      const response = await client.request(config);
      return result.ok(response.data);
    } catch (err) {
      // Preserve the full axios error structure for better error handling
      const errorMessage = err.response?.data?.err || err.message || 'Request failed';
      const errorResult = result.error(errorMessage);

      // Attach the full axios error for tests that need status codes and response data
      if (err.response) {
        errorResult.axiosError = err;
      }

      return errorResult;
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