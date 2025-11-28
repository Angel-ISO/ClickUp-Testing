import 'dotenv/config';
import FoldersApiService from '../../bussines/apiServices/foldersApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import folderSchemas from '../../bussines/schemaValidators/folderSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';

const foldersService = new FoldersApiService();

taggedDescribe(
    buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.FOLDERS }),
    'TC-FP-008 - Verify that user can delete a folder successfully',
    () => {
        let createdFolderId;

        beforeAll(async () => {
            await setupClickUpEnvironment();
        });

        afterEach(async () => {
            createdFolderId = null;
        });

        it('Delete Folder - Valid Folder ID', async () => {
            const uniqueFolderName = `Delete Test Folder - ${Date.now()}`;

            const createResponse = await foldersService.createFolder(getSpaceId(), {
                name: uniqueFolderName
            });
            createdFolderId = createResponse.id;

            console.log(`Folder created for deletion test: ${uniqueFolderName} (ID: ${createdFolderId})`);

            const deleteResponse = await foldersService.deleteFolder(createdFolderId);

            expect(deleteResponse).toBeDefined();

            console.log(`Folder deleted successfully: ${createdFolderId}`);

            const foldersResponse = await foldersService.getFolders(getSpaceId());

            const validation = BaseSchemaValidator.validate(
                foldersResponse,
                folderSchemas.foldersListResponseSchema,
                'Folders List Response'
            );
            expect(validation.isValid).toBe(true);

            expect(foldersResponse).toHaveProperty('folders');
            expect(Array.isArray(foldersResponse.folders)).toBe(true);

            const deletedFolder = foldersResponse.folders.find(f => f.id === createdFolderId);
            expect(deletedFolder).toBeUndefined();

            createdFolderId = null;
        });
    }
);
