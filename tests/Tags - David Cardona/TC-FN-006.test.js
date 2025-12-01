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
  buildTags({ funcionalidad: FUNCIONALIDADES.TAGS, negative: true }),
  "TC-FN-006 - Verify error handling when tag name is excessively long",
  () => {
    const createdTagNames = [];

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
      "POST - Excessively long name (10000 chars) should return error 400",
      async () => {
        const longTagName = "A".repeat(10000);

        const invalidTagData = {
          tag: {
            name: longTagName,
            tag_fg: "#FFFFFF",
            tag_bg: "#0000FF",
          },
        };

        Logger.info("Attempting to create tag with excessively long name", {
          spaceId: getSpaceId(),
          nameLength: longTagName.length,
        });

        const result = await tagsService.createTagResult(
          getSpaceId(),
          invalidTagData
        );

        expect(result.isError()).toBe(true);
        expect(result.isOk()).toBe(false);

        const errorResponse = result.axiosError.response;

        expect(errorResponse).toBeDefined();
        expect(errorResponse.status).toBe(400);
        expect(errorResponse.data).toBeDefined();
        expect(typeof errorResponse.data).toBe("object");

        const validation = BaseSchemaValidator.validate(
          errorResponse.data,
          tagSchemas.errorResponseSchema,
          "Error Response Schema"
        );
        expect(validation.isValid).toBe(true);

        if (!validation.isValid) {
          Logger.error("Schema validation failed", {
            errors: validation.errors,
          });
        }

        expect(errorResponse.data).toHaveProperty("err");
        expect(errorResponse.data).toHaveProperty("ECODE");

        Logger.info("Error response validated successfully", {
          errorMessage: errorResponse.data.err,
          errorCode: errorResponse.data.ECODE,
          status: errorResponse.status,
          nameLength: longTagName.length,
        });
      },
      20000
    );

    it(
      "GET - Verify tag with excessively long name was NOT created",
      async () => {
        const longTagName = "A".repeat(10000);

        Logger.info(
          "Fetching all tags to verify long-named tag was not created",
          {
            spaceId: getSpaceId(),
            searchingForNameLength: longTagName.length,
          }
        );

        const response = await tagsService.getTags(getSpaceId());

        expect(response).toHaveProperty("tags");
        expect(Array.isArray(response.tags)).toBe(true);

        Logger.info("Tags retrieved successfully", {
          tagCount: response.tags.length,
        });

        const validation = BaseSchemaValidator.validate(
          response,
          tagSchemas.tagsListResponseSchema,
          "Get Tags Schema"
        );
        expect(validation.isValid).toBe(true);

        if (!validation.isValid) {
          Logger.error("Schema validation failed", {
            errors: validation.errors,
          });
        }

        const longNameTag = response.tags.find((t) => t.name.length >= 10000);
        const exactTag = response.tags.find(
          (t) =>
            t.name.toLowerCase().trim() === longTagName.toLowerCase().trim()
        );

        expect(longNameTag).toBeUndefined();
        expect(exactTag).toBeUndefined();

        Logger.info("Verified that excessively long tag was not created", {
          longNameTagFound: longNameTag !== undefined,
          exactTagFound: exactTag !== undefined,
          maxTagNameLengthFound: Math.max(
            ...response.tags.map((t) => t.name.length)
          ),
        });
      },
      20000
    );
  }
);