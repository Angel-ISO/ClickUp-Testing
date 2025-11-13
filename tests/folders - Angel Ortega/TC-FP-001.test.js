const axios = require('axios');

const baseURL = process.env.CLICKUP_BASE_URL;
const token = process.env.CLICKUP_TOKEN;
const spaceId = process.env.CLICKUP_SPACE_ID;

describe('TC-FP-001 - Verify that user can create a folder with valid name in existing space', () => {
  let createdFolderId;

  beforeEach(() => {
    console.log('im a hook of before each');
  });

  afterEach(async () => {
    if (createdFolderId) {
      try {
        await axios.delete(`${baseURL}/folder/${createdFolderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.warn('Cleanup failed:', error.message);
      }
      createdFolderId = null;
    }
  });

  it('Create Folder - Valid Name', async () => {
    const response = await axios.post(`${baseURL}/space/${spaceId}/folder`, {
      name: 'Test Folder - Valid Name'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('name');
    expect(response.data.name).toBe('Test Folder - Valid Name');

    expect(response.data).toHaveProperty('orderindex');
    expect(response.data).toHaveProperty('override_statuses');
    expect(response.data).toHaveProperty('hidden');
    expect(response.data).toHaveProperty('space');
    expect(response.data).toHaveProperty('task_count');
    expect(response.data).toHaveProperty('archived');
    expect(response.data).toHaveProperty('statuses');
    expect(response.data).toHaveProperty('deleted');
    expect(response.data).toHaveProperty('lists');
    expect(response.data).toHaveProperty('permission_level');

    createdFolderId = response.data.id;
  });

  it('Get Folders - Verify Creation', async () => {
    const createResponse = await axios.post(`${baseURL}/space/${spaceId}/folder`, {
      name: 'Test Folder - Valid Name'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    createdFolderId = createResponse.data.id;

    const response = await axios.get(`${baseURL}/space/${spaceId}/folder`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json'
      }
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('folders');
    expect(Array.isArray(response.data.folders)).toBe(true);
    expect(response.data.folders.length).toBeGreaterThan(0);

    const folder = response.data.folders.find(f => f.name === 'Test Folder - Valid Name');
    expect(folder).toBeDefined();
    expect(folder).toHaveProperty('id');
    expect(folder.name).toBe('Test Folder - Valid Name');
  });
});