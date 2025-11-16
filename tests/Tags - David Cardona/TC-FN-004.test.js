const axios = require('axios');
const { expectValidSchema } = require('./schemaValidator.js');
const {
  getTagsResponseSchema,
  errorResponseSchema
} = require('./tagSchemas.js');

const baseURL = process.env.CLICKUP_BASE_URL;
const token = process.env.CLICKUP_TOKEN;
const spaceId = process.env.CLICKUP_SPACE_ID;

const invalidTagData = {
  tag: {
    tag_fg: '#FFFFFF',
    tag_bg: '#0000FF'
  }
};

describe('TC-FN-004 - Verify error handling when tag name is missing', () => {
  it('POST - Missing Name should return error 400', async () => {
    let response;

    try {
      await axios.post(`${baseURL}/space/${spaceId}/tag`,invalidTagData,
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      response = error.response;
    }

    expect(response).toBeDefined();
    expect(response.status).toBe(400);

    expect(response.data).toBeDefined();
    expect(typeof response.data).toBe('object');

    expectValidSchema(
      response.data,
      errorResponseSchema,
      expect,
      'Error Response Schema'
    );

    expect(response.data.err).toBe('Tag missing from body');
    expect(response.data.ECODE).toBe('TAGS_020');
  });

  it('GET - Verify tag with missing name was NOT created', async () => {
    const response = await axios.get(`${baseURL}/space/${spaceId}/tag`,
      {
        headers: {
          'Authorization': token,
          'accept': 'application/json'
        }
      }
    );

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('tags');
    expect(Array.isArray(response.data.tags)).toBe(true);

    expectValidSchema(
      response.data,
      getTagsResponseSchema,
      expect,
      'Get Tags Schema'
    );

    const invalidTag = response.data.tags.find(
      t => t.name === '' || t.name == null
    );

    expect(invalidTag).toBeUndefined();
  });

});
