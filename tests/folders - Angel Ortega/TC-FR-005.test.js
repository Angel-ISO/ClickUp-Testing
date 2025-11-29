import 'dotenv/config';
import foldersService from '../../bussines/apiServices/foldersApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import folderSchemas from '../../bussines/schemaValidators/folderSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';

taggedDescribe(
    buildTags({ funcionalidad: FUNCIONALIDADES.FOLDERS }),
    'TC-FR-005 - Verify that creating a folder with duplicate name produces consistent behavior',
    () => {
        const createdFolderIds = [];
        let allowsDuplicates = null;

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
            allowsDuplicates = null;
        });

        it('Create Folder - First Instance', async () => {
            const response = await foldersService.create_folder(getSpaceId(), {
                name: 'Duplicate Test Folder'
            });

            expect(response).toHaveProperty('id');
            expect(response).toHaveProperty('name');
            expect(response.name).toBe('Duplicate Test Folder');

            const validation = BaseSchemaValidator.validate(
                response,
                folderSchemas.folderResponseSchema,
                'Folder Response'
            );
            expect(validation.isValid).toBe(true);

            createdFolderIds.push(response.id);
        });

        it('Create Folder - Duplicate Name (Second Instance)', async () => {
            const firstResponse = await foldersService.create_folder(getSpaceId(), {
                name: 'Duplicate Test Folder'
            });
            createdFolderIds.push(firstResponse.id);

            try {
                const secondResponse = await foldersService.create_folder(getSpaceId(), {
                    name: 'Duplicate Test Folder'
                });

                allowsDuplicates = true;
                expect(secondResponse).toHaveProperty('id');
                expect(secondResponse).toHaveProperty('name');
                expect(secondResponse.name).toBe('Duplicate Test Folder');
                expect(secondResponse.id).not.toBe(firstResponse.id);

                createdFolderIds.push(secondResponse.id);
            } catch (error) {
                allowsDuplicates = false;
                expect(error.response.status).toBe(400);
                expect(error.response.data).toHaveProperty('err');
            }
        });

        it('Get Folders - Verify Consistency', async () => {
            const firstResponse = await foldersService.create_folder(getSpaceId(), {
                name: 'Duplicate Test Folder'
            });
            createdFolderIds.push(firstResponse.id);

            let secondCreated = false;
            try {
                const secondResponse = await foldersService.create_folder(getSpaceId(), {
                    name: 'Duplicate Test Folder'
                });
                createdFolderIds.push(secondResponse.id);
                secondCreated = true;
            } catch (error) {
                secondCreated = false;
            }

            const foldersResponse = await foldersService.get_folders(getSpaceId());
            expect(foldersResponse).toHaveProperty('folders');
            expect(Array.isArray(foldersResponse.folders)).toBe(true);

            const duplicateFolders = foldersResponse.folders.filter(
                f => f.name === 'Duplicate Test Folder'
            );

            if (secondCreated) {
                expect(duplicateFolders.length).toBeGreaterThanOrEqual(2);
            } else {
                expect(duplicateFolders.length).toBe(1);
            }
        });

        it('Create Folder - Third Instance (Reliability Check)', async () => {
            const firstResponse = await foldersService.create_folder(getSpaceId(), {
                name: 'Duplicate Test Folder'
            });
            createdFolderIds.push(firstResponse.id);

            let secondSucceeded = false;
            try {
                const secondResponse = await foldersService.create_folder(getSpaceId(), {
                    name: 'Duplicate Test Folder'
                });
                createdFolderIds.push(secondResponse.id);
                secondSucceeded = true;
            } catch (error) {
                secondSucceeded = false;
            }

            try {
                const thirdResponse = await foldersService.create_folder(getSpaceId(), {
                    name: 'Duplicate Test Folder'
                });

                expect(secondSucceeded).toBe(true);
                createdFolderIds.push(thirdResponse.id);
            } catch (error) {
                expect(secondSucceeded).toBe(false);
                expect(error.response.status).toBe(400);
            }
        });
    });
