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
  buildTags({ funcionalidad: FUNCIONALIDADES.FOLDERS }),
  "TC-FR-005 - Verify that creating a folder with duplicate name produces consistent behavior",
  () => {
    const createdFolderIds = [];

    beforeAll(async () => {
      await setupClickUpEnvironment();
    });

    afterEach(async () => {
      for (const folderId of createdFolderIds) {
        const deleteResult = await foldersService.deleteFolderResult(folderId);
        result.fold(
          deleteResult,
          (error) => console.warn(`Cleanup failed for ${folderId}:`, error),
          () => console.log(`Cleaned up folder: ${folderId}`)
        );
      }
      createdFolderIds.length = 0;
    });

    it("Create Folder - First Instance", async () => {
      const response = await foldersService.createFolder(getSpaceId(), {
        name: "Duplicate Test Folder",
      });

      expect(response).toHaveProperty("id");
      expect(response).toHaveProperty("name");
      expect(response.name).toBe("Duplicate Test Folder");

      const validation = BaseSchemaValidator.validate(
        response,
        folderSchemas.folderResponseSchema,
        "Folder Response"
      );
      expect(validation.isValid).toBe(true);

      createdFolderIds.push(response.id);
    });

    it("Create Folder - Duplicate Name (Second Instance)", async () => {
      const firstResponse = await foldersService.createFolder(getSpaceId(), {
        name: "Duplicate Test Folder",
      });
      createdFolderIds.push(firstResponse.id);

      const secondResult = await foldersService.createFolderResult(
        getSpaceId(),
        {
          name: "Duplicate Test Folder",
        }
      );
      if (secondResult.isOk()) {
        const secondResponse = secondResult.value;
        expect(secondResponse).toHaveProperty("id");
        expect(secondResponse).toHaveProperty("name");
        expect(secondResponse.name).toBe("Duplicate Test Folder");
        expect(secondResponse.id).not.toBe(firstResponse.id);

        createdFolderIds.push(secondResponse.id);
      } else {
        const error = secondResult.axiosError;
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty("err");
      }
    });

    it("Get Folders - Verify Consistency", async () => {
      const firstResponse = await foldersService.createFolder(getSpaceId(), {
        name: "Duplicate Test Folder",
      });
      createdFolderIds.push(firstResponse.id);

      let secondCreated = false;
      const secondResult = await foldersService.createFolderResult(
        getSpaceId(),
        {
          name: "Duplicate Test Folder",
        }
      );
      if (secondResult.isOk()) {
        createdFolderIds.push(secondResult.value.id);
        secondCreated = true;
      } else {
        secondCreated = false;
      }

      const foldersResponse = await foldersService.getFolders(getSpaceId());
      expect(foldersResponse).toHaveProperty("folders");
      expect(Array.isArray(foldersResponse.folders)).toBe(true);

      const duplicateFolders = foldersResponse.folders.filter(
        (f) => f.name === "Duplicate Test Folder"
      );

      if (secondCreated) {
        expect(duplicateFolders.length).toBeGreaterThanOrEqual(2);
      } else {
        expect(duplicateFolders.length).toBe(1);
      }
    });

    it("Create Folder - Third Instance (Reliability Check)", async () => {
      const firstResponse = await foldersService.createFolder(getSpaceId(), {
        name: "Duplicate Test Folder",
      });
      createdFolderIds.push(firstResponse.id);

      let secondSucceeded = false;
      const secondResult = await foldersService.createFolderResult(
        getSpaceId(),
        {
          name: "Duplicate Test Folder",
        }
      );
      if (secondResult.isOk()) {
        createdFolderIds.push(secondResult.value.id);
        secondSucceeded = true;
      } else {
        secondSucceeded = false;
      }

      const thirdResult = await foldersService.createFolderResult(
        getSpaceId(),
        {
          name: "Duplicate Test Folder",
        }
      );
      if (thirdResult.isOk()) {
        expect(secondSucceeded).toBe(true);
        createdFolderIds.push(thirdResult.value.id);
      } else {
        expect(secondSucceeded).toBe(false);
        const error = thirdResult.axiosError;
        expect(error.response.status).toBe(400);
      }
    });
  }
);
