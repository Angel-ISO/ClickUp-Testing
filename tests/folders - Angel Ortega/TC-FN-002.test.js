import 'dotenv/config';
import foldersService from '../../bussines/apiServices/foldersApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import folderSchemas from '../../bussines/schemaValidators/folderSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
import result from '../../core/result.js';


taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.FOLDERS, negative: true }),
  'TC-FN-002 - Verify that system returns 400 error when folder name field is missing',
  () => {
    beforeAll(async () => {
      await setupClickUpEnvironment();
    });

    it('Create Folder - Missing Name Field', async () => {
      const createResult = await foldersService.create_folder_result(getSpaceId(), {});
      expect(createResult.is_error()).toBe(true);
      const error = createResult.axiosError;
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
    });

    it('Create Folder - Empty Body', async () => {
      const createResult = await foldersService.create_folder_result(getSpaceId(), {});
      expect(createResult.is_error()).toBe(true);
      const error = createResult.axiosError;
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('err');

      const validation = BaseSchemaValidator.validate(
        error.response.data,
        folderSchemas.errorResponseSchema,
        'Error Response'
      );
      expect(validation.isValid).toBe(true);

      expect(error.response.data).not.toHaveProperty('id');
    });

    it('Create Folder - Empty Name String', async () => {
      const createResult = await foldersService.create_folder_result(getSpaceId(), { name: '' });
      expect(createResult.is_error()).toBe(true);
      const error = createResult.axiosError;
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('err');

      const validation = BaseSchemaValidator.validate(
        error.response.data,
        folderSchemas.errorResponseSchema,
        'Error Response'
      );
      expect(validation.isValid).toBe(true);

      expect(error.response.data).not.toHaveProperty('id');
    });
  }
);