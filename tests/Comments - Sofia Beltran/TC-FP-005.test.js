import Logger from '../../core/logger.js';
import commentService from '../../bussines/apiServices/commentsApiService.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
import 'dotenv/config';

taggedDescribe(
  buildTags({ negative: true, funcionalidad: FUNCIONALIDADES.COMMENTS }),
  "ClickUp Comments API - Test005 - Chat View Comment Premium Feature", () => {
    let testResources;
    let viewId;

    beforeAll(async () => {
      testResources = global.commentsTestResources;
      viewId = testResources.viewId;

      Logger.info("Using chat view for negative test:", { viewId });
    });

    it("Should return 402 Payment Required when trying to create chat view comment without premium plan", async () => {
      if (!viewId) {
        Logger.warn("No viewId available, skipping test");
        return;
      }

      const body = {
        comment_text: "Test comment from Jest in chat view",
        notify_all: false
      };

      const result = await commentService.createCommentsChatViewResult(viewId, body);

      Logger.info('Chat view comment request result', {
        isOk: result.isOk(),
        status: result.axiosError?.response?.status,
        viewId
      });
      expect(result.isOk()).toBe(false);

      const statusCode = result.axiosError?.response?.status;
      expect(statusCode).toBe(402);

      Logger.info('Negative test passed - API correctly returns 402 for premium feature', {
        expectedStatus: 402,
        actualStatus: statusCode
      });
    });

    it("Should validate 402 error response structure", async () => {
      if (!viewId) {
        Logger.warn("No viewId available, skipping test");
        return;
      }

      const body = {
        comment_text: "Another test comment for validation",
        notify_all: false
      };

      const result = await commentService.createCommentsChatViewResult(viewId, body);

      expect(result.isOk()).toBe(false);
      expect(result.axiosError).toBeDefined();

      const errorResponse = result.axiosError?.response;
      expect(errorResponse).toBeDefined();
      expect(errorResponse.status).toBe(402);

      Logger.info('402 Error response structure', {
        status: errorResponse?.status,
        statusText: errorResponse?.statusText,
        data: errorResponse?.data
      });
    });
  });