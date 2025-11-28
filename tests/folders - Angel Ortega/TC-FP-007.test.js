import 'dotenv/config';
import FoldersApiService from '../../bussines/apiServices/foldersApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import folderSchemas from '../../bussines/schemaValidators/folderSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';

const foldersService = new FoldersApiService();

taggedDescribe(
    buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.FOLDERS }),
    'TC-FP-007 - Verify that user can update folder name successfully',
    () => {
        let createdFolderId;

        beforeAll(async () => {
            await setupClickUpEnvironment();
        });

        afterEach(async () => {
            if (createdFolderId) {
                try {
                    await foldersService.deleteFolder(createdFolderId);
                    console.log(`Folder deleted: ${createdFolderId}`);
                } catch (error) {
                    console.warn('Cleanup failed:', error.message);
                }
                createdFolderId = null;
            }
        });

        it('Update Folder - Valid Name Change', async () => {
            const originalName = `Original Folder - ${Date.now()}`;
            const updatedName = `Updated Folder - ${Date.now()}`;

            const createResponse = await foldersService.createFolder(getSpaceId(), {
                name: originalName
            });
            createdFolderId = createResponse.id;

            console.log(`Folder created: ${originalName} (ID: ${createdFolderId})`);

            const updateResponse = await foldersService.updateFolder(createdFolderId, {
                name: updatedName
            });

            expect(updateResponse).toHaveProperty('id');
            expect(updateResponse).toHaveProperty('name');
            expect(updateResponse.id).toBe(createdFolderId);
            expect(updateResponse.name).toBe(updatedName);
            expect(updateResponse.name).not.toBe(originalName);

            const validation = BaseSchemaValidator.validate(
                updateResponse,
                folderSchemas.folderResponseSchema,
                'Folder Response'
            );
            expect(validation.isValid).toBe(true);

            console.log(`Folder updated successfully: ${updatedName}`);
        });
    }
);
