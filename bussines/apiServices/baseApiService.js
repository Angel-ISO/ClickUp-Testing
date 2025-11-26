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
      if (result.axiosError) {
        throw result.axiosError;
      }
      throw new Error(result.error);
    }
  }

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

  async make_request_result(method, endpoint, data = null) {
    return await this.request_manager[method.toLowerCase()](endpoint, data);
  }

  async make_request_with_custom_auth_result(method, endpoint, data = null, customToken = null) {
    return await this.request_manager.request_with_custom_auth(method.toLowerCase(), endpoint, data, customToken);
  }
}

export default BaseApiService;