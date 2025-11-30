import "dotenv/config";
import tagsService from "../../bussines/apiServices/tagsApiService.js";
import BaseSchemaValidator from "../../bussines/schemaValidators/baseSchemaValidator.js";
import tagSchemas from "../../bussines/schemaValidators/tagSchemas.js";
import Logger from "../../core/logger.js";
import { setupClickUpEnvironment, getSpaceId } from "../setup.test.js";
import {
  taggedDescribe,
  buildTags,
  FUNCIONALIDADES,
} from "../../bussines/utils/tags.js";

taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.TAGS }),
  "TC-FP-001 - Verify successful creation of a new Space Tag",
  () => {
    const createdTagNames = [];

    beforeAll(async () => {
      await setupClickUpEnvironment();
    });

    afterEach(async () => {
      for (const tagName of createdTagNames) {
        try {
          await tagsService.deleteTag(getSpaceId(), tagName);
          Logger.info("Tag cleaned up successfully", { tagName });
        } catch (error) {
          Logger.warn("Cleanup failed for tag", {
            tagName,
            error: error.message,
          });
        }
      }
      createdTagNames.length = 0;
    });

    it("Create Tag - Valid Data", async () => {
      const tagData = {
        tag: {
          name: "David",
          tag_fg: "#FFFFFF",
          tag_bg: "#0000FF",
        },
      };

      Logger.info("Creating tag with valid data", {
        tagName: tagData.tag.name,
        spaceId: getSpaceId(),
      });

      const response = await tagsService.createTag(getSpaceId(), tagData);

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
        Logger.error("Schema validation failed", { errors: validation.errors });
      }

      Logger.info("Tag created successfully", { tagName: tagData.tag.name });
      createdTagNames.push(tagData.tag.name);
    });

    it("Get Tags - Verify Creation", async () => {
      const tagData = {
        tag: {
          name: "David",
          tag_fg: "#FFFFFF",
          tag_bg: "#0000FF",
        },
      };

      Logger.info("Creating tag for verification test", {
        tagName: tagData.tag.name,
      });

      await tagsService.createTag(getSpaceId(), tagData);
      createdTagNames.push(tagData.tag.name);

      Logger.info("Retrieving all tags to verify creation", {
        spaceId: getSpaceId(),
      });

      const response = await tagsService.getTags(getSpaceId());

      expect(response).toHaveProperty("tags");
      expect(Array.isArray(response.tags)).toBe(true);

      const validation = BaseSchemaValidator.validate(
        response,
        tagSchemas.tagsListResponseSchema,
        "Get Tags Response"
      );
      expect(validation.isValid).toBe(true);

      if (!validation.isValid) {
        Logger.error("Schema validation failed", { errors: validation.errors });
      }

      const normalizedTagName = tagData.tag.name.toLowerCase().trim();
      const tag = response.tags.find(
        (t) => t.name.toLowerCase().trim() === normalizedTagName
      );

      expect(tag).toBeDefined();
      expect(tag).toHaveProperty("name");
      expect(tag).toHaveProperty("tag_fg");
      expect(tag).toHaveProperty("tag_bg");
      expect(tag).toHaveProperty("creator");
      expect(tag).toHaveProperty("project_id");

      Logger.info("Tag verified in tags list", {
        tagName: tag.name,
        tagCount: response.tags.length,
      });
    });

    it("Delete Tag - Verify Deletion", async () => {
      const tagData = {
        tag: {
          name: "David",
          tag_fg: "#FFFFFF",
          tag_bg: "#0000FF",
        },
      };

      Logger.info("Creating tag for deletion test", {
        tagName: tagData.tag.name,
      });

      await tagsService.createTag(getSpaceId(), tagData);
      createdTagNames.push(tagData.tag.name);

      Logger.info("Deleting tag", { tagName: tagData.tag.name });

      const deleteResponse = await tagsService.deleteTag(
        getSpaceId(),
        tagData.tag.name
      );

      expect(deleteResponse).toBeDefined();
      expect(typeof deleteResponse).toBe("object");
      expect(deleteResponse).toEqual({});

      const validation = BaseSchemaValidator.validate(
        deleteResponse,
        tagSchemas.emptyBodyResponseSchema,
        "Delete Tag Response"
      );
      expect(validation.isValid).toBe(true);

      if (!validation.isValid) {
        Logger.error("Schema validation failed", { errors: validation.errors });
      }

      Logger.info("Verifying tag was deleted", { tagName: tagData.tag.name });

      const getResponse = await tagsService.getTags(getSpaceId());

      const normalizedTagName = tagData.tag.name.toLowerCase().trim();
      const tagExists = getResponse.tags.some(
        (t) => t.name.toLowerCase().trim() === normalizedTagName
      );

      expect(tagExists).toBe(false);

      Logger.info("Tag deletion verified", {
        tagName: tagData.tag.name,
        tagExists,
      });

      const index = createdTagNames.indexOf(tagData.tag.name);
      if (index > -1) {
        createdTagNames.splice(index, 1);
      }
    });
  }
);
