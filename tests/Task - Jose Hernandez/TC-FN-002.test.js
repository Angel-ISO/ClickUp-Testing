import 'dotenv/config';
import TasksApiService from '../../bussines/apiServices/tasksApiService.js';
import FoldersApiService from '../../bussines/apiServices/foldersApiService.js';
import ListsApiService from '../../bussines/apiServices/listsApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import taskSchemas from '../../bussines/schemaValidators/taskSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';

const tasksService = new TasksApiService();
const foldersService = new FoldersApiService();
const listsService = new ListsApiService();

taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.TASKS, negative: true }),
  'TC-FN-002–Verify that a user cannot create a task with invalid data',
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
    });  afterEach(async () => {
    if (createdTaskId) {
      await tasksService.delete_task(createdTaskId);
      console.log(`Task deleted: ${createdTaskId}`);
      createdTaskId = null;
    }
  });

  it('Create Task - Invalid Data (Empty Name)', async () => {
    const taskData = { name: "" };

    const promise = tasksService.create_task(listId, taskData);
    const error = await promise.catch(e => e);

    expect(error).toBeDefined();
    expect(error.response?.status).toBe(400);

    const errorResponse = error.response?.data;

    const validation = BaseSchemaValidator.validate(
      errorResponse,
      taskSchemas.errorResponseSchema,
      'Error Response'
    );
    expect(validation.isValid).toBe(true);
    expect(errorResponse).toHaveProperty("err");
    expect(errorResponse).toHaveProperty("ECODE");
    expect(errorResponse.err).toBe("Task name invalid");
    expect(errorResponse.ECODE).toBe("INPUT_005");
  });

  it('Create Task - Invalid Data (Null Name)', async () => {
    const taskData = { name: null };

    const promise = tasksService.create_task(listId, taskData);
    const error = await promise.catch(e => e);

    expect(error).toBeDefined();
    expect(error.response?.status).toBe(400);
    
    const errorResponse = error.response?.data;
    
    const validation = BaseSchemaValidator.validate(
      errorResponse,
      taskSchemas.errorResponseSchema,
      'Error Response'
    );
    expect(validation.isValid).toBe(true);

    expect(errorResponse).toHaveProperty("err");
    expect(errorResponse).toHaveProperty("ECODE");
    expect(errorResponse.err).toBe("Task name invalid");
    expect(errorResponse.ECODE).toBe("INPUT_005");
  });

  it('Create Task - Invalid Data (Missing Name)', async () => {
    const taskData = {};

    const promise = tasksService.create_task(listId, taskData);
    const error = await promise.catch(e => e);

    expect(error).toBeDefined();
    expect(error.response?.status).toBe(400);
    
    const errorResponse = error.response?.data;
    
    // Schema validation
    const validation = BaseSchemaValidator.validate(
      errorResponse,
      taskSchemas.errorResponseSchema,
      'Error Response'
    );
    expect(validation.isValid).toBe(true);

    expect(errorResponse).toHaveProperty("err");
    expect(errorResponse).toHaveProperty("ECODE");
    expect(errorResponse.err).toBe("Task name invalid");
    expect(errorResponse.ECODE).toBe("INPUT_005");
  });

  it('Create Task - Invalid Data (Very Long Name)', async () => {
    const taskData = { name: "a".repeat(1000) };

    const result = await tasksService.create_task(listId, taskData).catch(e => e);

    if (result && result.id) {
      const response = result;
      console.log('Task created with long name:', response.id);
      createdTaskId = response.id;
      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('name', taskData.name);
    } else {
      const error = result;
      expect(error.response?.status).toBe(400);
      
      const errorResponse = error.response?.data;
      
      // Schema validation
      const validation = BaseSchemaValidator.validate(
        errorResponse,
        taskSchemas.errorResponseSchema,
        'Error Response'
      );
      expect(validation.isValid).toBe(true);

      expect(errorResponse).toHaveProperty("err");
      expect(errorResponse).toHaveProperty("ECODE");
    }
  });

  it('Get Task - Verify Creation', async () => {
    const uniqueTaskName = `Task Test - Verify - ${Date.now()}`;
    const taskData = { name: uniqueTaskName };

    const createResponse = await tasksService.create_task(listId, taskData);
    createdTaskId = createResponse.id;

    console.log(`Task created for verification: ${uniqueTaskName} (ID: ${createdTaskId})`);

    const getResponse = await tasksService.get_task(createdTaskId);

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