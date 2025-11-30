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
  'TC-FP-001 - Verify that a user can create a task with valid data',
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

  it('Create Task - Valid Data', async () => {
    const uniqueTaskName = `Task Test - Valid Data - ${Date.now()}`;
    const taskData = { name: uniqueTaskName };

    const createResponse = await tasksService.createTask(listId, taskData);
    createdTaskId = createResponse.id;

    console.log(`Task created: ${uniqueTaskName} (ID: ${createdTaskId})`);

    // Schema validation
    const validation = BaseSchemaValidator.validate(
      createResponse,
      taskSchemas.taskResponseSchema,
      'Task Response'
    );
    expect(validation.isValid).toBe(true);

    // Data validation
    expect(createResponse).toHaveProperty('id');
    expect(createResponse).toHaveProperty('name', uniqueTaskName);
    expect(createResponse).toHaveProperty('status');
    expect(createResponse.status).toHaveProperty('status');
    expect(createResponse.status).toHaveProperty('color');
    expect(createResponse.status).toHaveProperty('type');
    expect(createResponse).toHaveProperty('creator');
    expect(createResponse.creator).toHaveProperty('id');
    expect(createResponse.creator).toHaveProperty('username');
    expect(createResponse.creator).toHaveProperty('email');
    expect(createResponse).toHaveProperty('date_created');
    expect(createResponse).toHaveProperty('url');
  });

  it('Get Task - Verify Creation', async () => {
    const uniqueTaskName = `Task Test - Verify - ${Date.now()}`;
    const taskData = { name: uniqueTaskName };

    const createResponse = await tasksService.createTask(listId, taskData);
    createdTaskId = createResponse.id;

    console.log(`Task created for verification: ${uniqueTaskName} (ID: ${createdTaskId})`);

    const getResponse = await tasksService.getTask(createdTaskId);

    // Schema validation
    const validation = BaseSchemaValidator.validate(
      getResponse,
      taskSchemas.taskResponseSchema,
      'Task Response'
    );
    expect(validation.isValid).toBe(true);

    // Data validation
    expect(getResponse).toHaveProperty('id', createdTaskId);
    expect(getResponse).toHaveProperty('name', uniqueTaskName);
    expect(getResponse).toHaveProperty('status');
    expect(getResponse.status).toHaveProperty('status');
  });
}, 20000);