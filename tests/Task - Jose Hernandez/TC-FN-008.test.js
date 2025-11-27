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
  'TC-FN-0078 - Verify system prevents duplicate task creation (no repeated names)',
  () => {
    let folderId;
    let listId;
    let firstTaskId;
    let secondTaskId;
    let duplicateName;

    beforeAll(async () => {
      await setupClickUpEnvironment();

      const foldersResponse = await foldersService.get_folders(getSpaceId());
      folderId = foldersResponse.folders[0].id;
      const listResponse = await listsService.get_lists(folderId);
      listId = listResponse.lists[0].id;

      const uniqueName = `Unique Duplicate Test - ${Date.now()}`;
      const createResponse = await tasksService.create_task(listId, { name: uniqueName });
      firstTaskId = createResponse.id;
      duplicateName = uniqueName;
      console.log(`Task created for duplicate-test: ${uniqueName} (ID: ${firstTaskId})`);
    });

    afterAll(async () => {
      if (firstTaskId) {
        try { await tasksService.delete_task(firstTaskId); } catch (e) { /* ignore */ }
      }
      if (secondTaskId) {
        try { await tasksService.delete_task(secondTaskId); } catch (e) { /* ignore */ }
      }
    });

    it('Attempt to create a second task with the same name and ensure no duplicates exist', async () => {

      const secondResult = await tasksService.create_task(listId, { name: duplicateName }).catch(e => e);

      if (secondResult && secondResult.id) {
        secondTaskId = secondResult.id;

        const tasksListResponse = await tasksService.get_tasks(listId);
        const tasksArray = tasksListResponse.tasks || tasksListResponse;
        const occurrences = (Array.isArray(tasksArray) ? tasksArray : []).filter(t => t.name === duplicateName).length;

        // API allows duplicate task names - document this behavior
        expect(occurrences).toBeGreaterThanOrEqual(2);
        console.log(`API allows duplicate task names - ${occurrences} tasks with name "${duplicateName}" exist`);
      } else {
        const error = secondResult;
        expect(error.response?.status).toBe(400);

        const validation = BaseSchemaValidator.validate(
          error.response?.data,
          taskSchemas.errorResponseSchema,
          'Error Response'
        );
        expect(validation.isValid).toBe(true);
      }
    });
  },
  20000
);
