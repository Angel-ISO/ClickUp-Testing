import 'dotenv/config';
import FoldersApiService from '../../bussines/apiServices/foldersApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import folderSchemas from '../../bussines/schemaValidators/folderSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';

const foldersService = new FoldersApiService();

describe('TC-FP-001 - Verify that user can create a folder with valid name in existing space', () => {
  beforeAll(async () => {
    await setupClickUpEnvironment();
  });
  let createdFolderId;

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

  it('Create and verify folder', async () => {
    const uniqueFolderName = `Test Folder - ${Date.now()}`;
    const folderData = { name: uniqueFolderName };

    const createResponse = await foldersService.create_folder(getSpaceId(), folderData);
    createdFolderId = createResponse.id;

    console.log(`Folder created: ${uniqueFolderName} (ID: ${createdFolderId})`);

    expect(createResponse).toHaveProperty('id');
    expect(createResponse).toHaveProperty('name');
    expect(createResponse.name).toBe(uniqueFolderName);

    const foldersResponse = await foldersService.get_folders(getSpaceId());

    const validation = BaseSchemaValidator.validate(
      foldersResponse,
      folderSchemas.foldersListResponseSchema,
      'Folders List Response'
    );
    expect(validation.isValid).toBe(true);

    expect(foldersResponse).toHaveProperty('folders');
    expect(Array.isArray(foldersResponse.folders)).toBe(true);
    expect(foldersResponse.folders.length).toBeGreaterThan(0);

    const folder = foldersResponse.folders.find(f => f.id === createdFolderId);
    expect(folder).toBeDefined();
    expect(folder.name).toBe(uniqueFolderName);
    expect(folder.id).toBe(createdFolderId);
  });
});