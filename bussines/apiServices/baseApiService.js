import createRequestManager from '../../core/requestManager.js';

class BaseApiService {
  constructor() {
    this.requestManager = createRequestManager();
  }

  async makeRequest(method, endpoint, data = null) {
    const result = await this.requestManager[method.toLowerCase()](endpoint, data);

    if (result.isOk()) {
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
  async makeRequestWithCustomAuth(method, endpoint, data = null, customToken = null) {
    const result = await this.requestManager.requestWithCustomAuth(method.toLowerCase(), endpoint, data, customToken);

    if (result.isOk()) {
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