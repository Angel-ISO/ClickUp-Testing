const folderResponseSchema = {
  type: 'object',
  required: ['id', 'name'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    orderindex: { type: 'integer' },
    override_statuses: { type: 'boolean' },
    hidden: { type: 'boolean' },
    space: {
      type: 'object',
      properties: {
        id: { type: 'string' }
      }
    },
    task_count: { type: 'integer' }
  }
};

const foldersListResponseSchema = {
  type: 'array',
  items: folderResponseSchema
};

const createFolderRequestSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string' }
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

module.exports = {
  folderResponseSchema,
  foldersListResponseSchema,
  createFolderRequestSchema,
  errorResponseSchema
};