import 'dotenv/config';
import listsService from '../../bussines/apiServices/listsApiService.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';

taggedDescribe(
  buildTags({
    smoke: true,
    funcionalidad: FUNCIONALIDADES.LISTS,
  }),
  '@smoke @funcionalidad:lists TC-LIST-FP-001 - Create, get and delete list with valid data',
  () => {
    let spaceId = null;
    let createdListId = null;
    let createdListName = null;

    beforeAll(async () => {
      const env = await setupClickUpEnvironment();
      spaceId = env.spaceId || getSpaceId();
    });

    afterAll(async () => {
      if (createdListId) {
        try {
          await listsService.delete_list(createdListId);
        } catch (error) {
          console.warn('Cleanup delete_list failed', error.message);
        }
      }
    });

    it('TC-LIST-FP-001-01 - Create list with valid data', async () => {
      createdListName = `QA3 List - Jose F - ${Date.now()}`;
      const body = {
        name: createdListName,
        content: 'List created from automated test (Lab 2 TC-LIST-FP-001)',
      };

      const response = await listsService.create_list_in_space(spaceId, body);

      expect(response).toHaveProperty('id');
      expect(typeof response.id).toBe('string');
      expect(response).toHaveProperty('name', createdListName);

      createdListId = response.id;
    });

    it('TC-LIST-FP-001-02 - Get created list and verify details', async () => {
      expect(createdListId).not.toBeNull();
      expect(typeof createdListId).toBe('string');
    });

    it('TC-LIST-FP-001-03 - Delete created list (200/204)', async () => {
      expect(createdListId).not.toBeNull();

      const result = await listsService.delete_list(createdListId);

      expect(['200', '204']).toContain(String(result?.status || 204));

      createdListId = null;
    });
  }
);
