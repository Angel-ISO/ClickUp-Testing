import 'dotenv/config';
import foldersService from '../../bussines/apiServices/foldersApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import folderSchemas from '../../bussines/schemaValidators/folderSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
import result from '../../core/result.js';


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
                const deleteResult = await foldersService.delete_folder_result(createdFolderId);
                result.fold(
                    deleteResult,
                    (error) => console.warn('Cleanup failed:', error),
                    (value) => console.log(`Folder deleted: ${createdFolderId}`)
                );
                createdFolderId = null;
            }
        });

        it('Update Folder - Missing Name Field', async () => {
            const updateResult = await foldersService.update_folder_result(createdFolderId, {});
            if (updateResult.is_ok()) {
                const response = updateResult.value;
                expect(response).toHaveProperty('id');
                expect(response.id).toBe(createdFolderId);
                console.log('API allows update with empty body (no changes made)');
            } else {
                const error = updateResult.axiosError;
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

            const updateResult = await foldersService.update_folder_result(invalidFolderId, {
                name: 'Updated Name'
            });
            expect(updateResult.is_error()).toBe(true);
            const error = updateResult.axiosError;
            expect(error.response.status).toBe(400);
            expect(error.response.data).toHaveProperty('err');

            const validation = BaseSchemaValidator.validate(
                error.response.data,
                folderSchemas.errorResponseSchema,
                'Error Response'
            );
            expect(validation.isValid).toBe(true);

            console.log('Correctly rejected invalid folder ID format');
        });

        it('Update Folder - Extremely Long Name', async () => {
            const longName = 'A'.repeat(1000);

            const updateResult = await foldersService.update_folder_result(createdFolderId, {
                name: longName
            });
            if (updateResult.is_ok()) {
                const response = updateResult.value;
                expect(response).toHaveProperty('id');
                expect(response).toHaveProperty('name');
                console.log(`API allows long names (${response.name.length} chars)`);
            } else {
                const error = updateResult.axiosError;
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
