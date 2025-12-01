import "dotenv/config";
import tagsService from "../../bussines/apiServices/tagsApiService.js";
import BaseSchemaValidator from "../../bussines/schemaValidators/baseSchemaValidator.js";
import tagSchemas from "../../bussines/schemaValidators/tagSchemas.js";
import Logger from "../../core/logger.js";
import { setupClickUpEnvironment } from "../setup.test.js";
import {
  taggedDescribe,
  buildTags,
  FUNCIONALIDADES,
} from "../../bussines/utils/tags.js";

taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.TAGS, negative: true }),
  "TC-FN-008 - Verify error handling when updating tag with invalid Space ID",
  () => {
    const INVALID_SPACE_ID = "ab193081hcbag";

    beforeAll(async () => {
      await setupClickUpEnvironment();
    });

    it("PUT - Update tag with invalid Space ID should return error 400", async () => {
      const tagName = "TestTag";
      const updateData = {
        tag: {
          name: "UpdatedTag",
          tag_fg: "#000000",
          tag_bg: "#FFFFFF",
        },
      };

      Logger.info("Attempting to update tag with invalid Space ID", {
        invalidSpaceId: INVALID_SPACE_ID,
        tagName,
        updateData,
      });

      const result = await tagsService.updateTagResult(
        INVALID_SPACE_ID,
        tagName,
        updateData
      );

      expect(result.isError()).toBe(true);
      expect(result.isOk()).toBe(false);

      const errorResponse = result.axiosError.response;

      Logger.info("Received expected error response", {
        status: errorResponse?.status,
        errorCode: errorResponse?.data?.ECODE,
        errorMessage: errorResponse?.data?.err,
      });

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
      expect(errorResponse.data.err).toBe("Space ID invalid");
      expect(errorResponse.data).toHaveProperty("ECODE");
      expect(errorResponse.data.ECODE).toBe("INPUT_002");

      Logger.info("Invalid Space ID error validated successfully", {
        err: errorResponse.data.err,
        ECODE: errorResponse.data.ECODE,
        status: errorResponse.status,
      });
    }, 20000);

    it("DELETE - Delete tag with invalid Space ID should return error 400", async () => {
      const tagName = "TestTag";

      Logger.info("Attempting to delete tag with invalid Space ID", {
        invalidSpaceId: INVALID_SPACE_ID,
        tagName,
      });

      const result = await tagsService.deleteTagResult(
        INVALID_SPACE_ID,
        tagName
      );

      expect(result.isError()).toBe(true);
      expect(result.isOk()).toBe(false);

      const errorResponse = result.axiosError.response;

      Logger.info("Received expected error response", {
        status: errorResponse?.status,
        errorCode: errorResponse?.data?.ECODE,
        errorMessage: errorResponse?.data?.err,
      });

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
      expect(errorResponse.data.err).toBe("Space ID invalid");
      expect(errorResponse.data).toHaveProperty("ECODE");
      expect(errorResponse.data.ECODE).toBe("INPUT_002");

      Logger.info("Invalid Space ID error validated successfully", {
        err: errorResponse.data.err,
        ECODE: errorResponse.data.ECODE,
        status: errorResponse.status,
      });
    }, 20000);

    it("GET - Get tags with invalid Space ID should return error 400", async () => {
      Logger.info("Attempting to get tags with invalid Space ID", {
        invalidSpaceId: INVALID_SPACE_ID,
      });

      const result = await tagsService.getTagsResult(INVALID_SPACE_ID);

      expect(result.isError()).toBe(true);
      expect(result.isOk()).toBe(false);

      const errorResponse = result.axiosError.response;

      Logger.info("Received expected error response", {
        status: errorResponse?.status,
        errorCode: errorResponse?.data?.ECODE,
        errorMessage: errorResponse?.data?.err,
      });

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
      expect(errorResponse.data.err).toBe("Space ID invalid");
      expect(errorResponse.data).toHaveProperty("ECODE");
      expect(errorResponse.data.ECODE).toBe("INPUT_002");

      Logger.info("Invalid Space ID error validated successfully", {
        err: errorResponse.data.err,
        ECODE: errorResponse.data.ECODE,
        status: errorResponse.status,
      });
    }, 20000);
  }
);
