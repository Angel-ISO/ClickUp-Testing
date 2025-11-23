const axios = require("axios");
import Logger from '../../core/logger.js';
import { setupClickUpEnvironment, getSpaceId, getTeamId } from '../setup.test.js';
require("dotenv").config();

const baseURL = process.env.CLICKUP_BASE_URL;
const token = process.env.CLICKUP_TOKEN;

const headers = {
  Authorization: token,
  "Content-Type": "application/json",
};

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
  try {
    // get or create folder
    let folderId;
    Logger.info("Getting folders from space", { spaceId });
    
    const foldersResponse = await axios.get(
      `${baseURL}/space/${spaceId}/folder`,
      { headers }
    );

    if (foldersResponse.data.folders.length > 0) {
      folderId = foldersResponse.data.folders[0].id;
      Logger.info("Using existing folder", { folderId });
    } else {
      Logger.info("No folders found, creating new one");
      const folderBody = {
        name: `Comments Test Folder ${Date.now()}`
      };
      
      const folderResponse = await axios.post(
        `${baseURL}/space/${spaceId}/folder`,
        folderBody,
        { headers }
      );
      
      folderId = folderResponse.data.id;
      Logger.info("Created new folder", { folderId });
    }

    // Create new list in the folder
    Logger.info("Creating new list", { folderId });
    const listBody = {
      name: `Comments Test List ${Date.now()}`
    };
    
    const listResponse = await axios.post(
      `${baseURL}/folder/${folderId}/list`,
      listBody,
      { headers }
    );
    
    const listId = listResponse.data.id;
    Logger.info("Created list", { listId });

    // create a new task in the list
    Logger.info("Creating new task", { listId });
    const taskBody = {
      name: `Comments Test Task ${Date.now()}`,
      description: "Task for testing comments API"
    };
    
    const taskResponse = await axios.post(
      `${baseURL}/list/${listId}/task`,
      taskBody,
      { headers }
    );
    
    const taskId = taskResponse.data.id;
    Logger.info("Created task", { taskId });

    // Get Views from the Team (teamId already comes from the global setup)
    Logger.info("Getting team views", { teamId });
    const viewsResponse = await axios.get(
      `${baseURL}/team/${teamId}/view`,
      { headers }
    );
    
    let viewId = null;
    
    if (viewsResponse.data.views && viewsResponse.data.views.length > 0) {
      const chatView = viewsResponse.data.views.find(
        view => view.type === 'chat' || view.name.toLowerCase().includes('chat')
      );
      
      if (chatView) {
        viewId = chatView.id;
        Logger.info("Found chat view", { viewId, viewName: chatView.name });
      } else {
        viewId = viewsResponse.data.views[0].id;
        Logger.info("Using first available view", { 
          viewId, 
          viewName: viewsResponse.data.views[0].name,
          viewType: viewsResponse.data.views[0].type
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
    
  } catch (error) {
    Logger.error("Error creating test resources", { 
      error: error.message,
      response: error.response?.data 
    });
    throw error;
  }
}

/**
 * Clean up resources created during testing
 */
async function cleanupCommentsTestResources() {
  const resources = global.commentsTestResources;

  try {
    // Eliminar Task
    if (resources.taskId) {
      Logger.info("Deleting task", { taskId: resources.taskId });
      await axios.delete(
        `${baseURL}/task/${resources.taskId}`, 
        { headers }
      );
      Logger.info("Deleted task", { taskId: resources.taskId });
    }

    // Delete list
    if (resources.listId) {
      Logger.info("Deleting list", { listId: resources.listId });
      await axios.delete(
        `${baseURL}/list/${resources.listId}`, 
        { headers }
      );
      Logger.info("Deleted list", { listId: resources.listId });
    }

    Logger.info("Comments test resources cleanup completed");
    
  } catch (error) {
    Logger.error("Error during cleanup", { 
      error: error.message,
      response: error.response?.data 
    });
  }
}

export { createCommentsTestResources, cleanupCommentsTestResources };