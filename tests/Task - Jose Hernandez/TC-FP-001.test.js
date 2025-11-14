const axios = require('axios');

const baseURL = process.env.CLICKUP_BASE_URL;
const token = process.env.CLICKUP_TOKEN;
const spaceId = process.env.CLICKUP_SPACE_ID;

describe('TC-FP-001 - Verify that a user can create a task with valid data', () => {
  let folderId;
  let listId;
  let createdTaskId;

  beforeAll(async () => {
    // Get Folder ID
    const folderResponse = await axios.get(`${baseURL}/space/${spaceId}/folder`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    folderId = folderResponse.data.folders[0].id;

    // Get List ID
    const listResponse = await axios.get(`${baseURL}/folder/${folderId}/list`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    listId = listResponse.data.lists[0].id;
  });

  afterEach(async () => {
    if (createdTaskId) {
      try {
        await axios.delete(`${baseURL}/task/${createdTaskId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.warn('Failed to cleanup task:', error.message);
      }
      createdTaskId = null;
    }
  });

  it('Create Task - Valid Data', async () => {
    const requestBody = { name: "Task Test - Valid Data" };

    const response = await axios.post(`${baseURL}/list/${listId}/task`, requestBody, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    expect(response.status).toBe(200);

    // Valid data
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('name', requestBody.name);
    expect(response.data).toHaveProperty('status');
    expect(response.data.status).toHaveProperty('status');
    expect(response.data.status).toHaveProperty('color');
    expect(response.data.status).toHaveProperty('type');
    expect(response.data).toHaveProperty('creator');
    expect(response.data.creator).toHaveProperty('id');
    expect(response.data.creator).toHaveProperty('username');
    expect(response.data.creator).toHaveProperty('email');
    expect(response.data).toHaveProperty('date_created');
    expect(response.data).toHaveProperty('url');

    createdTaskId = response.data.id;
  });

  it('Get Task - Verify Creation', async () => {
    const createResponse = await axios.post(`${baseURL}/list/${listId}/task`, { name: "Task Test - Verify" }, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    createdTaskId = createResponse.data.id;

    const response = await axios.get(`${baseURL}/task/${createdTaskId}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'accept': 'application/json' }
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id', createdTaskId);
    expect(response.data).toHaveProperty('name', "Task Test - Verify");
    expect(response.data).toHaveProperty('status');
    expect(response.data.status).toHaveProperty('status');
  });
});
