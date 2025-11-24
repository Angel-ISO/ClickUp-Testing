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

const taskResponseSchema = {
  type: 'object',
  required: [
    'id',
    'name',
    'status',
    'creator',
    'watchers',
    'tags',
    'team_id',
    'url',
    'permission_level',
    'list',
    'project',
    'folder',
    'space'
  ],
  properties: {
    id: { type: 'string' },
    custom_id: { type: ['string', 'null'] },
    custom_item_id: {},
    name: { type: 'string' },
    text_content: { type: 'string' },
    description: { type: 'string' },
    status: {
      type: 'object',
      required: ['id', 'status', 'color', 'type'],
      properties: {
        id: { type: 'string' },
        status: { type: 'string' },
        color: { type: 'string' },
        orderindex: {},
        type: { type: 'string' }
      }
    },
    creator: {
      type: 'object',
      required: ['id', 'username', 'email'],
      properties: {
        id: { type: 'integer' },
        username: { type: 'string' },
        color: { type: 'string' },
        email: { type: 'string' },
        profilePicture: { type: ['string', 'null'] }
      }
    },
    tags: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'tag_fg', 'tag_bg'],
        properties: {
          name: { type: 'string' },
          tag_fg: { type: 'string' },
          tag_bg: { type: 'string' },
          creator: { type: ['integer', 'null'] }
        }
      }
    },
    watchers: { type: 'array' },
    url: { type: 'string' },
    team_id: { type: 'string' },
    permission_level: { type: 'string' },
    list: { type: 'object' },
    project: { type: 'object' },
    folder: { type: 'object' },
    space: { type: 'object' }
  }
};

export default {
  tagResponseSchema,
  tagsListResponseSchema,
  createTagRequestSchema,
  emptyBodyResponseSchema,
  errorResponseSchema,
  taskResponseSchema
};