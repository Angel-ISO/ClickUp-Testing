const axios = require("axios");
const { afterAll, beforeAll, describe, test } = require("@jest/globals");
const Ajv = require("ajv");
require("dotenv").config();

const ajv = new Ajv();
const baseURL = process.env.CLICKUP_BASE_URL;
const token = process.env.CLICKUP_TOKEN;
const taskId = process.env.CLICKUP_TASK_ID;

const headers = {
  Authorization: token,
  "Content-Type": "application/json",
};

const postThreadSchema = {
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
        operation: { type: "string" },

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

const getThreadSchema = {
  type: "object",
  required: ["comments"],
  properties: {
    comments: {
      type: "array",
      items: {
        type: "object",
        required: [
          "id",
          "comment",
          "comment_text",
          "user",
          "assignee",
          "group_assignee",
          "reactions",
          "date",
          "reply_count"
        ],
        properties: {
          id: { type: "string" },

          comment: {
            type: "array",
            items: {
              type: "object",
              required: ["text"],
              properties: {
                text: { type: "string" }
              }
            }
          },

          comment_text: { type: "string" },

          user: {
            type: "object",
            required: [
              "id",
              "username",
              "email",
              "color",
              "initials",
              "profilePicture"
            ],
            properties: {
              id: { type: "integer" },
              username: { type: "string" },
              email: { type: "string" },
              color: { type: "string" },
              initials: { type: "string" },
              profilePicture: { type: ["string", "null"] }
            }
          },

          assignee: { type: ["null", "object"] },
          group_assignee: { type: ["null", "object"] },

          reactions: {
            type: "array",
            items: { type: "object" }
          },

          date: { type: "string" },
          reply_count: { type: "integer" }
        }
      }
    }
  }
};


describe("ClickUp Comments API - Test004", () => {
  let commentId;
  let replyId;

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
    if (commentId) {
      await axios.delete(
        `${baseURL}/comment/${commentId}`,
        { headers }
      );
      console.log("Successfully deleted comment");
    }
  });;

  test("Should create of a thread comment correctly", async () => {
    const body = {
      comment_text: "Updated comment text for testing",
      notify_all: false,
    };

    const response = await axios.post(
      `${baseURL}/comment/${commentId}/reply`,
      body,
      { headers }
    );

    replyId = response.data.id;

    expect(response.status).toBe(200);

    const validate = ajv.compile(postThreadSchema);
    const valid = validate(response.data);

    if (!valid) {
      console.error("POST reply schema errors:", validate.errors);
    }

    expect(valid).toBe(true);
  });

  test("Should validate replies list schema and confirm reply exists", async () => {
    await new Promise(r => setTimeout(r, 2000));

    const response = await axios.get(
      `${baseURL}/comment/${commentId}/reply`,
      { headers }
    );

    const validate = ajv.compile(getThreadSchema);
    const valid = validate(response.data);

    if (!valid) {
      console.error("GET replies schema errors:", validate.errors);
    }

    expect(valid).toBe(true);

    const exists = response.data.comments.some(
      (c) => String(c.id) === String(replyId)
    );

    expect(exists).toBe(true);
  });
});