import BaseApiService from './baseApiService.js';

class TasksApiService extends BaseApiService {

  async get_tasks(list_id) {
    return this.make_request('GET', `/list/${list_id}/task`);
  }


  async create_task(list_id, task_data) {
    return this.make_request('POST', `/list/${list_id}/task`, task_data);
  }

  async get_task(task_id) {
    return this.make_request('GET', `/task/${task_id}`);
  }


  async update_task(task_id, task_data) {
    return this.make_request('PUT', `/task/${task_id}`, task_data);
  }


  async delete_delete(task_id) {
    return this.make_request('DELETE', `/task/${task_id}`);
  }

  async merge_task(task_id, task_data){
    return this.make_request('POST', `/task/${task_id}/merge`, task_data);
  }
}

export default TasksApiService;