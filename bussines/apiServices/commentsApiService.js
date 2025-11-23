import BaseApiService from "./baseApiService.js";

class CommentsApiService extends BaseApiService {
  static #instance = null;

  constructor() {
    if (CommentsApiService.#instance) {
      return CommentsApiService.#instance;
    }
    super();
    CommentsApiService.#instance = this;
  }

  static getInstance() {
    if (!CommentsApiService.#instance) {
      CommentsApiService.#instance = new CommentsApiService();
    }
    return CommentsApiService.#instance;
  }

  async create_comments(task_id, comment_data) {
    return this.make_request('POST', `/task/${task_id}/comment`, comment_data);
  }

  async get_comments(task_id) {
    return this.make_request('GET', `/task/${task_id}/comment`);
  }

  async update_comments(comment_id, update_data) {
    return this.make_request('PUT', `/comment/${comment_id}`, update_data);
  }

  async delete_comments(comment_id) {
    return this.make_request('DELETE', `/comment/${comment_id}`);
  }

  async create_comments_reply(comment_id, reply_data) {
    return this.make_request('POST', `/comment/${comment_id}/reply`, reply_data);
  }

  async get_comments_reply(comment_id) {
    return this.make_request('GET', `/comment/${comment_id}/reply`);
  }

  async create_comments_chatView(view_id, comment_data) {
    return this.make_request('POST', `/view/${view_id}/comment`, comment_data);
  }

  async get_comments_chatView(view_id) {
    return this.make_request('GET', `/view/${view_id}/comment`);
  }
}


export default CommentsApiService.getInstance();
export { CommentsApiService };