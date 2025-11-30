import BaseApiService from "./baseApiService.js";

class TagsApiService extends BaseApiService {
  async getTags(spaceId) {
    return this.makeRequest("GET", `/space/${spaceId}/tag`);
  }

  async createTag(spaceId, tagData) {
    return this.makeRequest("POST", `/space/${spaceId}/tag`, tagData);
  }

  async updateTag(spaceId, tagName, tagData) {
    return this.makeRequest(
      "PUT",
      `/space/${spaceId}/tag/${encodeURIComponent(tagName)}`,
      tagData
    );
  }

  async deleteTag(spaceId, tagName) {
    return this.makeRequest(
      "DELETE",
      `/space/${spaceId}/tag/${encodeURIComponent(tagName)}`
    );
  }

  async addTagToTask(taskId, tagName) {
    return this.makeRequest(
      "POST",
      `/task/${taskId}/tag/${encodeURIComponent(tagName)}`,
      {}
    );
  }

  async removeTagFromTask(taskId, tagName) {
    return this.makeRequest(
      "DELETE",
      `/task/${taskId}/tag/${encodeURIComponent(tagName)}`,
      {}
    );
  }

  async getTagsResult(spaceId) {
    return this.makeRequestResult("GET", `/space/${spaceId}/tag`);
  }

  async createTagResult(spaceId, tagData) {
    return this.makeRequestResult("POST", `/space/${spaceId}/tag`, tagData);
  }

  async updateTagResult(spaceId, tagName, tagData) {
    return this.makeRequestResult(
      "PUT",
      `/space/${spaceId}/tag/${encodeURIComponent(tagName)}`,
      tagData
    );
  }

  async deleteTagResult(spaceId, tagName) {
    return this.makeRequestResult(
      "DELETE",
      `/space/${spaceId}/tag/${encodeURIComponent(tagName)}`
    );
  }

  async addTagToTaskResult(taskId, tagName) {
    return this.makeRequestResult(
      "POST",
      `/task/${taskId}/tag/${encodeURIComponent(tagName)}`,
      {}
    );
  }

  async removeTagFromTaskResult(taskId, tagName) {
    return this.makeRequestResult(
      "DELETE",
      `/task/${taskId}/tag/${encodeURIComponent(tagName)}`,
      {}
    );
  }
}

export default new TagsApiService();

export { TagsApiService };
