import "dotenv/config";
import tagsService from "../../bussines/apiServices/tagsApiService.js";
import tasksService from "../../bussines/apiServices/tasksApiService.js";
import BaseSchemaValidator from "../../bussines/schemaValidators/baseSchemaValidator.js";
import tagSchemas from "../../bussines/schemaValidators/tagSchemas.js";
import Logger from "../../core/logger.js";
import { setupClickUpEnvironment, getSpaceId } from "../setup.test.js";
import createRequestManager from "../../core/requestManager.js";
import {
  taggedDescribe,
  buildTags,
  FUNCIONALIDADES,
} from "../../bussines/utils/tags.js";

taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.TAGS }),
  "TC-FP-003 - Verify successful addition of Tag to a Task",
  () => {
    const createdTagNames = [];
    const createdTaskIds = [];
    let testTagName;
    let testListId;

    beforeAll(async () => {
      await setupClickUpEnvironment();
      const requestManager = createRequestManager();
      const listsResult = await requestManager.get(
        `/space/${getSpaceId()}/list`
      );

      if (listsResult.success && listsResult.value.lists?.length > 0) {
        testListId = listsResult.value.lists[0].id;
        Logger.info("Using existing list for tests", { listId: testListId });
      } else {
        throw new Error("No lists found in space");
      }
    });

    afterEach(async () => {
      for (const taskId of createdTaskIds) {
        const deleteResult = await tasksService.deleteTaskResult(taskId);

        if (deleteResult.isOk()) {
          Logger.info("Task cleaned up successfully", { taskId });
        } else {
          Logger.warn("Cleanup failed for task", {
            taskId,
            error: deleteResult.error,
          });
        }
      }
      createdTaskIds.length = 0;

      for (const tagName of createdTagNames) {
        const deleteResult = await tagsService.deleteTagResult(
          getSpaceId(),
          tagName
        );

        if (deleteResult.isOk()) {
          Logger.info("Tag cleaned up successfully", { tagName });
        } else {
          Logger.warn("Cleanup failed for tag", {
            tagName,
            error: deleteResult.error,
          });
        }
      }
      createdTagNames.length = 0;
      testTagName = null;
    });

    it("POST - Create Tag for Task test", async () => {
      const tagData = {
        tag: {
          name: `TagToTaskTest_${Date.now()}`,
          tag_fg: "#FFFFFF",
          tag_bg: "#FF5733",
        },
      };

      Logger.info("Creating tag for task association test", {
        spaceId: getSpaceId(),
        tagName: tagData.tag.name,
      });

      const result = await tagsService.createTagResult(getSpaceId(), tagData);

      expect(result.isOk()).toBe(true);
      expect(result.isError()).toBe(false);

      const response = result.value;

      expect(response).toBeDefined();
      expect(typeof response).toBe("object");
      expect(response).toEqual({});
      expect(Object.keys(response).length).toBe(0);

      const validation = BaseSchemaValidator.validate(
        response,
        tagSchemas.emptyBodyResponseSchema,
        "Create Tag Response"
      );
      expect(validation.isValid).toBe(true);

      if (!validation.isValid) {
        Logger.error("Schema validation failed", {
          errors: validation.errors,
        });
      }

      Logger.info("Tag created successfully", {
        tagName: tagData.tag.name,
      });

      testTagName = tagData.tag.name;
      createdTagNames.push(tagData.tag.name);
    }, 20000);

    it("GET - Verify Tag exists in Space", async () => {
      const tagData = {
        tag: {
          name: "TaskTag",
          tag_fg: "#FFFFFF",
          tag_bg: "#FF5733",
        },
      };

      const createResult = await tagsService.createTagResult(
        getSpaceId(),
        tagData
      );
      expect(createResult.isOk()).toBe(true);

      testTagName = tagData.tag.name;
      createdTagNames.push(tagData.tag.name);

      Logger.info("Retrieving tags to verify tag exists", {
        spaceId: getSpaceId(),
        tagName: testTagName,
      });

      const getResult = await tagsService.getTagsResult(getSpaceId());

      expect(getResult.isOk()).toBe(true);
      expect(getResult.isError()).toBe(false);

      const response = getResult.value;

      expect(response).toHaveProperty("tags");
      expect(Array.isArray(response.tags)).toBe(true);

      const validation = BaseSchemaValidator.validate(
        response,
        tagSchemas.tagsListResponseSchema,
        "Get Tags Response"
      );
      expect(validation.isValid).toBe(true);

      if (!validation.isValid) {
        Logger.error("Schema validation failed", {
          errors: validation.errors,
        });
      }

      const normalizedTagName = testTagName.toLowerCase().trim();
      const verifyTagExists = response.tags.some(
        (tag) => tag.name.toLowerCase().trim() === normalizedTagName
      );

      expect(verifyTagExists).toBe(true);

      Logger.info("Tag verified in space", {
        tagName: testTagName,
        exists: verifyTagExists,
      });
    }, 20000);

    it("POST - Create Task and Add Tag", async () => {
      const tagData = {
        tag: {
          name: "TaskTagForAddTest",
          tag_fg: "#FFFFFF",
          tag_bg: "#FF5733",
        },
      };

      Logger.info("Creating tag for add test", { tagName: tagData.tag.name });
      const createTagResult = await tagsService.createTagResult(
        getSpaceId(),
        tagData
      );
      expect(createTagResult.isOk()).toBe(true);
      testTagName = tagData.tag.name;

      Logger.info("Verifying tag was created");
      const getTagsResult = await tagsService.getTagsResult(getSpaceId());
      expect(getTagsResult.isOk()).toBe(true);

      const tagsResponse = getTagsResult.value;
      const tagExists = tagsResponse.tags.some(
        (t) => t.name.toLowerCase() === testTagName.toLowerCase()
      );
      expect(tagExists).toBe(true);

      Logger.info("Tag created and verified", { tagName: testTagName });

      const taskData = {
        name: "Test Task for Tag",
        description: "Task created to test tag association",
      };

      Logger.info("Creating task for tag association", {
        listId: testListId,
        taskName: taskData.name,
      });

      const createTaskResult = await tasksService.createTaskResult(
        testListId,
        taskData
      );
      expect(createTaskResult.isOk()).toBe(true);

      const taskResponse = createTaskResult.value;
      const taskId = taskResponse.id;
      createdTaskIds.push(taskId);

      Logger.info("Task created successfully", {
        taskId,
        taskName: taskResponse.name,
      });

      Logger.info("Adding tag to task", {
        taskId,
        tagName: testTagName,
        tagNameEncoded: encodeURIComponent(testTagName),
      });

      const addTagResult = await tagsService.addTagToTaskResult(
        taskId,
        testTagName
      );

      expect(addTagResult.isOk()).toBe(true);
      expect(addTagResult.isError()).toBe(false);

      const response = addTagResult.value;

      expect(response).toBeDefined();
      expect(typeof response).toBe("object");
      expect(response).toEqual({});

      const validation = BaseSchemaValidator.validate(
        response,
        tagSchemas.emptyBodyResponseSchema,
        "Add Tag to Task Response"
      );
      expect(validation.isValid).toBe(true);

      if (!validation.isValid) {
        Logger.error("Schema validation failed", {
          errors: validation.errors,
        });
      }

      Logger.info("Tag added to task successfully", {
        taskId,
        tagName: testTagName,
      });

      createdTagNames.push(tagData.tag.name);
    }, 20000);

    it("GET - Verify Tag exists in Task", async () => {
      const tagData = {
        tag: {
          name: "TaskTagForGetTest",
          tag_fg: "#FFFFFF",
          tag_bg: "#FF5733",
        },
      };

      const createTagResult = await tagsService.createTagResult(
        getSpaceId(),
        tagData
      );
      expect(createTagResult.isOk()).toBe(true);
      testTagName = tagData.tag.name;

      const taskData = {
        name: "Test Task for Tag",
        description: "Task created to test tag association",
      };
      const createTaskResult = await tasksService.createTaskResult(
        testListId,
        taskData
      );
      expect(createTaskResult.isOk()).toBe(true);

      const taskResponse = createTaskResult.value;
      const taskId = taskResponse.id;
      createdTaskIds.push(taskId);

      const addTagResult = await tagsService.addTagToTaskResult(
        taskId,
        testTagName
      );
      expect(addTagResult.isOk()).toBe(true);

      Logger.info("Retrieving task to verify tag exists", {
        taskId,
        expectedTag: testTagName,
      });

      const getTaskResult = await tasksService.getTaskResult(taskId);

      expect(getTaskResult.isOk()).toBe(true);
      expect(getTaskResult.isError()).toBe(false);

      const response = getTaskResult.value;

      expect(response).toBeDefined();
      expect(response).toHaveProperty("id");
      expect(response).toHaveProperty("tags");
      expect(Array.isArray(response.tags)).toBe(true);

      const validation = BaseSchemaValidator.validate(
        response,
        tagSchemas.taskResponseSchema,
        "Get Task Response"
      );
      expect(validation.isValid).toBe(true);

      if (!validation.isValid) {
        Logger.error("Schema validation failed", {
          errors: validation.errors,
        });
      }

      const normalizedTagName = testTagName.toLowerCase();
      const tagInTask = response.tags.find(
        (tag) => tag.name.toLowerCase() === normalizedTagName
      );

      expect(tagInTask).toBeDefined();
      expect(tagInTask).toHaveProperty("name");
      expect(tagInTask).toHaveProperty("tag_fg");
      expect(tagInTask).toHaveProperty("tag_bg");

      Logger.info("Tag verified in task", {
        taskId,
        tagName: tagInTask.name,
        tag_fg: tagInTask.tag_fg,
        tag_bg: tagInTask.tag_bg,
      });
      createdTagNames.push(tagData.tag.name);
    }, 20000);
  }
);
