import Logger from '../../core/logger.js';
import schemas from '../../bussines/schemaValidators/commentSchemas.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import commentService from '../../bussines/apiServices/commentsApiService.js';
import { waitForComment } from '../../bussines/utils/waitForComment.js'
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
import 'dotenv/config';

taggedDescribe(
  buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.COMMENTS }),
  "ClickUp Comments API - Test001",
  () => {
    let commentId;
    let testResources;

    beforeAll(() => {
      testResources = global.commentsTestResources;

      if (!testResources || !testResources.taskId) {
        Logger.warn('Test resources not initialized. Make sure setupComments.test.js ran first.');
      }

      Logger.info("Using test resources from setup", testResources);
    });

    afterAll(async () => {
      if (commentId) {
        Logger.info('Cleaning up: Deleting test comment', { commentId });
        await commentService.deleteComments(commentId)
        Logger.info('Comment deleted successfully', { commentId });
      }
    });

    it("Should create a comment", async () => {
      const body = {
        comment_text: "Do test case for comments",
        notify_all: true,
      };

      Logger.info('Creating comment on task', {
        taskId: testResources.taskId,
        commentText: body.comment_text
      });

      const createdComment = await commentService.createComments(
        testResources.taskId,
        body
      );

      expect(createdComment).toHaveProperty("id");
      expect(createdComment.id).toBeDefined();

      commentId = createdComment.id;
      Logger.info('Comment created and ID captured', { commentId });
    });

    it("Should validate comment list schema and check comment existence", async () => {
      await waitForComment({
        service: commentService,
        taskId: testResources.taskId,
        commentId,
        expectedText: "Do test case for comments"
      });

      Logger.info('Fetching comments list', { taskId: testResources.taskId });
      const commentsResponse = await commentService.getComments(
        testResources.taskId
      );

      const validation = BaseSchemaValidator.validate(
        commentsResponse,
        schemas.commentListSchema,
        'commentListSchema'
      );

      expect(validation.isValid).toBe(true);

      const exists = commentsResponse.comments.some(c => c.id == commentId);
      expect(exists).toBe(true);

      Logger.info('Comment existence verified', {
        commentId,
        exists,
        totalComments: commentsResponse.comments.length
      });
    });
  }
);

