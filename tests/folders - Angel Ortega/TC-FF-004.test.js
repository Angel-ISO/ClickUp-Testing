import 'dotenv/config';
import FoldersApiService from '../../bussines/apiServices/foldersApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import folderSchemas from '../../bussines/schemaValidators/folderSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';

const foldersService = new FoldersApiService();

describe('TC-FF-004 - Validate that system properly handles special characters in folder name', () => {
    const createdFolderIds = [];

    beforeAll(async () => {
        await setupClickUpEnvironment();
    });

    afterEach(async () => {
        for (const folderId of createdFolderIds) {
            try {
                await foldersService.delete_folder(folderId);
                console.log(`Cleaned up folder: ${folderId}`);
            } catch (error) {
                console.warn(`Cleanup failed for ${folderId}:`, error.message);
            }
        }
        createdFolderIds.length = 0;
    });

    it('Create Folder - Special Characters', async () => {
        const folderName = 'Test@#$%^&*()Folder';

        try {
            const response = await foldersService.create_folder(getSpaceId(), { name: folderName });

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
        } catch (error) {
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

        try {
            const response = await foldersService.create_folder(getSpaceId(), { name: folderName });

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
        } catch (error) {
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

        try {
            const response = await foldersService.create_folder(getSpaceId(), { name: folderName });

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
        } catch (error) {
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
});