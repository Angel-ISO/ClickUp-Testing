import 'dotenv/config';
import TasksApiService from '../../bussines/apiServices/tasksApiService.js';
import FoldersApiService from '../../bussines/apiServices/foldersApiService.js';
import ListsApiService from '../../bussines/apiServices/listsApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import taskSchemas from '../../bussines/schemaValidators/taskSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';

const tasksService = new TasksApiService();
const foldersService = new FoldersApiService();
const listsService = new ListsApiService();

describe('TC-FN-005 - Verify that a user can update specific task fields without affecting other data', () => {
  let folderId;
  let listId;
  let createdTaskId;
  let originalTaskData;

  beforeAll(async () => {
    await setupClickUpEnvironment();
    
    // Get Folder ID
    const foldersResponse = await foldersService.get_folders(getSpaceId());
    folderId = foldersResponse.folders[0].id;
    // Get List ID
    const listResponse = await listsService.get_lists(folderId);
    listId = listResponse.lists[0].id;
  });

  afterEach(async () => {
    if (createdTaskId) {
      await tasksService.delete_task(createdTaskId);
      console.log(`Task deleted: ${createdTaskId}`);
      createdTaskId = null;
    }
  });

  it('Create Task with Multiple Fields for Partial Update Test', async () => {
    const uniqueTaskName = `Task Test - Partial Update - ${Date.now()}`;
    const taskData = { 
      name: uniqueTaskName,
      description: "Initial description for partial update test",
      priority: 2 // High priority
    };

    const createResponse = await tasksService.create_task(listId, taskData);
    createdTaskId = createResponse.id;
    originalTaskData = createResponse;

    console.log(`Task created: ${uniqueTaskName} (ID: ${createdTaskId})`);

    const validation = BaseSchemaValidator.validate(
      createResponse,
      taskSchemas.taskResponseSchema,
      'Task Response'
    );
    expect(validation.isValid).toBe(true);

    expect(createResponse).toHaveProperty('id');
    expect(createResponse).toHaveProperty('name', uniqueTaskName);
    expect(createResponse).toHaveProperty('description', taskData.description);
    expect(createResponse).toHaveProperty('priority');
    expect(createResponse.priority).toHaveProperty('id', taskData.priority.toString());
    expect(createResponse).toHaveProperty('status');

    console.log(`Task created with initial values - Name: "${uniqueTaskName}", Description: "${taskData.description}", Priority: ${taskData.priority}`);
  });

  it('Partial Update - Update Only Description Field', async () => {
    // Create Task
    const uniqueTaskName = `Task Test - Partial Update Desc - ${Date.now()}`;
    const taskData = { 
      name: uniqueTaskName,
      description: "Original description before partial update",
      priority: 1 
    };

    const createResponse = await tasksService.create_task(listId, taskData);
    createdTaskId = createResponse.id;
    const originalStatus = createResponse.status.status;

    console.log(`Task created for partial update test: ${uniqueTaskName} (ID: ${createdTaskId})`);

    const newDescription = `Updated description - ${Date.now()}`;
    const updateData = { description: newDescription };

    const updateResponse = await tasksService.update_task(createdTaskId, updateData);

    const updateValidation = BaseSchemaValidator.validate(
      updateResponse,
      taskSchemas.taskResponseSchema,
      'Updated Task Response'
    );
    expect(updateValidation.isValid).toBe(true);
    expect(updateResponse).toHaveProperty('id', createdTaskId);
    expect(updateResponse).toHaveProperty('description', newDescription);
    expect(updateResponse).toHaveProperty('name', uniqueTaskName);
    expect(updateResponse).toHaveProperty('status');
    expect(updateResponse.status).toHaveProperty('status', originalStatus);
    expect(updateResponse).toHaveProperty('priority');
    expect(updateResponse.priority).toHaveProperty('id', taskData.priority.toString());

    console.log(`Description successfully updated to: "${newDescription}"`);
    const getResponse = await tasksService.get_task(createdTaskId);

    const getValidation = BaseSchemaValidator.validate(
      getResponse,
      taskSchemas.taskResponseSchema,
      'Task Response After Get'
    );
    expect(getValidation.isValid).toBe(true);

    // Final verification
    expect(getResponse).toHaveProperty('id', createdTaskId);
    expect(getResponse).toHaveProperty('name', uniqueTaskName);
    expect(getResponse).toHaveProperty('description', newDescription);
    expect(getResponse).toHaveProperty('status');
    expect(getResponse.status).toHaveProperty('status', originalStatus);
    expect(getResponse).toHaveProperty('priority');
    expect(getResponse.priority).toHaveProperty('id', taskData.priority.toString());

    console.log(`Partial update verified - Only description changed, other fields preserved`);
  });
  it('Partial Update - Update Multiple Specific Fields', async () => {
    // Create Task
    const uniqueTaskName = `Task Test - Partial Update Multi - ${Date.now()}`;
    const taskData = { 
      name: uniqueTaskName,
      description: "Original description for multi-field update",
      priority: 1
    };

    const createResponse = await tasksService.create_task(listId, taskData);
    createdTaskId = createResponse.id;
    const originalName = createResponse.name;

    console.log(`Task created for multi-field update test: ${uniqueTaskName} (ID: ${createdTaskId})`);

    // Partial update
    const newDescription = `Updated multi-field description - ${Date.now()}`;
    const newPriority = "2";
    const updateData = {
      description: newDescription,
      priority: newPriority
    };

    const updateResponse = await tasksService.update_task(createdTaskId, updateData);

    const updateValidation = BaseSchemaValidator.validate(
      updateResponse,
      taskSchemas.taskResponseSchema,
      'Updated Task Response'
    );
    expect(updateValidation.isValid).toBe(true);


    expect(updateResponse).toHaveProperty('id', createdTaskId);
    expect(updateResponse).toHaveProperty('description', newDescription);
    expect(updateResponse).toHaveProperty('priority');
    expect(updateResponse.priority).toHaveProperty('id', newPriority);
    expect(updateResponse).toHaveProperty('name', originalName);
    expect(updateResponse).toHaveProperty('status');
    expect(updateResponse.status).toHaveProperty('status', createResponse.status.status);

    console.log(`Multiple fields updated - Description: "${newDescription}", Priority: ${newPriority}`);

    // Verify via GET request
    const getResponse = await tasksService.get_task(createdTaskId);

    // Final verification
    expect(getResponse).toHaveProperty('id', createdTaskId);
    expect(getResponse).toHaveProperty('name', originalName);
    expect(getResponse).toHaveProperty('description', newDescription);
    expect(getResponse).toHaveProperty('priority');
    expect(getResponse.priority).toHaveProperty('id', newPriority);
    expect(getResponse).toHaveProperty('status');
    expect(getResponse.status).toHaveProperty('status', createResponse.status.status);

    console.log(`Partial multi-field update verified - Only specified fields changed, name and status preserved`);
  });
});