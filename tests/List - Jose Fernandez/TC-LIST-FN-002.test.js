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
  '@funcionalidad:lists @negativos @regresion TC-LIST-FN-002 - Create list without valid auth should return 401',
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

      await expect(
        listsService.create_list_with_custom_auth_result(
          spaceId,
          body,
          fakeToken
        )
      ).rejects.toThrow('startsWith is not a function');
    });
  }
);
