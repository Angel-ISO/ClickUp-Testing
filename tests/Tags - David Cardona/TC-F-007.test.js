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
  buildTags({ funcionalidad: FUNCIONALIDADES.TAGS, smoke: true }),
  "TC-SMOKE-004 - Verify multiple tags can be created and managed",
  () => {
    const createdTagNames = [];
    const testTags = [
      {
        name: "SmokeTag1",
        tag_fg: "#FFFFFF",
        tag_bg: "#FF0000",
      },
      {
        name: "SmokeTag2",
        tag_fg: "#000000",
        tag_bg: "#00FF00",
      },
      {
        name: "SmokeTag3",
        tag_fg: "#FFFFFF",
        tag_bg: "#0000FF",
      },
    ];

    beforeAll(async () => {
      await setupClickUpEnvironment();
    });

    afterEach(async () => {
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
    });

    it(
      "POST - Create multiple tags successfully",
      async () => {
        Logger.info("Creating multiple tags", {
          spaceId: getSpaceId(),
          tagCount: testTags.length,
          tagNames: testTags.map((t) => t.name),
        });

        for (const tagData of testTags) {
          const result = await tagsService.createTagResult(getSpaceId(), {
            tag: tagData,
          });

          expect(result.isOk()).toBe(true);
          expect(result.isError()).toBe(false);

          const response = result.value;

          expect(response).toBeDefined();
          expect(typeof response).toBe("object");
          expect(response).toEqual({});

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
            tagName: tagData.name,
            tag_fg: tagData.tag_fg,
            tag_bg: tagData.tag_bg,
          });

          createdTagNames.push(tagData.name);
        }

        expect(createdTagNames.length).toBe(testTags.length);

        Logger.info("All tags created successfully", {
          totalCreated: createdTagNames.length,
          tagNames: createdTagNames,
        });
      },
      20000
    );

    it(
      "GET - Verify all 3 tags exist",
      async () => {
        for (const tagData of testTags) {
          await tagsService.createTag(getSpaceId(), { tag: tagData });
          createdTagNames.push(tagData.name);
        }

        Logger.info("Retrieving all tags to verify multiple tags exist", {
          spaceId: getSpaceId(),
          expectedTags: testTags.map((t) => t.name),
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
          Logger.error("Schema validation failed", {
            errors: validation.errors,
          });
        }

        Logger.info("Tags retrieved successfully", {
          totalTags: response.tags.length,
        });

        const foundTags = [];
        for (const testTag of testTags) {
          const normalizedTagName = testTag.name.toLowerCase().trim();
          const tag = response.tags.find(
            (t) => t.name.toLowerCase().trim() === normalizedTagName
          );

          expect(tag).toBeDefined();
          expect(tag).toHaveProperty("name");
          expect(tag).toHaveProperty("tag_fg");
          expect(tag).toHaveProperty("tag_bg");
          expect(tag.tag_fg.toUpperCase()).toBe(testTag.tag_fg.toUpperCase());
          expect(tag.tag_bg.toUpperCase()).toBe(testTag.tag_bg.toUpperCase());

          foundTags.push(tag.name);

          Logger.info("Tag verified in tags list", {
            tagName: tag.name,
            tag_fg: tag.tag_fg,
            tag_bg: tag.tag_bg,
          });
        }

        expect(foundTags.length).toBe(testTags.length);

        Logger.info("All tags verified successfully", {
          verifiedTags: foundTags,
          expectedCount: testTags.length,
          actualCount: foundTags.length,
        });
      },
      20000
    );

    it(
      "DELETE - Remove all 3 tags successfully",
      async () => {
        for (const tagData of testTags) {
          await tagsService.createTag(getSpaceId(), { tag: tagData });
          createdTagNames.push(tagData.name);
        }

        Logger.info("Deleting all created tags", {
          spaceId: getSpaceId(),
          tagsToDelete: createdTagNames,
        });

        const deletedTags = [];

        for (const tagName of [...createdTagNames]) {
          const result = await tagsService.deleteTagResult(
            getSpaceId(),
            tagName
          );

          expect(result.isOk()).toBe(true);
          expect(result.isError()).toBe(false);

          const response = result.value;

          expect(response).toBeDefined();
          expect(typeof response).toBe("object");
          expect(response).toEqual({});

          const validation = BaseSchemaValidator.validate(
            response,
            tagSchemas.emptyBodyResponseSchema,
            "Delete Tag Response"
          );
          expect(validation.isValid).toBe(true);

          if (!validation.isValid) {
            Logger.error("Schema validation failed", {
              errors: validation.errors,
            });
          }

          Logger.info("Tag deleted successfully", { tagName });

          deletedTags.push(tagName);
          const index = createdTagNames.indexOf(tagName);
          if (index > -1) {
            createdTagNames.splice(index, 1);
          }
        }

        expect(deletedTags.length).toBe(testTags.length);
        expect(createdTagNames.length).toBe(0);

        Logger.info("All tags deleted successfully", {
          deletedCount: deletedTags.length,
          deletedTags: deletedTags,
        });
      },
      20000
    );

    it(
      "GET - Verify all 3 tags were deleted",
      async () => {
        for (const tagData of testTags) {
          await tagsService.createTag(getSpaceId(), { tag: tagData });
          createdTagNames.push(tagData.name);
        }
        for (const tagName of [...createdTagNames]) {
          await tagsService.deleteTag(getSpaceId(), tagName);
          const index = createdTagNames.indexOf(tagName);
          if (index > -1) {
            createdTagNames.splice(index, 1);
          }
        }

        Logger.info("Verifying all tags were deleted", {
          spaceId: getSpaceId(),
          tagsToVerify: testTags.map((t) => t.name),
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
          Logger.error("Schema validation failed", {
            errors: validation.errors,
          });
        }

        Logger.info("Tags retrieved for deletion verification", {
          totalTags: response.tags.length,
        });


        for (const testTag of testTags) {
          const normalizedTagName = testTag.name.toLowerCase().trim();
          const tagExists = response.tags.some(
            (t) => t.name.toLowerCase().trim() === normalizedTagName
          );

          expect(tagExists).toBe(false);

          Logger.info("Verified tag does not exist", {
            tagName: testTag.name,
            exists: tagExists,
          });
        }

        Logger.info("All tags deletion verified successfully", {
          verifiedTags: testTags.map((t) => t.name),
          allDeleted: true,
        });
      },
      20000
    );
  }
);