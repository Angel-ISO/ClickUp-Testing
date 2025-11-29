const versionSchema = {
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
          required: ["root_parent_type", "is_chat", "audit_context", "originating_service"],
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
};

const commentResponseSchema = {
  type: 'object',
  required: ['id', 'comment_text', 'userid', 'date'],
  properties: {
    id: { type: 'string' },
    comment_text: { type: 'string' },
    userid: { type: 'string' },
    date: { type: 'string' },
    assignee: { type: 'integer' },
    resolved: { type: 'boolean' }
  }
};

const commentsListResponseSchema = {
  type: 'array',
  items: commentResponseSchema
};

const createCommentRequestSchema = {
  type: 'object',
  required: ['comment_text'],
  properties: {
    comment_text: { type: 'string' },
    assignee: { type: 'integer' },
    notify_all: { type: 'boolean' }
  }
};

const errorResponseSchema = {
  type: 'object',
  required: ['err', 'ECODE'],
  properties: {
    err: { type: 'string' },
    ECODE: { type: 'string' }
  }
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

const commentListAfterDeleteSchema = {
  type: "object",
  required: ["comments"],
  properties: {
    comments: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "comment_text", "user"],
        properties: {
          id: { type: ["string", "number"] },
          comment_text: { type: "string" },
          user: {
            type: "object",
            required: ["id", "username"],
            properties: {
              id: { type: "number" },
              username: { type: "string" },
              email: { type: "string" },
              color: { type: "string" },
              initials: { type: "string" },
              profilePicture: { type: ["string", "null"] }
            }
          },
          date: { type: "string" },
          reply_count: { type: "number" }
        },
        additionalProperties: true
      }
    }
  },
  additionalProperties: true
};

const postThreadSchema = {
  type: "object",
  required: ["id", "hist_id", "date", "version"],
  properties: {
    id: { type: "integer" },
    hist_id: { type: "string" },
    date: { type: "integer" },
    version: versionSchema
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
        required: ["id", "comment", "comment_text", "user", "assignee", "group_assignee", "reactions", "date", "reply_count"],
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
          reactions: { type: "array" },
          date: { type: "string" },
          reply_count: { type: "integer" }
        }
      }
    }
  }
};


const deepClone = obj => JSON.parse(JSON.stringify(obj));
const postChatCommentSchema = deepClone(postThreadSchema);

if (postChatCommentSchema.properties && postChatCommentSchema.properties.version) {
  postChatCommentSchema.properties.version.properties = {
    ...postChatCommentSchema.properties.version.properties,
    operation: { type: "string", enum: ["c", "u", "d"] }
  };
}

const getChatCommentsSchema = deepClone(commentListSchema);

module.exports = {
  commentResponseSchema,
  commentsListResponseSchema,
  createCommentRequestSchema,
  errorResponseSchema,
  commentListSchema,
  commentListAfterDeleteSchema,
  postThreadSchema,
  getThreadSchema,
  postChatCommentSchema,
  getChatCommentsSchema
};