const taskResponseSchema = {
  type: 'object',
  required: ['id', 'name', 'status', 'creator', 'date_created', 'url'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: ['string', 'null'] },
    status: {
      type: 'object',
      required: ['status', 'color', 'type'],
      properties: {
        status: { type: 'string' },
        color: { type: 'string' },
        type: { type: 'string' }
      }
    },
    creator: {
      type: 'object',
      required: ['id', 'username', 'email'],
      properties: {
        id: { type: ['string', 'number'] },
        username: { type: 'string' },
        email: { type: 'string' }
      }
    },
    date_created: { type: 'string' },
    date_updated: { type: 'string' },
    archived: { type: 'boolean' },
    url: { type: 'string' },
    list: {
      type: 'object',
      required: ['id', 'name'],
      properties: {
        id: { type: 'string' },
        name: { type: 'string' }
      }
    },
    assignees: {
      type: 'array',
      items: { type: 'integer' }
    },
    tags: {
      type: 'array',
      items: { type: 'string' }
    }
  }
};

const tasksListResponseSchema = {
  type: 'object',
  items: taskResponseSchema
};

const createTaskRequestSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    assignees: {
      type: 'array',
      items: { type: 'integer' }
    },
    tags: {
      type: 'array',
      items: { type: 'string' }
    }
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

export default {
  taskResponseSchema,
  tasksListResponseSchema,
  createTaskRequestSchema,
  errorResponseSchema
};