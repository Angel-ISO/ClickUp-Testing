import 'dotenv/config';
import FoldersApiService from '../../bussines/apiServices/foldersApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import folderSchemas from '../../bussines/schemaValidators/folderSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';

const foldersService = new FoldersApiService();

describe('TC-S-003 - Verify that folder creation endpoint requires valid authentication token', () => {
  beforeAll(async () => {
    await setupClickUpEnvironment();
  });

    it('Create Folder - No Auth Token', async () => {
        try {
            await foldersService.create_folder_with_custom_auth(getSpaceId(), {
                name: 'Test Folder'
            }, null);
            fail('Expected request to fail with 401');
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toHaveProperty('err');

            const errorText = error.response.data.err.toLowerCase();
            expect(
                errorText.includes('token') ||
                errorText.includes('auth') ||
                errorText.includes('unauthorized')
            ).toBe(true);

            const validation = BaseSchemaValidator.validate(
                error.response.data,
                folderSchemas.errorResponseSchema,
                'Error Response'
            );
            expect(validation.isValid).toBe(true);
        }
    });

    it('Create Folder - Invalid Token', async () => {
        try {
            await foldersService.create_folder_with_custom_auth(getSpaceId(), {
                name: 'Test Folder'
            }, 'Bearer invalid_token_12345_this_is_not_real');
            fail('Expected request to fail with 401');
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toHaveProperty('err');

            const validation = BaseSchemaValidator.validate(
                error.response.data,
                folderSchemas.errorResponseSchema,
                'Error Response'
            );
            expect(validation.isValid).toBe(true);
        }
    });

    it('Get Folders - No Auth Token', async () => {
        try {
            await foldersService.get_folders_with_custom_auth(getSpaceId(), null);
            fail('Expected request to fail with 401');
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toHaveProperty('err');

            const validation = BaseSchemaValidator.validate(
                error.response.data,
                folderSchemas.errorResponseSchema,
                'Error Response'
            );
            expect(validation.isValid).toBe(true);
        }
    });

    it('Update Folder - No Auth Token', async () => {
        try {
            await foldersService.update_folder_with_custom_auth('901314763847', {
                name: 'Updated Name'
            }, null);
            fail('Expected request to fail with 401');
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toHaveProperty('err');

            const validation = BaseSchemaValidator.validate(
                error.response.data,
                folderSchemas.errorResponseSchema,
                'Error Response'
            );
            expect(validation.isValid).toBe(true);
        }
    });
});
