import BaseApiService from './baseApiService.js';

class ListsApiService extends BaseApiService {

  async getLists(folderId) {
    return this.makeRequest('GET', `/folder/${folderId}/list`);
  }

  async createListInSpace(spaceId, listData) {
    return this.makeRequest('POST', `/space/${spaceId}/list`, listData);
  }
}

export default ListsApiService;