import "dotenv/config";
import foldersService from "../../bussines/apiServices/foldersApiService.js";
import BaseSchemaValidator from "../../bussines/schemaValidators/baseSchemaValidator.js";
import folderSchemas from "../../bussines/schemaValidators/folderSchemas.js";
import { setupClickUpEnvironment, getSpaceId } from "../setup.test.js";
import {
  taggedDescribe,
  buildTags,
  FUNCIONALIDADES,
} from "../../bussines/utils/tags.js";

taggedDescribe(
  buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.FOLDERS }),
  "TC-S-003 - Verify that folder creation endpoint requires valid authentication token",
  () => {
    beforeAll(async () => {
      await setupClickUpEnvironment();
    });

    it("Create Folder - No Auth Token", async () => {
      const createResult =
        await foldersService.createFolderWithCustomAuthResult(
          getSpaceId(),
          {
            name: "Test Folder",
          },
          null
        );
      expect(createResult.isError()).toBe(true);
      const error = createResult.axiosError;
      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty("err");

      const errorText = error.response.data.err.toLowerCase();
      expect(
        errorText.includes("token") ||
          errorText.includes("auth") ||
          errorText.includes("unauthorized")
      ).toBe(true);

      const validation = BaseSchemaValidator.validate(
        error.response.data,
        folderSchemas.errorResponseSchema,
        "Error Response"
      );
      expect(validation.isValid).toBe(true);
    });

    it("Create Folder - Invalid Token", async () => {
      const createResult =
        await foldersService.createFolderWithCustomAuthResult(
          getSpaceId(),
          {
            name: "Test Folder",
          },
          "Bearer invalid_token_12345_this_is_not_real"
        );
      expect(createResult.isError()).toBe(true);
      const error = createResult.axiosError;
      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty("err");

      const validation = BaseSchemaValidator.validate(
        error.response.data,
        folderSchemas.errorResponseSchema,
        "Error Response"
      );
      expect(validation.isValid).toBe(true);
    });

    it("Get Folders - No Auth Token", async () => {
      const getResult = await foldersService.getFoldersWithCustomAuthResult(
        getSpaceId(),
        null
      );
      expect(getResult.isError()).toBe(true);
      const error = getResult.axiosError;
      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty("err");

      const validation = BaseSchemaValidator.validate(
        error.response.data,
        folderSchemas.errorResponseSchema,
        "Error Response"
      );
      expect(validation.isValid).toBe(true);
    });

    it("Update Folder - No Auth Token", async () => {
      const updateResult =
        await foldersService.updateFolderWithCustomAuthResult(
          "901314763847",
          {
            name: "Updated Name",
          },
          null
        );
      expect(updateResult.isError()).toBe(true);
      const error = updateResult.axiosError;
      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty("err");

      const validation = BaseSchemaValidator.validate(
        error.response.data,
        folderSchemas.errorResponseSchema,
        "Error Response"
      );
      expect(validation.isValid).toBe(true);
    });
  }
);
