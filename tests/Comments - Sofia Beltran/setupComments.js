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
}, 30000);

/**
 * Create the necessary resources for testing comments
 */
async function createCommentsTestResources(spaceId, teamId) {
  // get or create folder
  let folderId;
  Logger.info("Getting folders from space", { spaceId });

  const foldersResponse = await foldersService.getFolders(spaceId);

  if (foldersResponse.folders.length > 0) {
    folderId = foldersResponse.folders[0].id;
    Logger.info("Using existing folder", { folderId });
  } else {
    Logger.info("No folders found, creating new one");
    const folderBody = {
      name: `Comments Test Folder ${Date.now()}`
    };

    const folderResponse = await foldersService.createFolder(spaceId, folderBody);

    folderId = folderResponse.folders.id;
    Logger.info("Created new folder", { folderId });
  }

  // Create new list in the folder
  Logger.info("Creating new list", { folderId });
  const listBody = {
    name: `Comments Test List ${Date.now()}`
  };

  const listResponse = await listsService.createListInSpace(spaceId, listBody);
  const listId = listResponse.id;
  Logger.info("Created list", { listId });

  // create a new task in the list
  Logger.info("Creating new task", { listId });
  const taskBody = {
    name: `Comments Test Task ${Date.now()}`,
    description: "Task for testing comments API"
  };

  const taskResponse = await tasksService.createTask(listId, taskBody);

  const taskId = taskResponse.id;
  Logger.info("Created task", { taskId });

  // Get Views from the Team (teamId already comes from the global setup)
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
  if (resources.taskId) {
    Logger.info("Deleting task", { taskId: resources.taskId });
    await tasksService.deleteTask(resources.taskId);
    Logger.info("Deleted task", { taskId: resources.taskId });
  }

  if (resources.listId) {
    Logger.info("Deleting list", { listId: resources.listId });
    await listsService.deleteList(resources.listId)
    Logger.info("Deleted list", { listId: resources.listId });
  }

  Logger.info("Comments test resources cleanup completed");

} 

export { createCommentsTestResources, cleanupCommentsTestResources };