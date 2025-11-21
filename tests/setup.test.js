import create_request_manager from '../core/request_manager.js';

let globalSpaceId = null;

const setupClickUpEnvironment = async () => {
  if (globalSpaceId) return globalSpaceId;

  try {
    const requestManager = create_request_manager();

    console.log('Obteniendo getting teams');
    const teamsResult = await requestManager.get('/team');

    if (!teamsResult.success) {
      throw new Error(`Error getting teams: ${teamsResult.error}`);
    }

    const teamsResponse = teamsResult.value;
    if (!teamsResponse.teams || teamsResponse.teams.length === 0) {
      throw new Error('Not teams found');
    }

    const teamId = teamsResponse.teams[0].id;
    console.log(`Team get: ${teamId}`);

    console.log('get spaces...');
    const spacesResult = await requestManager.get(`/team/${teamId}/space`);

    if (!spacesResult.success) {
      throw new Error(`Error getting spaces: ${spacesResult.error}`);
    }

    const spacesResponse = spacesResult.value;
    if (!spacesResponse.spaces || spacesResponse.spaces.length === 0) {
      throw new Error('Not spaces found');
    }

    globalSpaceId = spacesResponse.spaces[0].id;
    console.log(`Space get: ${globalSpaceId}`);

    return globalSpaceId;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

const getSpaceId = () => {
  if (!globalSpaceId) {
    throw new Error('Space ID not initialized. Run setupClickUpEnvironment() first.');
  }
  return globalSpaceId;
};

export { setupClickUpEnvironment, getSpaceId };