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

  async createFolderWithCustomAuth(spaceId, folderData, customToken = null) {
    return this.makeRequestWithCustomAuth('POST', `/space/${spaceId}/folder`, folderData, customToken);
  }

  async getFoldersWithCustomAuth(spaceId, customToken = null) {
    return this.makeRequestWithCustomAuth('GET', `/space/${spaceId}/folder`, null, customToken);
  }

  async updateFolderWithCustomAuth(folderId, folderData, customToken = null) {
    return this.makeRequestWithCustomAuth('PUT', `/folder/${folderId}`, folderData, customToken);
  }

  // Result monad methods - return Result directly without throwing
  async getFoldersResult(spaceId) {
    return this.makeRequestResult('GET', `/space/${spaceId}/folder`);
  }

  async createFolderResult(spaceId, folderData) {
    return this.makeRequestResult('POST', `/space/${spaceId}/folder`, folderData);
  }

  async getFolderResult(folderId) {
    return this.makeRequestResult('GET', `/folder/${folderId}`);
  }

  async updateFolderResult(folderId, folderData) {
    return this.makeRequestResult('PUT', `/folder/${folderId}`, folderData);
  }

  async deleteFolderResult(folderId) {
    return this.makeRequestResult('DELETE', `/folder/${folderId}`);
  }

  async createFolderWithCustomAuthResult(spaceId, folderData, customToken = null) {
    return this.makeRequestWithCustomAuthResult('POST', `/space/${spaceId}/folder`, folderData, customToken);
  }

  async getFoldersWithCustomAuthResult(spaceId, customToken = null) {
    return this.makeRequestWithCustomAuthResult('GET', `/space/${spaceId}/folder`, null, customToken);
  }

  async updateFolderWithCustomAuthResult(folderId, folderData, customToken = null) {
    return this.makeRequestWithCustomAuthResult('PUT', `/folder/${folderId}`, folderData, customToken);
  }
}

export default new FoldersApiService();

export { FoldersApiService };