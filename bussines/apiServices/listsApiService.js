import BaseApiService from './baseApiService.js';

class ListsApiService extends BaseApiService {

  async getLists(folderId) {
    return this.makeRequest('GET', `/folder/${folderId}/list`);
  }

  async createListInSpace(spaceId, listData) {
    return this.makeRequest('POST', `/space/${spaceId}/list`, listData);
  }

  async createListInFolder(folderId, listData) {
    return this.makeRequest('POST', `/folder/${folderId}/list`, listData);
  }

  async deleteList(listId) {
    return this.makeRequest('DELETE', `/list/${listId}`);
  }

  // Result monad methods - return Result directly without throwing
  async getListsResult(folderId) {
    return this.makeRequestResult('GET', `/folder/${folderId}/list`);
  }

  async deleteListResult(listId) {
    return this.makeRequestResult('DELETE', `/list/${listId}`);
  }

}

export default new ListsApiService();

export { ListsApiService };