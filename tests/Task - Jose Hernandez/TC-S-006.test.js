import 'dotenv/config';
import foldersService from '../../bussines/apiServices/foldersApiService.js';
import listsService from "../../bussines/apiServices/listsApiService.js";
import tasksService from "../../bussines/apiServices/tasksApiService.js";
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import taskSchemas from '../../bussines/schemaValidators/taskSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';

taggedDescribe(
  buildTags({smoke: true, funcionalidad: FUNCIONALIDADES.TASKS}),
  'TC-S-006 - Verify basic task update functionality',
  () => {
    let folderId;
    let listId;
    let createdTaskId;

    beforeAll(async () => {
      await setupClickUpEnvironment();
      
      // Get Folder ID
      const foldersResponse = await foldersService.getFolders(getSpaceId());
      folderId = foldersResponse.folders[0].id;
      // Get List ID
      const listResponse = await listsService.getLists(folderId);
      listId = listResponse.lists[0].id;

      // Create a task to update
      const uniqueTaskName = `Smoke Test Task - ${Date.now()}`;
      const taskData = { name: uniqueTaskName };
      const createResponse = await tasksService.createTask(listId, taskData);
      createdTaskId = createResponse.id;
      console.log(`Task created for smoke test: ${uniqueTaskName} (ID: ${createdTaskId})`);
    });

    afterAll(async () => {
      if (createdTaskId) {
        try {
          await tasksService.deleteTask(createdTaskId);
          console.log(`Task deleted: ${createdTaskId}`);
        } catch (error) {
          console.log(`Error deleting task ${createdTaskId}:`, error.message);
        }
      }
    });

    it('Smoke - Update Task Name Successfully', async () => {
      const updatedTaskName = `Updated Smoke Task - ${Date.now()}`;
      
      const updateResponse = await tasksService.updateTask(createdTaskId, { name: updatedTaskName });

      const validation = BaseSchemaValidator.validate(
        updateResponse,
        taskSchemas.taskResponseSchema,
        'Task Response'
      );
      expect(validation.isValid).toBe(true);

      expect(updateResponse).toHaveProperty('id', createdTaskId);
      expect(updateResponse).toHaveProperty('name', updatedTaskName);
      console.log(`Smoke test passed: Task name updated successfully`);
    });
  },
  20000
);
