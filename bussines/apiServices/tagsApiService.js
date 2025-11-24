import BaseApiService from './baseApiService.js';

class TagsApiService extends BaseApiService {

  async get_tags(space_id) {
    return this.make_request('GET', `/space/${space_id}/tag`);
  }

  async create_tag(space_id, tag_data) {
    return this.make_request('POST', `/space/${space_id}/tag`, tag_data);
  }

  async update_tag(space_id, tag_name, tag_data) {
    return this.make_request('PUT', `/space/${space_id}/tag/${encodeURIComponent(tag_name)}`, tag_data);
  }

  async delete_tag(space_id, tag_name) {
    return this.make_request('DELETE', `/space/${space_id}/tag/${encodeURIComponent(tag_name)}`);
  }

  async add_tag_to_task(task_id, tag_name) {
    return this.make_request('POST', `/task/${task_id}/tag/${encodeURIComponent(tag_name)}`);
  }

  async remove_tag_from_task(task_id, tag_name) {
    return this.make_request('DELETE', `/task/${task_id}/tag/${encodeURIComponent(tag_name)}`);
  }
}

export default TagsApiService;
