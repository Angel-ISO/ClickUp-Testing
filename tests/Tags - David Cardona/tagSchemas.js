const emptyBodyResponseSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {}
  };
  
  const getTagsResponseSchema = {
    type: 'object',
    required: ['tags'],
    properties: {
      tags: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name', 'tag_fg', 'tag_bg', 'creator', 'project_id'],
          properties: {
            name: { type: 'string' },
            tag_fg: { type: 'string' },
            tag_bg: { type: 'string' },
            creator: { type: 'integer' },
            project_id: { type: 'string' }
          }
        }
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
  
  module.exports = {
    emptyBodyResponseSchema,
    getTagsResponseSchema,
    errorResponseSchema
  };