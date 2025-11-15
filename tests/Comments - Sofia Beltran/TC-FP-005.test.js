const axios = require("axios");
const { afterAll, beforeAll, describe, test } = require("@jest/globals");
const Ajv = require("ajv");
require("dotenv").config();

const ajv = new Ajv();
const baseURL = process.env.CLICKUP_BASE_URL;
const token = process.env.CLICKUP_TOKEN;
const taskId = process.env.CLICKUP_TASK_ID;
const viewId = process.env.CLICKUP_VIEW_ID;

const headers = {
  Authorization: token,
  "Content-Type": "application/json",
};

const postChatCommentSchema = {
  type: "object",
  required: ["id", "hist_id", "date", "version"],
  properties: {
    id: { type: "integer" },
    hist_id: { type: "string" },
    date: { type: "integer" },

    version: {
      type: "object",
      required: [
        "object_type",
        "object_id",
        "workspace_id",
        "operation",
        "data",
        "master_id",
        "version",
        "deleted",
        "traceparent",
        "date_created",
        "date_updated",
        "event_publish_time"
      ],
      properties: {
        object_type: { type: "string", enum: ["comment"] },
        object_id: { type: "string" },
        workspace_id: { type: "integer" },
        operation: { type: "string", enum: ["c", "u", "d"] },
        data: {
          type: "object",
          required: ["context", "relationships", "changes"],
          properties: {
            context: {
              type: "object",
              required: [
                "root_parent_type",
                "is_chat",
                "audit_context",
                "originating_service"
              ],
              properties: {
                root_parent_type: { type: "integer" },
                is_chat: { type: "boolean" },
                audit_context: {
                  type: "object",
                  required: ["userid", "current_time", "route"],
                  properties: {
                    userid: { type: "integer" },
                    current_time: { type: "integer" },
                    route: { type: "string" }
                  }
                },
                originating_service: { type: "string" }
              }
            },
            relationships: {
              type: "array",
              items: {
                type: "object",
                required: ["type", "object_type", "object_id", "workspace_id"],
                properties: {
                  type: { type: "string" },
                  object_type: { type: "string" },
                  object_id: { type: "string" },
                  workspace_id: { type: "integer" }
                }
              }
            },
            changes: {
              type: "array",
              items: {
                type: "object",
                required: ["field", "after"],
                properties: {
                  field: { type: "string" },
                  after: { type: "integer" }
                }
              }
            }
          }
        },
        master_id: { type: "integer" },
        version: { type: "integer" },
        deleted: { type: "boolean" },
        traceparent: { type: "string" },
        date_created: { type: "integer" },
        date_updated: { type: "integer" },
        event_publish_time: { type: "integer" }
      }
    }
  }
};


const getChatCommentsSchema = {
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
            required: ["id", "username", "email", "color", "initials", "profilePicture"],
            properties: {
              id: { type: "number" },
              username: { type: "string" },
              email: { type: "string" },
              color: { type: "string" },
              initials: { type: "string" },
              profilePicture: { type: ["string", "null"] }
            }
          },
          assignee: { type: ["null", "object"] },
          group_assignee: { type: ["null", "object"] },
          reactions: { type: "array" },
          date: { type: "string" },
          reply_count: { type: "number" }
        }
      }
    }
  }
};

describe("ClickUp Comments API - Test005", () => {
  let commentId;

  beforeAll(async () => {
    const body = {
      comment_text: "Initial comment for testing",
      notify_all: false,
    };

    const response = await axios.post(
      `${baseURL}/task/${taskId}/comment`,
      body,
      { headers }
    );

    commentId = response.data.id;
  });

afterAll(async () => {
  if (!commentId) return;

  try {
    const base = (baseURL || "").replace(/\/+$/, "");
    const deleteUrl = `${base}/comment/${encodeURIComponent(commentId)}`;
    const res = await axios.delete(deleteUrl, { headers });
    if (res.status === 200 || res.status === 204) {
      console.log("Comment deleted successfully:", commentId);
    } else {
      console.warn("Unexpected status when deleting comment:", res.status, commentId);
    }
  } catch (err) {
    if (err && err.response && err.response.status === 404) {
    } else {
      console.error("Error deleting comment in afterAll:", err && err.response ? {
        status: err.response.status,
        data: err.response.data
      } : err);
    }
  }
});


  test("Should create a chat view comment and validate schema", async () => {
    const body = {
      comment_text: "Test comment from Jest",
      notify_all: false
    };

    const response = await axios.post(
      `${baseURL}/view/${viewId}/comment`,
      body,
      { headers }
    );

    expect(response.status).toBe(200);

    const validate = ajv.compile(postChatCommentSchema);
    const valid = validate(response.data);

    if (!valid) {
      console.log(validate.errors);
    }
    expect(valid).toBe(true);

    commentId = response.data.id;

    const parentRel = response.data.version.data.relationships.find(
      r => r.type === "comment-parent"
    );
    expect(parentRel.object_id).toBe(viewId);
    expect(response.data.version.operation).toBe("c");
  });

  test("Should return valid schema and contain the comment", async () => {
    await new Promise(r => setTimeout(r, 1500));

    const response = await axios.get(
      `${baseURL}/view/${viewId}/comment`,
      { headers }
    );

    expect(response.status).toBe(200);

    const validate = ajv.compile(getChatCommentsSchema);
    const valid = validate(response.data);

    if (!valid) console.log(validate.errors);
    expect(valid).toBe(true);

    const exists = response.data.comments.some(c => c.id === String(commentId));
    expect(exists).toBe(true);
  });
});