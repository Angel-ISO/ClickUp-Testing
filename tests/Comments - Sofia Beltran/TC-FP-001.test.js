const axios = require("axios");
const { afterAll } = require("jest-circus");
const Ajv = require("ajv");
require("dotenv").config();

import Logger from '../../core/logger.js';

const ajv = new Ajv();
const baseURL = process.env.CLICKUP_BASE_URL;
const token = process.env.CLICKUP_TOKEN;
const taskId = process.env.CLICKUP_TASK_ID;

const headers = {
  Authorization: token,
  "Content-Type": "application/json",
};

const commentListSchema = {
  type: "object",
  required: ["comments"],
  properties: {
    comments: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "comment", "comment_text", "user", "date", "reply_count"],
        properties: {
          id: { type: "string" },
          comment: {
            type: "array",
            items: {
              type: "object",
              required: ["text"],
              properties: { text: { type: "string" } }
            }
          },
          comment_text: { type: "string" },
          user: {
            type: "object",
            required: ["id", "username", "email", "color", "initials"],
            properties: {
              id: { type: "integer" },
              username: { type: "string" },
              email: { type: "string" },
              color: { type: "string" },
              initials: { type: "string" },
              profilePicture: { type: ["string", "null"] }
            }
          },
          assignee: { type: ["object", "null"] },
          group_assignee: { type: ["object", "null"] },
          reactions: { type: "array" },
          date: { type: "string" },
          reply_count: { type: "integer" }
        }
      }
    }
  }
};

describe("ClickUp Comments API - Test001", () => {
  let commentId;

  afterAll(() => {
    Logger.info('Cleaning up: Deleting test comment', { commentId });
    return axios.delete(
      `${baseURL}/comment/${commentId}`,
      { headers }
    );
  })

  test("Should create a comment", async () => {
    const body = {
      comment_text: "Do test case for comments",
      notify_all: true,
    };

    Logger.info('Creating comment on task', { taskId, commentText: body.comment_text });

    const response = await axios.post(
      `${baseURL}/task/${taskId}/comment`,
      body,
      { headers }
    );

    expect([200, 201]).toContain(response.status);
    Logger.info('Comment created successfully', { status: response.status });

    commentId = response.data.id;
    expect(commentId).toBeDefined();
    Logger.info('Comment ID captured', { commentId });
  });

  test("Should validate comment list schema and check comment existence", async () => {
    Logger.info('Waiting 500ms before fetching comments');
    await new Promise(res => setTimeout(res, 500));

    Logger.info('Fetching comments list', { taskId });
    const response = await axios.get(
      `${baseURL}/task/${taskId}/comment`,
      { headers }
    );

    Logger.info('Comments retrieved', { 
      status: response.status,
      commentCount: response.data.comments?.length 
    });

    const validate = ajv.compile(commentListSchema);
    const valid = validate(response.data);

    Logger.validation('commentListSchema', valid, validate.errors);

    if (!valid) {
      console.error("Schema errors:", validate.errors);
    }

    expect(valid).toBe(true);
    
    const exists = response.data.comments.some(c => c.id == commentId);
    expect(exists).toBe(true);
    
    Logger.info('Comment existence verified', { 
      commentId, 
      exists,
      totalComments: response.data.comments.length 
    });
  });
});
