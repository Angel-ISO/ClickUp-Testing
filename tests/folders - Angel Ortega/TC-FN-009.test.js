import 'dotenv/config';
import FoldersApiService from '../../bussines/apiServices/foldersApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import folderSchemas from '../../bussines/schemaValidators/folderSchemas.js';
import { setupClickUpEnvironment } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';

const foldersService = new FoldersApiService();

taggedDescribe(
    buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.FOLDERS, negative: true }),
    'TC-FN-009 - Verify that system returns error when trying to get non-existent folder',
    () => {
        beforeAll(async () => {
            await setupClickUpEnvironment();
        });

        it('Get Folder - Non-existent Folder ID', async () => {
            const nonExistentFolderId = '999999999999999';

            try {
                await foldersService.get_folder(nonExistentFolderId);
                fail('Expected request to fail with 404');
            } catch (error) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toHaveProperty('err');
                expect(error.response.data.err).toBeTruthy();

                const validation = BaseSchemaValidator.validate(
                    error.response.data,
                    folderSchemas.errorResponseSchema,
                    'Error Response'
                );
                expect(validation.isValid).toBe(true);

                expect(error.response.data).not.toHaveProperty('id');

                console.log(`Correctly returned error for non-existent folder: ${nonExistentFolderId}`);
            }
        });

        it('Update Folder - Non-existent Folder ID', async () => {
            const nonExistentFolderId = '999999999999999';

            try {
                await foldersService.update_folder(nonExistentFolderId, {
                    name: 'Updated Name'
                });
                fail('Expected request to fail with 404');
            } catch (error) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toHaveProperty('err');

                const validation = BaseSchemaValidator.validate(
                    error.response.data,
                    folderSchemas.errorResponseSchema,
                    'Error Response'
                );
                expect(validation.isValid).toBe(true);

                console.log(`Correctly returned error for updating non-existent folder: ${nonExistentFolderId}`);
            }
        });

        it('Delete Folder - Non-existent Folder ID', async () => {
            const nonExistentFolderId = '999999999999999';

            try {
                await foldersService.delete_folder(nonExistentFolderId);
                fail('Expected request to fail with 404');
            } catch (error) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toHaveProperty('err');

                const validation = BaseSchemaValidator.validate(
                    error.response.data,
                    folderSchemas.errorResponseSchema,
                    'Error Response'
                );
                expect(validation.isValid).toBe(true);

                console.log(`Correctly returned error for deleting non-existent folder: ${nonExistentFolderId}`);
            }
        });
    }
);
