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
import result from "../../core/result.js";

taggedDescribe(
  buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.FOLDERS }),
  "TC-FP-006 - Verify that user can retrieve a specific folder by ID",
  () => {
    let createdFolderId;

    beforeAll(async () => {
      await setupClickUpEnvironment();
    });

    afterEach(async () => {
      if (createdFolderId) {
        const deleteResult = await foldersService.deleteFolderResult(
          createdFolderId
        );
        result.fold(
          deleteResult,
          (error) => console.warn("Cleanup failed:", error),
          () => console.log(`Folder deleted: ${createdFolderId}`)
        );
        createdFolderId = null;
      }
    });

    it("Get Folder by ID - Valid Folder", async () => {
      const uniqueFolderName = `Get Test Folder - ${Date.now()}`;
      const createResponse = await foldersService.createFolder(getSpaceId(), {
        name: uniqueFolderName,
      });
      createdFolderId = createResponse.id;

      console.log(
        `Folder created for retrieval test: ${uniqueFolderName} (ID: ${createdFolderId})`
      );

      const getResponse = await foldersService.getFolder(createdFolderId);

      expect(getResponse).toHaveProperty("id");
      expect(getResponse).toHaveProperty("name");
      expect(getResponse.id).toBe(createdFolderId);
      expect(getResponse.name).toBe(uniqueFolderName);

      const validation = BaseSchemaValidator.validate(
        getResponse,
        folderSchemas.folderResponseSchema,
        "Folder Response"
      );
      expect(validation.isValid).toBe(true);
    });
  }
);
