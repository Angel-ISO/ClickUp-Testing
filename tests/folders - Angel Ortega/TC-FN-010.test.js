import 'dotenv/config';
import FoldersApiService from '../../bussines/apiServices/foldersApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import folderSchemas from '../../bussines/schemaValidators/folderSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';

const foldersService = new FoldersApiService();

taggedDescribe(
    buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.FOLDERS, negative: true }),
    'TC-FN-010 - Verify that system handles invalid folder update data appropriately',
    () => {
        let createdFolderId;

        beforeAll(async () => {
            await setupClickUpEnvironment();
        });

        beforeEach(async () => {
            const createResponse = await foldersService.create_folder(getSpaceId(), {
                name: `Test Folder - ${Date.now()}`
            });
            createdFolderId = createResponse.id;
            console.log(`Folder created for negative test: ${createdFolderId}`);
        });

        afterEach(async () => {
            if (createdFolderId) {
                try {
                    await foldersService.delete_folder(createdFolderId);
                    console.log(`Folder deleted: ${createdFolderId}`);
                } catch (error) {
                    console.warn('Cleanup failed:', error.message);
                }
                createdFolderId = null;
            }
        });

        it('Update Folder - Missing Name Field', async () => {
            try {
                const response = await foldersService.update_folder(createdFolderId, {});

                expect(response).toHaveProperty('id');
                expect(response.id).toBe(createdFolderId);
                console.log('API allows update with empty body (no changes made)');
            } catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('err');

                const validation = BaseSchemaValidator.validate(
                    error.response.data,
                    folderSchemas.errorResponseSchema,
                    'Error Response'
                );
                expect(validation.isValid).toBe(true);

                console.log('API correctly rejected update without name field');
            }
        });

        it('Update Folder - Invalid Folder ID Format', async () => {
            const invalidFolderId = 'invalid-id-format';

            try {
                await foldersService.update_folder(invalidFolderId, {
                    name: 'Updated Name'
                });
                fail('Expected request to fail with invalid folder ID');
            } catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('err');

                const validation = BaseSchemaValidator.validate(
                    error.response.data,
                    folderSchemas.errorResponseSchema,
                    'Error Response'
                );
                expect(validation.isValid).toBe(true);

                console.log('Correctly rejected invalid folder ID format');
            }
        });

        it('Update Folder - Extremely Long Name', async () => {
            const longName = 'A'.repeat(1000);

            try {
                const response = await foldersService.update_folder(createdFolderId, {
                    name: longName
                });

                expect(response).toHaveProperty('id');
                expect(response).toHaveProperty('name');
                console.log(`API allows long names (${response.name.length} chars)`);
            } catch (error) {
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('err');

                const validation = BaseSchemaValidator.validate(
                    error.response.data,
                    folderSchemas.errorResponseSchema,
                    'Error Response'
                );
                expect(validation.isValid).toBe(true);

                console.log('API correctly rejected extremely long name');
            }
        });
    }
);
