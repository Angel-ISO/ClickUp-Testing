const axios = require('axios');
const { expectValidSchema } = require('./schemaValidator.js');
const {
  emptyBodyResponseSchema,
  getTagsResponseSchema
} = require('./tagSchemas.js');

const baseURL = process.env.CLICKUP_BASE_URL;
const token = process.env.CLICKUP_TOKEN;
const spaceId = process.env.CLICKUP_SPACE_ID;

const validTagData = {
    tag: {
      name: 'David',
      tag_fg: '#FFFFFF',
      tag_bg: '#0000FF'
    }
  }; 

describe('TC-FP-001 - Verify successful creation of a new Space Tag', () => {
  let createdTagName;

  afterEach(async () => {
    if (createdTagName) {
      try {
        await api.delete(`${baseURL}/space/${spaceId}/tag/${encodeURIComponent(createdTagName)}`, {
          headers: {
            'Authorization': token
          }
        });
        console.log(`Cleanup: Tag "${createdTagName}" deleted successfully`);
      } catch (error) {
        console.warn(`Cleanup failed for tag "${createdTagName}":`, error.message);
      }
      createdTagName = null;
    }
  });

  it('Create Tag - Valid Data', async () => {
    const response = await axios.post(`${baseURL}/space/${spaceId}/tag`, validTagData, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(typeof response.data).toBe('object');
    expect(response.data).toEqual({});
    expect(Object.keys(response.data).length).toBe(0);

    expectValidSchema(
      response.data,
      emptyBodyResponseSchema,
      expect,
      'Create Tag Response'
    );

    createdTagName = validTagData.tag.name;
  });

  it('Get Tags - Verify Creation', async () => {
    await axios.post(`${baseURL}/space/${spaceId}/tag`, validTagData, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });
    createdTagName = validTagData.tag.name;

    const response = await axios.get(`${baseURL}/space/${spaceId}/tag`, {
      headers: {
        'Authorization': token,
        'accept': 'application/json'
      }
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('tags');
    expect(Array.isArray(response.data.tags)).toBe(true);

    expectValidSchema(
      response.data,
      getTagsResponseSchema,
      expect,
      'Get Tags Response'
    );

    const normalizedTagName = createdTagName.toLowerCase().trim();
    const tag = response.data.tags.find(
      t => t.name.toLowerCase().trim() === normalizedTagName
    );
    expect(tag).toBeDefined();
    expect(tag).toHaveProperty('name');
    expect(tag).toHaveProperty('tag_fg');
    expect(tag).toHaveProperty('tag_bg');
    expect(tag).toHaveProperty('creator');
    expect(tag).toHaveProperty('project_id');
  });

  it('Delete Tag - Verify Deletion', async () => {
    await axios.post(`${baseURL}/space/${spaceId}/tag`, validTagData, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });
    createdTagName = validTagData.tag.name;

    const deleteResponse = await axios.delete(
      `${baseURL}/space/${spaceId}/tag/${encodeURIComponent(createdTagName)}`,
      {
        headers: {
          'Authorization': token
        }
      }
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.data).toBeDefined();
    expect(typeof deleteResponse.data).toBe('object');
    expect(deleteResponse.data).toEqual({});

    expectValidSchema(
      deleteResponse.data,
      emptyBodyResponseSchema,
      expect,
      'Delete Tag Response'
    );

    const getResponse = await axios.get(`${baseURL}/space/${spaceId}/tag`, {
      headers: {
        'Authorization': token,
        'accept': 'application/json'
      }
    });

    const normalizedTagName = createdTagName.toLowerCase().trim();
    const tagExists = getResponse.data.tags.some(
      t => t.name.toLowerCase().trim() === normalizedTagName
    );
    expect(tagExists).toBe(false);

    createdTagName = null;
  });
});