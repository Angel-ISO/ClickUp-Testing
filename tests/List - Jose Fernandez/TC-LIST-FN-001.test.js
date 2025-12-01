import 'dotenv/config';
import listsService from '../../bussines/apiServices/listsApiService.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';

taggedDescribe(
  buildTags({
    funcionalidad: FUNCIONALIDADES.LISTS,
    negative: true,
    regression: true,
  }),
  '@regresion @funcionalidad:lists @negativos TC-LIST-FN-001 - Create list without name should return 400',
  () => {
    let spaceId = null;

    beforeAll(async () => {
      const env = await setupClickUpEnvironment();
      spaceId = env.spaceId || getSpaceId();
    });

    it('TC-LIST-FN-001-01 - Empty body', async () => {
      const result = await listsService.create_list_in_space_result(spaceId, {});

      expect(result.is_error()).toBe(true);
      const error = result.axiosError;

      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('err');
    });

    it('TC-LIST-FN-001-02 - Name is empty string', async () => {
      const result = await listsService.create_list_in_space_result(spaceId, { name: '' });

      expect(result.is_error()).toBe(true);
      const error = result.axiosError;

      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('err');
    });
  }
);
