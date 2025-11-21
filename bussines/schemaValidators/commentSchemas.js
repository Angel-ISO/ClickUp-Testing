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

module.exports = {
  commentResponseSchema,
  commentsListResponseSchema,
  createCommentRequestSchema,
  errorResponseSchema
};