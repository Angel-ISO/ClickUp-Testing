import 'dotenv/config';
import foldersService from '../../bussines/apiServices/foldersApiService.js';
import listsService from "../../bussines/apiServices/listsApiService.js";
import tasksService from "../../bussines/apiServices/tasksApiService.js";
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import taskSchemas from '../../bussines/schemaValidators/taskSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';

describe('TC-FP-004 - Verify that two or more related tasks can be merged into a single task', () => {
  let folderId;
  let listId;
  let createdTaskIds = [];

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
    for (const taskId of createdTaskIds) {
      try {
        await tasksService.delete_task(taskId);
        console.log(`Task deleted: ${taskId}`);
      } catch (error) {
        console.log(`Error deleting task ${taskId}:`, error.message);
      }
    }
    createdTaskIds = [];
  });

  it('Merge Tasks - Combine Three Tasks into One', async () => {
    // Create three tasks to merge
    const task1Name = `Task 1 - Merge Test - ${Date.now()}`;
    const task2Name = `Task 2 - Merge Test - ${Date.now()}`;
    const task3Name = `Task 3 - Merge Test - ${Date.now()}`;
    
    const task1Description = `Description for task 1 - ${Date.now()}`;
    const task2Description = `Description for task 2 - ${Date.now()}`;
    const task3Description = `Description for task 3 - ${Date.now()}`;

    const task1Data = { 
      name: task1Name,
      description: task1Description
    };
    const task1Response = await tasksService.create_task(listId, task1Data);
    const mainTaskId = task1Response.id;
    createdTaskIds.push(mainTaskId);

    console.log(`Main task created: ${task1Name} (ID: ${mainTaskId})`);


    const task2Data = { 
      name: task2Name,
      description: task2Description
    };
    const task2Response = await tasksService.create_task(listId, task2Data);
    const task2Id = task2Response.id;

    console.log(`Second task created: ${task2Name} (ID: ${task2Id})`);


    const task3Data = { 
      name: task3Name,
      description: task3Description
    };
    const task3Response = await tasksService.create_task(listId, task3Data);
    const task3Id = task3Response.id;

    console.log(`Third task created: ${task3Name} (ID: ${task3Id})`);

    // Merge tasks
    const mergeData = {
      source_task_ids: [task2Id, task3Id]
    };


    const mergeResponse = await tasksService.merge_tasks(mainTaskId, mergeData);
    console.log('Merge response:', mergeResponse);

    console.log(`Tasks merged successfully: ${task2Id} and ${task3Id} into ${mainTaskId}`);

   
    const getResponse = await tasksService.get_task(mainTaskId);


    const validation = BaseSchemaValidator.validate(
      getResponse,
      taskSchemas.taskResponseSchema,
      'Merged Task Response'
    );
    expect(validation.isValid).toBe(true);


    const expectedDescription = `${task1Description}\n\n${task2Description}\n\n${task3Description}`;
    expect(getResponse).toHaveProperty('description', expectedDescription);

    expect(getResponse).toHaveProperty('id', mainTaskId);
    expect(getResponse).toHaveProperty('name', task1Name);
    expect(getResponse).toHaveProperty('status');
    expect(getResponse.status).toHaveProperty('status');
    expect(getResponse.status).toHaveProperty('color');
    expect(getResponse.status).toHaveProperty('type');

    console.log(`Merge verified - Description contains all three task descriptions`);
  });

  it('Merge Tasks - Verify Source Tasks Are Deleted', async () => {

    const mainTaskName = `Main Task - Delete Test - ${Date.now()}`;
    const sourceTaskName = `Source Task - Delete Test - ${Date.now()}`;
    
    const mainTaskDescription = `Main task description - ${Date.now()}`;
    const sourceTaskDescription = `Source task description - ${Date.now()}`;


    const mainTaskData = { 
      name: mainTaskName,
      description: mainTaskDescription
    };
    const mainTaskResponse = await tasksService.create_task(listId, mainTaskData);
    const mainTaskId = mainTaskResponse.id;
    createdTaskIds.push(mainTaskId);

    const sourceTaskData = { 
      name: sourceTaskName,
      description: sourceTaskDescription
    };
    const sourceTaskResponse = await tasksService.create_task(listId, sourceTaskData);
    const sourceTaskId = sourceTaskResponse.id;

    console.log(`Tasks created for delete test`);

    // Merge tasks
    const mergeData = {
      source_task_ids: [sourceTaskId]
    };

    const mergeResponse = await tasksService.merge_tasks(mainTaskId, mergeData);

    try {
      await tasksService.get_task(sourceTaskId);

      throw new Error(`Source task ${sourceTaskId} should have been deleted but still exists`);
    } catch (error) {

      console.log(`Source task ${sourceTaskId} was successfully deleted after merge`);
    }


    const getResponse = await tasksService.get_task(mainTaskId);
    const expectedDescription = `${mainTaskDescription}\n\n${sourceTaskDescription}`;
    expect(getResponse).toHaveProperty('description', expectedDescription);

    console.log(`Merge delete verification completed successfully`);
  });

  it('Merge Tasks - Single Source Task Combination', async () => {
    // Create two tasks to merge
    const mainTaskName = `Main Task - Single Merge - ${Date.now()}`;
    const sourceTaskName = `Source Task - Single Merge - ${Date.now()}`;
    
    const mainTaskDescription = `Main task description - ${Date.now()}`;
    const sourceTaskDescription = `Source task description - ${Date.now()}`;

  
    const mainTaskData = { 
      name: mainTaskName,
      description: mainTaskDescription
    };
    const mainTaskResponse = await tasksService.create_task(listId, mainTaskData);
    const mainTaskId = mainTaskResponse.id;
    createdTaskIds.push(mainTaskId);

    const sourceTaskData = { 
      name: sourceTaskName,
      description: sourceTaskDescription
    };
    const sourceTaskResponse = await tasksService.create_task(listId, sourceTaskData);
    const sourceTaskId = sourceTaskResponse.id;

    console.log(`Tasks created for single merge test`);

    //Merge tasks
    const mergeData = {
      source_task_ids: [sourceTaskId]
    };

    const mergeResponse = await tasksService.merge_tasks(mainTaskId, mergeData);

    const getResponse = await tasksService.get_task(mainTaskId);

    const validation = BaseSchemaValidator.validate(
      getResponse,
      taskSchemas.taskResponseSchema,
      'Single Merge Task Response'
    );
    expect(validation.isValid).toBe(true);

    const expectedDescription = `${mainTaskDescription}\n\n${sourceTaskDescription}`;
    expect(getResponse).toHaveProperty('description', expectedDescription);
    expect(getResponse).toHaveProperty('name', mainTaskName);

    console.log(`Single merge verified successfully`);
  });
});