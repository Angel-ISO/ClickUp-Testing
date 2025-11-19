import create_request_manager from '../../core/request_manager.js';

class BaseApiService {
  constructor() {
    this.request_manager = create_request_manager();
  }

  async make_request(method, endpoint, data = null) {
    const result = await this.request_manager[method.toLowerCase()](endpoint, data);

    if (result.is_ok()) {
      return result.value;
    } else {
      // If there's an axios error attached, throw it to preserve status and response data
      if (result.axiosError) {
        throw result.axiosError;
      }
      throw new Error(result.error);
    }
  }

  // Method to make requests with custom authentication (for security testing)
  async make_request_with_custom_auth(method, endpoint, data = null, customToken = null) {
    const result = await this.request_manager.request_with_custom_auth(method.toLowerCase(), endpoint, data, customToken);

    if (result.is_ok()) {
      return result.value;
    } else {
      if (result.axiosError) {
        throw result.axiosError;
      }
      throw new Error(result.error);
    }
  }
}

export default BaseApiService;