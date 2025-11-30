import BaseApiService from "./baseApiService.js";

class TasksApiService extends BaseApiService {
  async getTasks(listId) {
    return this.makeRequest("GET", `/list/${listId}/task`);
  }

  async createTask(listId, taskData) {
    return this.makeRequest("POST", `/list/${listId}/task`, taskData);
  }

  async getTask(taskId) {
    return this.makeRequest("GET", `/task/${taskId}`);
  }

  async updateTask(taskId, taskData) {
    return this.makeRequest("PUT", `/task/${taskId}`, taskData);
  }

  async deleteTask(taskId) {
    return this.makeRequest("DELETE", `/task/${taskId}`);
  }

  async mergeTasks(taskId, taskData) {
    return this.makeRequest("POST", `/task/${taskId}/merge`, taskData);
  }

  async getTasksBySpace(spaceId) {
    return this.makeRequest("GET", `/space/${spaceId}/task`);
  }

  async getTasksResult(listId) {
    return this.makeRequestResult("GET", `/list/${listId}/task`);
  }

  async createTaskResult(listId, taskData) {
    return this.makeRequestResult("POST", `/list/${listId}/task`, taskData);
  }

  async getTaskResult(taskId) {
    return this.makeRequestResult("GET", `/task/${taskId}`);
  }

  async updateTaskResult(taskId, taskData) {
    return this.makeRequestResult("PUT", `/task/${taskId}`, taskData);
  }

  async deleteTaskResult(taskId) {
    return this.makeRequestResult("DELETE", `/task/${taskId}`);
  }

  async mergeTasksResult(taskId, taskData) {
    return this.makeRequestResult("POST", `/task/${taskId}/merge`, taskData);
  }

  async getTasksBySpaceResult(spaceId) {
    return this.makeRequestResult("GET", `/space/${spaceId}/task`);
  }
}

export default new TasksApiService();

export { TasksApiService };
