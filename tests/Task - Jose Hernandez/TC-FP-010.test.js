import 'dotenv/config';
import foldersService from '../../bussines/apiServices/foldersApiService.js';
import listsService from "../../bussines/apiServices/listsApiService.js";
import tasksService from "../../bussines/apiServices/tasksApiService.js";
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import taskSchemas from '../../bussines/schemaValidators/taskSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';

taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.TASKS }),
  'TC-FP-010 - Verify that a user can update task priority and description fields',
  () => {
    let folderId;
    let listId;
    let createdTaskId;

    beforeAll(async () => {
      await setupClickUpEnvironment();
      
      // Get Folder ID
      const foldersResponse = await foldersService.get_folders(getSpaceId());
      folderId = foldersResponse.folders[0].id;
      // Get List ID
      const listResponse = await listsService.get_lists(folderId);
      listId = listResponse.lists[0].id;

      // Create a task to update
      const uniqueTaskName = `Task for Multi-field Update - ${Date.now()}`;
      const taskData = { 
        name: uniqueTaskName,
        description: "Initial description",
        priority: 1
      };
      const createResponse = await tasksService.create_task(listId, taskData);
      createdTaskId = createResponse.id;
      console.log(`Task created for multi-field update: ${uniqueTaskName} (ID: ${createdTaskId})`);
    });

    afterAll(async () => {
      if (createdTaskId) {
        try {
          await tasksService.delete_task(createdTaskId);
          console.log(`Task deleted: ${createdTaskId}`);
        } catch (error) {
          console.log(`Error deleting task ${createdTaskId}:`, error.message);
        }
      }
    });

    it('Update Task - Modify Priority Field', async () => {
      const updateData = { priority: 2 };
      
      const updateResponse = await tasksService.update_task(createdTaskId, updateData);

      const validation = BaseSchemaValidator.validate(
        updateResponse,
        taskSchemas.taskResponseSchema,
        'Task Response'
      );
      expect(validation.isValid).toBe(true);

      expect(updateResponse).toHaveProperty('id', createdTaskId);
      if (typeof updateResponse.priority === 'object') {
        expect(updateResponse.priority).toHaveProperty('id', String(2));
      } else {
        expect(updateResponse).toHaveProperty('priority', 2);
      }
      console.log(`Task priority successfully updated to: 2`);
    });

    it('Update Task - Modify Description Field', async () => {
      const updatedDescription = `Updated description - ${Date.now()} - This is a longer description with more details`;
      const updateData = { description: updatedDescription };
      
      const updateResponse = await tasksService.update_task(createdTaskId, updateData);

      expect(updateResponse).toHaveProperty('id', createdTaskId);
      expect(updateResponse).toHaveProperty('description', updatedDescription);
      
      const validation = BaseSchemaValidator.validate(
        updateResponse,
        taskSchemas.taskResponseSchema,
        'Task Response'
      );
      expect(validation.isValid).toBe(true);
      console.log(`Task description successfully updated`);
    });

    it('Update Task - Modify Multiple Fields Simultaneously', async () => {
      const updatedName = `Task Updated Multiple - ${Date.now()}`;
      const updatedDescription = `Multi-field updated description - ${Date.now()}`;
      const updateData = { 
        name: updatedName,
        description: updatedDescription,
        priority: 3
      };
      
      const updateResponse = await tasksService.update_task(createdTaskId, updateData);

      expect(updateResponse).toHaveProperty('id', createdTaskId);
      expect(updateResponse).toHaveProperty('name', updatedName);
      expect(updateResponse).toHaveProperty('description', updatedDescription);
      if (typeof updateResponse.priority === 'object') {
        expect(updateResponse.priority).toHaveProperty('id', String(3));
      } else {
        expect(updateResponse).toHaveProperty('priority', 3);
      }
      
      const validation = BaseSchemaValidator.validate(
        updateResponse,
        taskSchemas.taskResponseSchema,
        'Task Response'
      );
      expect(validation.isValid).toBe(true);
      console.log(`Task multiple fields successfully updated`);
    });
  },
  20000
);
