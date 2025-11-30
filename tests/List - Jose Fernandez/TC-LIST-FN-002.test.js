import 'dotenv/config';
import listsService from '../../bussines/apiServices/listsApiService.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';

taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.LISTS, negative: true }),
  'TC-LIST-FN-002 - Create list without valid auth should return 401',
  () => {
    let spaceId = null;

    beforeAll(async () => {
      const env = await setupClickUpEnvironment();
      spaceId = env.spaceId || getSpaceId();
    });

    it('TC-LIST-FN-002-01 - Invalid token', async () => {
      const fakeToken = 'invalid_token_for_lab2_qa3';   
      const body = {
        name: `QA3 list invalid auth - ${Date.now()}`,
      };

      const result = await listsService.create_list_with_custom_auth_result(
        fakeToken,   
        spaceId,
        body
      );

      expect(result.is_error()).toBe(true);
      const error = result.axiosError;

      expect(error.response.status).toBe(401);
      expect(error.response.data).toHaveProperty('err');
    });
  }
);
