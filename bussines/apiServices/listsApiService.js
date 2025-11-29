import BaseApiService from './baseApiService.js';

class ListsApiService extends BaseApiService {

  async get_lists(folder_id) {
    return this.make_request('GET', `/folder/${folder_id}/list`);
  }

  async create_list_in_space(space_id, list_data) {
    return this.make_request('POST', `/space/${space_id}/list`, list_data);
  }

  async delete_list(list_id){
    return this.make_request('DELETE', `/list/${list_id}`);
  }

}

export default new ListsApiService();

export { ListsApiService };