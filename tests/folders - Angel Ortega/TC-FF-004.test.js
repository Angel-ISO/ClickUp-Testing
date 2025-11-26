import 'dotenv/config';
import FoldersApiService from '../../bussines/apiServices/foldersApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import folderSchemas from '../../bussines/schemaValidators/folderSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
import result from '../../core/result.js';

const foldersService = new FoldersApiService();

taggedDescribe(
    buildTags({ funcionalidad: FUNCIONALIDADES.FOLDERS }),
    'TC-FF-004 - Validate that system properly handles special characters in folder name',
    () => {
        const createdFolderIds = [];

        beforeAll(async () => {
            await setupClickUpEnvironment();
        });

        afterEach(async () => {
            for (const folderId of createdFolderIds) {
                const deleteResult = await foldersService.delete_folder_result(folderId);
                result.fold(
                    deleteResult,
                    (error) => console.warn(`Cleanup failed for ${folderId}:`, error),
                    (value) => console.log(`Cleaned up folder: ${folderId}`)
                );
            }
            createdFolderIds.length = 0;
        });

        it('Create Folder - Special Characters', async () => {
            const folderName = 'Test@#$%^&*()Folder';

            const createResult = await foldersService.create_folder_result(getSpaceId(), { name: folderName });
            if (createResult.is_ok()) {
                const response = createResult.value;
                expect(response).toHaveProperty('id');
                expect(response).toHaveProperty('name');
                expect(response.name).toContain('@');
                expect(response.name).toBe(folderName);

                const validation = BaseSchemaValidator.validate(
                    response,
                    folderSchemas.folderResponseSchema,
                    'Folder Response'
                );
                expect(validation.isValid).toBe(true);

                createdFolderIds.push(response.id);
            } else {
                const error = createResult.axiosError;
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('err');

                const validation = BaseSchemaValidator.validate(
                    error.response.data,
                    folderSchemas.errorResponseSchema,
                    'Error Response'
                );
                expect(validation.isValid).toBe(true);
            }
        });

        it('Create Folder - Emojis', async () => {
            const folderName = 'Test Folder 🚀📁✨';

            const createResult = await foldersService.create_folder_result(getSpaceId(), { name: folderName });
            if (createResult.is_ok()) {
                const response = createResult.value;
                expect(response).toHaveProperty('id');
                expect(response).toHaveProperty('name');
                expect(response.name).toContain('🚀');
                expect(response.name).toBe(folderName);

                const validation = BaseSchemaValidator.validate(
                    response,
                    folderSchemas.folderResponseSchema,
                    'Folder Response'
                );
                expect(validation.isValid).toBe(true);

                createdFolderIds.push(response.id);
            } else {
                const error = createResult.axiosError;
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('err');

                const validation = BaseSchemaValidator.validate(
                    error.response.data,
                    folderSchemas.errorResponseSchema,
                    'Error Response'
                );
                expect(validation.isValid).toBe(true);
            }
        });

        it('Create Folder - Unicode Characters', async () => {
            const folderName = 'Carpeta Tëst 测试 フォルダ';

            const createResult = await foldersService.create_folder_result(getSpaceId(), { name: folderName });
            if (createResult.is_ok()) {
                const response = createResult.value;
                expect(response).toHaveProperty('id');
                expect(response).toHaveProperty('name');
                expect(response.name).toContain('测');
                expect(response.name).toBe(folderName);

                const validation = BaseSchemaValidator.validate(
                    response,
                    folderSchemas.folderResponseSchema,
                    'Folder Response'
                );
                expect(validation.isValid).toBe(true);

                createdFolderIds.push(response.id);
            } else {
                const error = createResult.axiosError;
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('err');

                const validation = BaseSchemaValidator.validate(
                    error.response.data,
                    folderSchemas.errorResponseSchema,
                    'Error Response'
                );
                expect(validation.isValid).toBe(true);
            }
        });
    }
);