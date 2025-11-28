import BaseApiService from './baseApiService.js';

class FoldersApiService extends BaseApiService {

  async getFolders(spaceId) {
    return this.makeRequest('GET', `/space/${spaceId}/folder`);
  }


  async createFolder(spaceId, folderData) {
    return this.makeRequest('POST', `/space/${spaceId}/folder`, folderData);
  }

  async getFolder(folderId) {
    return this.makeRequest('GET', `/folder/${folderId}`);
  }


  async updateFolder(folderId, folderData) {
    return this.makeRequest('PUT', `/folder/${folderId}`, folderData);
  }


  async deleteFolder(folderId) {
    return this.makeRequest('DELETE', `/folder/${folderId}`);
  }

  // Method for testing with custom token (including no token or invalid token)
  async createFolderWithCustomAuth(spaceId, folderData, customToken = null) {
    return this.makeRequestWithCustomAuth('POST', `/space/${spaceId}/folder`, folderData, customToken);
  }

  async getFoldersWithCustomAuth(spaceId, customToken = null) {
    return this.makeRequestWithCustomAuth('GET', `/space/${spaceId}/folder`, null, customToken);
  }

  async updateFolderWithCustomAuth(folderId, folderData, customToken = null) {
    return this.makeRequestWithCustomAuth('PUT', `/folder/${folderId}`, folderData, customToken);
  }
}

export default FoldersApiService;