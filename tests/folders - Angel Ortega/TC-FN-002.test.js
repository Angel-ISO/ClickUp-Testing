const axios = require('axios');

const baseURL = process.env.CLICKUP_BASE_URL;
const token = process.env.CLICKUP_TOKEN;
const spaceId = process.env.CLICKUP_SPACE_ID;

describe('TC-FN-002 - Verify that system returns 400 error when folder name field is missing', () => {
  it('Create Folder - Missing Name Field', async () => {
    try {
      await axios.post(`${baseURL}/space/${spaceId}/folder`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fail('Expected request to fail with 400');
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('err');
      expect(error.response.data.err).toBeTruthy();
      expect(error.response.data.err.toLowerCase()).toContain('name');
      expect(error.response.data).toHaveProperty('ECODE');
      expect(error.response.data).not.toHaveProperty('id');
    }
  });

  it('Create Folder - Empty Body', async () => {
    try {
      await axios.post(`${baseURL}/space/${spaceId}/folder`, '', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fail('Expected request to fail with 400');
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('err');
      expect(error.response.data.err).toBeTruthy();
      expect(error.response.data.err.toLowerCase()).toContain('json');
      expect(error.response.data).toHaveProperty('ECODE');
      expect(error.response.data).not.toHaveProperty('id');
    }
  });

  it('Create Folder - Empty Name String', async () => {
    try {
      await axios.post(`${baseURL}/space/${spaceId}/folder`, {
        name: ''
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fail('Expected request to fail with 400');
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('err');
      expect(error.response.data.err).toBeTruthy();
      expect(error.response.data.err.toLowerCase()).toContain('name');
      expect(error.response.data).toHaveProperty('ECODE');
      expect(error.response.data).not.toHaveProperty('id');
    }
  });
});