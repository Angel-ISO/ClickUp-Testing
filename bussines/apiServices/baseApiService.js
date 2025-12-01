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
      if (result.axiosError) {
        throw result.axiosError;
      }
      throw new Error(result.error);
    }
  }

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

  async makeRequestResult(method, endpoint, data = null) {
    return await this.requestManager[method.toLowerCase()](endpoint, data);
  }

  async makeRequestWithCustomAuthResult(method, endpoint, data = null, customToken = null) {
    return await this.requestManager.requestWithCustomAuth(method.toLowerCase(), endpoint, data, customToken);
  }
}

export default BaseApiService;