import 'dotenv/config';
import FoldersApiService from '../../bussines/apiServices/foldersApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import folderSchemas from '../../bussines/schemaValidators/folderSchemas.js';

const spaceId = process.env.CLICKUP_SPACE_ID;
const foldersService = new FoldersApiService();

describe('TC-FN-002 - Verify that system returns 400 error when folder name field is missing', () => {

  it('Create Folder - Missing Name Field', async () => {
    try {
      await foldersService.create_folder(spaceId, {});
      fail('Expected request to fail with 400');
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('err');
      expect(error.response.data.err).toBeTruthy();
      expect(error.response.data.err.toLowerCase()).toContain('name');

      const validation = BaseSchemaValidator.validate(
        error.response.data,
        folderSchemas.errorResponseSchema,
        'Error Response'
      );
      expect(validation.isValid).toBe(true);

      expect(error.response.data).not.toHaveProperty('id');
    }
  });

  it('Create Folder - Empty Body', async () => {
    try {
      await foldersService.create_folder(spaceId, {});
      fail('Expected request to fail with 400');
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('err');

      const validation = BaseSchemaValidator.validate(
        error.response.data,
        folderSchemas.errorResponseSchema,
        'Error Response'
      );
      expect(validation.isValid).toBe(true);

      expect(error.response.data).not.toHaveProperty('id');
    }
  });

  it('Create Folder - Empty Name String', async () => {
    try {
      await foldersService.create_folder(spaceId, { name: '' });
      fail('Expected request to fail with 400');
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('err');

      const validation = BaseSchemaValidator.validate(
        error.response.data,
        folderSchemas.errorResponseSchema,
        'Error Response'
      );
      expect(validation.isValid).toBe(true);

      expect(error.response.data).not.toHaveProperty('id');
    }
  });
});