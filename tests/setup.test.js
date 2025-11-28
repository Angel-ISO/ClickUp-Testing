import createRequestManager from '../core/requestManager.js';
import Logger from '../core/logger.js';

let globalSpaceId = null;
let globalTeamId = null;

const setupClickUpEnvironment = async () => {
  if (globalSpaceId && globalTeamId) {
    return { spaceId: globalSpaceId, teamId: globalTeamId };
  }

  try {
    const requestManager = createRequestManager();
    
    Logger.info('Obteniendo getting teams');
    const teamsResult = await requestManager.get('/team');
    
    if (!teamsResult.success) {
      throw new Error(`Error getting teams: ${teamsResult.error}`);
    }

    const teamsResponse = teamsResult.value;
    
    if (!teamsResponse.teams || teamsResponse.teams.length === 0) {
      throw new Error('Not teams found');
    }

    globalTeamId = teamsResponse.teams[0].id;
    Logger.info(`Team get: ${globalTeamId}`);

    Logger.info('get spaces...');
    const spacesResult = await requestManager.get(`/team/${globalTeamId}/space`);
    
    if (!spacesResult.success) {
      throw new Error(`Error getting spaces: ${spacesResult.error}`);
    }

    const spacesResponse = spacesResult.value;
    
    if (!spacesResponse.spaces || spacesResponse.spaces.length === 0) {
      throw new Error('Not spaces found');
    }

    globalSpaceId = spacesResponse.spaces[0].id;
    Logger.info(`Space get: ${globalSpaceId}`);

    return { spaceId: globalSpaceId, teamId: globalTeamId };
  } catch (error) {
    Logger.error('Error:', error.message);
    throw error;
  }
};

const getSpaceId = () => {
  if (!globalSpaceId) {
    throw new Error('Space ID not initialized. Run setupClickUpEnvironment() first.');
  }
  return globalSpaceId;
};

const getTeamId = () => {
  if (!globalTeamId) {
    throw new Error('Team ID not initialized. Run setupClickUpEnvironment() first.');
  }
  return globalTeamId;
};

export { setupClickUpEnvironment, getSpaceId, getTeamId };