import BaseApiService from './baseApiService.js';

class FoldersApiService extends BaseApiService {
  async get_folders(space_id) {
    return this.make_request('GET', `/space/${space_id}/folder`);
  }

  async create_folder(space_id, folder_data) {
    return this.make_request('POST', `/space/${space_id}/folder`, folder_data);
  }

  async get_folder(folder_id) {
    return this.make_request('GET', `/folder/${folder_id}`);
  }

  async update_folder(folder_id, folder_data) {
    return this.make_request('PUT', `/folder/${folder_id}`, folder_data);
  }

  async delete_folder(folder_id) {
    return this.make_request('DELETE', `/folder/${folder_id}`);
  }

  // Method for testing with custom token (including no token or invalid token)
  async create_folder_with_custom_auth(space_id, folder_data, customToken = null) {
    return this.make_request_with_custom_auth('POST', `/space/${space_id}/folder`, folder_data, customToken);
  }

  async get_folders_with_custom_auth(space_id, customToken = null) {
    return this.make_request_with_custom_auth('GET', `/space/${space_id}/folder`, null, customToken);
  }

  async update_folder_with_custom_auth(folder_id, folder_data, customToken = null) {
    return this.make_request_with_custom_auth('PUT', `/folder/${folder_id}`, folder_data, customToken);
  }
}

export default new FoldersApiService();

export { FoldersApiService };