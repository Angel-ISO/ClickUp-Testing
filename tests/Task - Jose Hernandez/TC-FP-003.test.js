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
  'TC-FP-003 - Verify that a user can update the status of an existing task',
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
  });

  afterEach(async () => {
    if (createdTaskId) {
      await tasksService.deleteTask(createdTaskId);
      console.log(`Task deleted: ${createdTaskId}`);
      createdTaskId = null;
    }
  });

  it('Create Task - Initial Status', async () => {
    const uniqueTaskName = `Task Test - Update Status - ${Date.now()}`;
    const taskData = { name: uniqueTaskName };

    const createResponse = await tasksService.createTask(listId, taskData);
    createdTaskId = createResponse.id;

    console.log(`Task created: ${uniqueTaskName} (ID: ${createdTaskId})`);


    const validation = BaseSchemaValidator.validate(
      createResponse,
      taskSchemas.taskResponseSchema,
      'Task Response'
    );
    expect(validation.isValid).toBe(true);


    expect(createResponse).toHaveProperty('id');
    expect(createResponse).toHaveProperty('name', uniqueTaskName);
    expect(createResponse).toHaveProperty('status');
    expect(createResponse.status).toHaveProperty('status');
    expect(createResponse.status).toHaveProperty('color');
    expect(createResponse.status).toHaveProperty('type');

    const initialStatus = createResponse.status.status;
    console.log(`Initial task status: ${initialStatus}`);
  });

  it('Update Task Status and Verify - Valid Status Change', async () => {
    //Create Task
    const uniqueTaskName = `Task Test - Status Update - ${Date.now()}`;
    const taskData = { name: uniqueTaskName };

    const createResponse = await tasksService.createTask(listId, taskData);
    createdTaskId = createResponse.id;
    const initialStatus = createResponse.status.status;

    console.log(`Task created for status update: ${uniqueTaskName} (ID: ${createdTaskId})`);
    const newStatus = "completado"; 
    const updateData = { status: newStatus };
    const updateResponse = await tasksService.updateTask(createdTaskId, updateData);

    const updateValidation = BaseSchemaValidator.validate(
      updateResponse,
      taskSchemas.taskResponseSchema,
      'Updated Task Response'
    );
    expect(updateValidation.isValid).toBe(true);


    expect(updateResponse).toHaveProperty('id', createdTaskId);
    expect(updateResponse).toHaveProperty('status');
    expect(updateResponse.status).toHaveProperty('status', newStatus);
    expect(updateResponse.status).toHaveProperty('color');
    expect(updateResponse.status).toHaveProperty('type');

    console.log(`Task status updated from "${initialStatus}" to "${newStatus}"`);


    const getResponse = await tasksService.getTask(createdTaskId);


    const getValidation = BaseSchemaValidator.validate(
      getResponse,
      taskSchemas.taskResponseSchema,
      'Task Response After Get'
    );
    expect(getValidation.isValid).toBe(true);


    expect(getResponse).toHaveProperty('id', createdTaskId);
    expect(getResponse).toHaveProperty('name', uniqueTaskName);
    expect(getResponse).toHaveProperty('status');
    expect(getResponse.status).toHaveProperty('status', newStatus);
    expect(getResponse.status.status).not.toBe(initialStatus);
    expect(getResponse.status.status).toBe(newStatus);
    
    console.log(`Status successfully verified via GET: "${getResponse.status.status}"`);
  });
}, 20000);