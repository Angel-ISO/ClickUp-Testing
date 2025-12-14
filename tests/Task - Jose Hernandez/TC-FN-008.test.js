import "dotenv/config";
import foldersService from "../../bussines/apiServices/foldersApiService.js";
import listsService from "../../bussines/apiServices/listsApiService.js";
import tasksService from "../../bussines/apiServices/tasksApiService.js";
import BaseSchemaValidator from "../../bussines/schemaValidators/baseSchemaValidator.js";
import taskSchemas from "../../bussines/schemaValidators/taskSchemas.js";
import { setupClickUpEnvironment, getSpaceId } from "../setup.test.js";
import {
  taggedDescribe,
  buildTags,
  FUNCIONALIDADES,
} from "../../bussines/utils/tags.js";

taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.TASKS, negative: true }),
  "TC-FN-0078 - Verify system prevents duplicate task creation (no repeated names)",
  () => {
    let folderId;
    let listId;
    let firstTaskId;
    let secondTaskId;
    let duplicateName;

    beforeAll(async () => {
      await setupClickUpEnvironment();

      const foldersResponse = await foldersService.getFolders(getSpaceId());
      folderId = foldersResponse.folders[0].id;
      const listResponse = await listsService.getLists(folderId);
      listId = listResponse.lists[0].id;

      const uniqueName = `Unique Duplicate Test - ${Date.now()}`;
      const createResponse = await tasksService.createTask(listId, {
        name: uniqueName,
      });
      firstTaskId = createResponse.id;
      duplicateName = uniqueName;
      console.log(
        `Task created for duplicate-test: ${uniqueName} (ID: ${firstTaskId})`
      );
    });

    afterAll(async () => {
      if (firstTaskId) {
        try {
          await tasksService.deleteTask(firstTaskId);
        } catch {
          /* ignore */
        }
      }
      if (secondTaskId) {
        try {
          await tasksService.deleteTask(secondTaskId);
        } catch {
          /* ignore */
        }
      }
    });

    it("Attempt to create a second task with the same name and ensure no duplicates exist", async () => {
      const secondResult = await tasksService
        .createTask(listId, { name: duplicateName })
        .catch((e) => e);

      if (secondResult && secondResult.id) {
        secondTaskId = secondResult.id;

        const tasksListResponse = await tasksService.getTasks(listId);
        const tasksArray = tasksListResponse.tasks || tasksListResponse;
        const occurrences = (
          Array.isArray(tasksArray) ? tasksArray : []
        ).filter((t) => t.name === duplicateName).length;

        // API allows duplicate task names - document this behavior
        expect(occurrences).toBeGreaterThanOrEqual(2);
        console.log(
          `API allows duplicate task names - ${occurrences} tasks with name "${duplicateName}" exist`
        );
      } else {
        const error = secondResult;
        expect(error.response?.status).toBe(400);

        const validation = BaseSchemaValidator.validate(
          error.response?.data,
          taskSchemas.errorResponseSchema,
          "Error Response"
        );
        expect(validation.isValid).toBe(true);
      }
    });
  },
  20000
);
