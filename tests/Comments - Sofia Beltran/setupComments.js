import Logger from '../../core/logger.js';
import { setupClickUpEnvironment, getSpaceId, getTeamId } from '../setup.test.js';
import foldersService from '../../bussines/apiServices/foldersApiService.js';
import listsService from "../../bussines/apiServices/listsApiService.js";
import tasksService from "../../bussines/apiServices/tasksApiService.js";
import viewService from "../../bussines/apiServices/viewApiService.js";
import 'dotenv/config';

global.commentsTestResources = {};

beforeAll(async () => {
  Logger.info("Setting up global resources for comments tests...");
  await setupClickUpEnvironment();
  const spaceId = getSpaceId();
  const teamId = getTeamId();
  Logger.info("IDs obtained from global setup", { spaceId, teamId });
  await createCommentsTestResources(spaceId, teamId);
  Logger.info("Comments test setup completed", global.commentsTestResources);
}, 30000);

afterAll(async () => {
  Logger.info("Cleaning up global resources for comments tests...");
  await cleanupCommentsTestResources();
  await cleanupOrphanedFolders();
}, 30000);

/**
 * Create the necessary resources for testing comments
 */
async function createCommentsTestResources(spaceId, teamId) {
  // Create new folder
  Logger.info("Creating new folder");
  const folderBody = {
    name: `Comments Test Folder ${Date.now()}`
  };
  const folderResponse = await foldersService.createFolder(spaceId, folderBody);
  const folderId = folderResponse.id;
  Logger.info("Created new folder", { folderId });

  // Create new list INSIDE the folder
  Logger.info("Creating new list inside folder", { folderId });
  const listBody = {
    name: `Comments Test List ${Date.now()}`
  };
  const listResponse = await listsService.createListInFolder(folderId, listBody);
  const listId = listResponse.id;
  Logger.info("Created list inside folder", { listId });

  // create a new task in the list
  Logger.info("Creating new task", { listId });
  const taskBody = {
    name: `Comments Test Task ${Date.now()}`,
    description: "Task for testing comments API"
  };
  const taskResponse = await tasksService.createTask(listId, taskBody);
  const taskId = taskResponse.id;
  Logger.info("Created task", { taskId });

  // Get Views from the Team
  Logger.info("Getting team views", { teamId });
  const viewsResponse = await viewService.getView(teamId);
  let viewId = null;
  if (viewsResponse.views && viewsResponse.views.length > 0) {
    const chatView = viewsResponse.views.find(
      view => view.type === 'chat' || view.name.toLowerCase().includes('chat')
    );
    if (chatView) {
      viewId = chatView.id;
      Logger.info("Found chat view", { viewId, viewName: chatView.name });
    } else {
      viewId = viewsResponse.views[0].id;
      Logger.info("Using first available view", {
        viewId,
        viewName: viewsResponse.views[0].name,
        viewType: viewsResponse.views[0].type
      });
    }
  } else {
    Logger.warn("No views found for team", { teamId });
  }

  // Save global vars
  global.commentsTestResources = {
    spaceId,
    teamId,
    folderId,
    listId,
    taskId,
    viewId
  };

  Logger.info("Global comments test resources ready", global.commentsTestResources);
}

/**
 * Clean up resources created during testing
 */
async function cleanupCommentsTestResources() {
  const resources = global.commentsTestResources;

  // Delete task first (child of list)
  if (resources.taskId) {
    Logger.info("Deleting task", { taskId: resources.taskId });
    const deleteTaskResult = await tasksService.deleteTaskResult(resources.taskId);
    if (deleteTaskResult.isOk()) {
      Logger.info("Deleted task", { taskId: resources.taskId });
    } else {
      Logger.warn("Failed to delete task", { taskId: resources.taskId, error: deleteTaskResult.error });
    }
  }

  // Delete list second (child of folder)
  if (resources.listId) {
    Logger.info("Deleting list", { listId: resources.listId });
    const deleteListResult = await listsService.deleteListResult(resources.listId);
    if (deleteListResult.isOk()) {
      Logger.info("Deleted list", { listId: resources.listId });
    } else {
      Logger.warn("Failed to delete list", { listId: resources.listId, error: deleteListResult.error });
    }
  }

  // Delete folder last (parent)
  if (resources.folderId) {
    Logger.info("Deleting folder", { folderId: resources.folderId });
    const deleteFolderResult = await foldersService.deleteFolderResult(resources.folderId);
    if (deleteFolderResult.isOk()) {
      Logger.info("Deleted folder", { folderId: resources.folderId });
    } else {
      Logger.warn("Failed to delete folder", { folderId: resources.folderId, error: deleteFolderResult.error });
    }
  }

  Logger.info("Comments test resources cleanup completed");
}

/**
 * Limpia folders huérfanos de tests anteriores
 */
async function cleanupOrphanedFolders() {
  const spaceId = global.commentsTestResources?.spaceId;
  if (!spaceId) {
    Logger.warn("No spaceId available for orphaned folder cleanup");
    return;
  }

  Logger.info("Checking for orphaned test folders...", { spaceId });
  const foldersResult = await foldersService.getFoldersResult(spaceId);

  if (foldersResult.isError()) {
    Logger.error("Error getting folders for cleanup", { error: foldersResult.error });
    return;
  }

  const foldersResponse = foldersResult.value;
  if (!foldersResponse.folders || foldersResponse.folders.length === 0) {
    Logger.info("No folders found in space");
    return;
  }

  // Buscar folders que empiecen con "Comments Test Folder"
  const testFolders = foldersResponse.folders.filter(folder =>
    folder.name.startsWith('Comments Test Folder')
  );

  if (testFolders.length === 0) {
    Logger.info("No orphaned test folders found");
    return;
  }

  Logger.info(`Found ${testFolders.length} test folders to clean up`);

  for (const folder of testFolders) {
    Logger.info("Attempting to delete orphaned folder", {
      folderId: folder.id,
      folderName: folder.name
    });

    // Primero obtener y eliminar todas las listas del folder
    const listsResult = await listsService.getListsResult(folder.id);

    if (listsResult.isOk()) {
      const listsResponse = listsResult.value;
      if (listsResponse.lists && listsResponse.lists.length > 0) {
        Logger.info(`Found ${listsResponse.lists.length} lists in folder ${folder.id}`);

        for (const list of listsResponse.lists) {
          Logger.info("Deleting list from orphaned folder", {
            listId: list.id,
            listName: list.name
          });
          const deleteListResult = await listsService.deleteListResult(list.id);
          if (deleteListResult.isOk()) {
            Logger.info("Deleted list", { listId: list.id });
          } else {
            Logger.warn("Failed to delete list", {
              listId: list.id,
              error: deleteListResult.error
            });
          }
        }
      }
    } else {
      Logger.warn("Error getting lists from folder", {
        folderId: folder.id,
        error: listsResult.error
      });
    }

    // Ahora intentar eliminar el folder
    const deleteFolderResult = await foldersService.deleteFolderResult(folder.id);
    if (deleteFolderResult.isOk()) {
      Logger.info("Successfully deleted orphaned folder", {
        folderId: folder.id,
        folderName: folder.name
      });
    } else {
      Logger.warn("Failed to delete orphaned folder", {
        folderId: folder.id,
        folderName: folder.name,
        error: deleteFolderResult.error
      });
    }
  }

  Logger.info("Orphaned folder cleanup completed");
}

export { createCommentsTestResources, cleanupCommentsTestResources };