import BaseApiService from './baseApiService.js';

class ListsApiService extends BaseApiService {

  async get_lists(folder_id) {
    return this.make_request('GET', `/folder/${folder_id}/list`);
  }
  
}

export default ListsApiService;