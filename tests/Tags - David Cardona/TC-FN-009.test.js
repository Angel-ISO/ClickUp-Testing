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
  "TC-FN-009 - Verify error handling when using unauthorized Space ID",
  () => {
    const unauthorizedSpaceId = "901311700631";

    beforeAll(async () => {
      await setupClickUpEnvironment();
    });

    it("POST - Unauthorized Space ID should return error 401 with OAUTH_023", async () => {
      const tagData = {
        tag: {
          name: "UnauthorizedTag",
          tag_fg: "#FFFFFF",
          tag_bg: "#FF5733",
        },
      };

      Logger.info(
        "Attempting to create tag with unauthorized Space ID (should fail)",
        {
          spaceId: unauthorizedSpaceId,
          tagName: tagData.tag.name,
        }
      );

      const result = await tagsService.createTagResult(
        unauthorizedSpaceId,
        tagData
      );

      expect(result.isError()).toBe(true);
      expect(result.isOk()).toBe(false);

      const errorResponse = result.axiosError.response;

      Logger.info("Received expected authorization error response", {
        status: errorResponse?.status,
        errorCode: errorResponse?.data?.ECODE,
        errorMessage: errorResponse?.data?.err,
      });

      expect(errorResponse).toBeDefined();
      expect(errorResponse.status).toBe(401);
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

      expect(errorResponse.data.err).toBe("Team(s) not authorized");
      expect(errorResponse.data.ECODE).toBe("OAUTH_023");

      Logger.info("Authorization error validated successfully", {
        errorMessage: errorResponse.data.err,
        errorCode: errorResponse.data.ECODE,
        status: errorResponse.status,
        spaceId: unauthorizedSpaceId,
      });
    }, 20000);

    it("GET - Verify tags cannot be retrieved from unauthorized Space", async () => {
      Logger.info(
        "Attempting to retrieve tags from unauthorized Space (should fail)",
        {
          spaceId: unauthorizedSpaceId,
        }
      );

      const result = await tagsService.getTagsResult(unauthorizedSpaceId);

      expect(result.isError()).toBe(true);
      expect(result.isOk()).toBe(false);

      const errorResponse = result.axiosError.response;

      expect(errorResponse).toBeDefined();
      expect(errorResponse.status).toBe(401);
      expect(errorResponse.data).toBeDefined();

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

      expect(errorResponse.data.err).toBe("Team(s) not authorized");
      expect(errorResponse.data.ECODE).toBe("OAUTH_023");

      Logger.info("GET request authorization error validated successfully", {
        errorMessage: errorResponse.data.err,
        errorCode: errorResponse.data.ECODE,
        status: errorResponse.status,
      });
    }, 20000);

    it("PUT - Verify tag update fails with unauthorized Space ID", async () => {
      const tagName = "TestTag";

      const updateData = {
        tag: {
          name: "UpdatedTag",
          tag_fg: "#000000",
          tag_bg: "#FFFFFF",
        },
      };

      Logger.info(
        "Attempting to update tag in unauthorized Space (should fail)",
        {
          spaceId: unauthorizedSpaceId,
          tagName,
        }
      );

      const result = await tagsService.updateTagResult(
        unauthorizedSpaceId,
        tagName,
        updateData
      );

      expect(result.isError()).toBe(true);
      expect(result.isOk()).toBe(false);

      const errorResponse = result.axiosError.response;

      expect(errorResponse).toBeDefined();
      expect(errorResponse.status).toBe(401);
      expect(errorResponse.data).toBeDefined();

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

      expect(errorResponse.data.err).toBe("Team(s) not authorized");
      expect(errorResponse.data.ECODE).toBe("OAUTH_023");

      Logger.info("PUT request authorization error validated successfully", {
        errorMessage: errorResponse.data.err,
        errorCode: errorResponse.data.ECODE,
        status: errorResponse.status,
      });
    }, 20000);

    it("DELETE - Verify tag deletion fails with unauthorized Space ID", async () => {
      const tagName = "TestTag";

      Logger.info(
        "Attempting to delete tag from unauthorized Space (should fail)",
        {
          spaceId: unauthorizedSpaceId,
          tagName,
        }
      );

      const result = await tagsService.deleteTagResult(
        unauthorizedSpaceId,
        tagName
      );

      expect(result.isError()).toBe(true);
      expect(result.isOk()).toBe(false);

      const errorResponse = result.axiosError.response;

      expect(errorResponse).toBeDefined();
      expect(errorResponse.status).toBe(401);
      expect(errorResponse.data).toBeDefined();

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

      expect(errorResponse.data.err).toBe("Team(s) not authorized");
      expect(errorResponse.data.ECODE).toBe("OAUTH_023");

      Logger.info("DELETE request authorization error validated successfully", {
        errorMessage: errorResponse.data.err,
        errorCode: errorResponse.data.ECODE,
        status: errorResponse.status,
      });
    }, 20000);
  }
);
