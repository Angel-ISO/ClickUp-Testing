import BaseApiService from "./baseApiService.js";

class CommentsApiService extends BaseApiService {
  async createComments(taskId, commentData) {
    return this.makeRequest('POST', `/task/${taskId}/comment`, commentData);
  }

  async getComments(taskId) {
    return this.makeRequest('GET', `/task/${taskId}/comment`);
  }

  async updateComments(commentId, updateData) {
    return this.makeRequest('PUT', `/comment/${commentId}`, updateData);
  }

  async deleteComments(commentId) {
    return this.makeRequest('DELETE', `/comment/${commentId}`);
  }

  async createCommentsReply(commentId, replyData) {
    return this.makeRequest('POST', `/comment/${commentId}/reply`, replyData);
  }

  async getCommentsReply(commentId) {
    return this.makeRequest('GET', `/comment/${commentId}/reply`);
  }

  async createCommentsChatView(viewId, commentData) {
    return this.makeRequest('POST', `/view/${viewId}/comment`, commentData);
  }

  async getCommentsChatView(viewId) {
    return this.makeRequest('GET', `/view/${viewId}/comment`);
  }
}

export default new CommentsApiService();

export { CommentsApiService };