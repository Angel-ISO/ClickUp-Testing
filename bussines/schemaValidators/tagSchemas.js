const tagResponseSchema = {
  type: 'object',
  required: ['name', 'tag_fg', 'tag_bg', 'creator', 'project_id'],
  properties: {
    name: { type: 'string' },
    tag_fg: { type: 'string' },
    tag_bg: { type: 'string' },
    creator: { type: 'integer' },
    project_id: { type: 'string' }
  }
};

const tagsListResponseSchema = {
  type: 'object',
  required: ['tags'],
  properties: {
    tags: {
      type: 'array',
      items: tagResponseSchema
    }
  }
};

const createTagRequestSchema = {
  type: 'object',
  required: ['name', 'tag_fg', 'tag_bg'],
  properties: {
    name: { type: 'string' },
    tag_fg: { type: 'string' },
    tag_bg: { type: 'string' }
  }
};

const emptyBodyResponseSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {}
};

const errorResponseSchema = {
  type: 'object',
  required: ['err', 'ECODE'],
  properties: {
    err: { type: 'string' },
    ECODE: { type: 'string' }
  }
};

export const taskResponseSchema = {
  type: "object",
  required: [
    "id",
    "name",
    "status",
    "creator",
    "watchers",
    "tags",
    "team_id",
    "url",
    "permission_level",
    "list",
    "project",
    "folder",
    "space"
  ],
  properties: {
    id: { type: "string" },
    custom_id: { type: ["string", "null"] },
    custom_item_id: { type: ["number", "null"] },

    name: { type: "string" },
    text_content: { type: "string" },
    description: { type: "string" },

    status: {
      type: "object",
      required: ["id", "status", "color", "type"],
      properties: {
        id: { type: "string" },
        status: { type: "string" },
        color: { type: "string" },
        orderindex: {},
        type: { type: "string" }
      },
      additionalProperties: true
    },

    orderindex: { type: "string" },

    date_created: { type: ["string", "null"] },
    date_updated: { type: ["string", "null"] },
    date_closed: { type: ["string", "null"] },
    date_done: { type: ["string", "null"] },

    archived: { type: "boolean" },

    creator: {
      type: "object",
      required: ["id", "username", "email"],
      properties: {
        id: { type: "number" },
        username: { type: "string" },
        color: { type: "string" },
        email: { type: "string" },
        profilePicture: { type: ["string", "null"] }
      },
      additionalProperties: true
    },

    assignees: { type: "array" },
    group_assignees: { type: "array" },

    watchers: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "username", "email"],
        properties: {
          id: { type: "number" },
          username: { type: "string" },
          color: { type: "string" },
          email: { type: "string" },
          initials: { type: "string" },
          profilePicture: { type: ["string", "null"] }
        },
        additionalProperties: true
      }
    },

    checklists: { type: "array" },

    tags: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "tag_fg", "tag_bg"],
        properties: {
          name: { type: "string" },
          tag_fg: { type: "string" },
          tag_bg: { type: "string" },
          creator: {
            anyOf: [
              { type: "number" },
              { type: "null" }
            ]
          }
        },
        additionalProperties: false
      }
    },

    parent: { type: ["string", "null"] },
    top_level_parent: { type: ["string", "null"] },
    priority: { type: ["string", "null", "object"] },

    due_date: { type: ["string", "null"] },
    start_date: { type: ["string", "null"] },

    points: { type: ["number", "null"] },
    time_estimate: { type: ["number", "null"] },
    time_spent: { type: "number" },

    custom_fields: { type: "array" },
    dependencies: { type: "array" },
    linked_tasks: { type: "array" },
    locations: { type: "array" },

    team_id: { type: "string" },
    url: { type: "string" },

    sharing: {
      type: "object",
      required: ["public", "public_share_expires_on", "public_fields"],
      properties: {
        public: { type: "boolean" },
        public_share_expires_on: { type: ["string", "null"] },
        public_fields: { type: "array" },
        token: { type: ["string", "null"] },
        seo_optimized: { type: "boolean" }
      },
      additionalProperties: true
    },

    permission_level: { type: "string" },

    list: {
      type: "object",
      required: ["id", "name"],
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        access: { type: "boolean" }
      },
      additionalProperties: true
    },

    project: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        hidden: { type: "boolean" },
        access: { type: "boolean" }
      },
      additionalProperties: true
    },

    folder: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        hidden: { type: "boolean" },
        access: { type: "boolean" }
      },
      additionalProperties: true
    },

    space: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" }
      },
      additionalProperties: true
    },

    attachments: { type: "array" }
  },

  additionalProperties: true
};


export default {
  tagResponseSchema,
  tagsListResponseSchema,
  createTagRequestSchema,
  emptyBodyResponseSchema,
  errorResponseSchema,
  taskResponseSchema
};