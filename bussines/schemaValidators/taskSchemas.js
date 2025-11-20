const taskResponseSchema = {
  type: 'object',
  required: ['id', 'name'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    status: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        color: { type: 'string' }
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
  type: 'array',
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