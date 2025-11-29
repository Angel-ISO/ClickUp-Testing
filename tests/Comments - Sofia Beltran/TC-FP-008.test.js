import Logger from '../../core/logger.js';
import schemas from '../../bussines/schemaValidators/commentSchemas.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import commentService from '../../bussines/apiServices/commentsApiService.js';
import { waitForComment } from '../../bussines/utils/waitForComment.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
import 'dotenv/config';

taggedDescribe(
   buildTags({ funcionalidad: FUNCIONALIDADES.COMMENTS, negative: true }),
  "ClickUp Comments API - Test008 (Partial Update)", () => {
  let commentId;
  let testResources;

  beforeAll(async () => {
    testResources = global.commentsTestResources;
    const created = await commentService.create_comments(
      testResources.taskId,
      { comment_text: "Original Text", notify_all: false }
    );
    commentId = String(created.id);
  });

  afterAll(async () => {
    if (commentId) await commentService.delete_comments(commentId);
  });

  test("Should update only the comment_text field using a partial body", async () => {
    const newText = "Updated via partial body";
    
    await commentService.update_comments(commentId, {
      comment_text: newText
    });

    await waitForComment({
      service: commentService,
      taskId: testResources.taskId,
      commentId,
      expectedText: "Updated"
    });

    const list = await commentService.get_comments(testResources.taskId);
    
    const validation = BaseSchemaValidator.validate(
      list,
      schemas.commentListSchema,
      "commentListSchema"
    );
    expect(validation.isValid).toBe(true);

    const commentsArray =
      Array.isArray(list) ? list :
      Array.isArray(list?.comments) ? list.comments :
      Array.isArray(list?.data?.comments) ? list.data.comments :
      null;

    if (!commentsArray) {
      Logger.error("Unexpected format from get_comments()");
    }

    const updated = commentsArray.find(c => String(c.id) === commentId);
    
    expect(updated).toBeDefined();
    expect(updated.comment_text).toBe(newText);
    
    Logger.info("Comment updated successfully", {
      commentId,
      newText: updated.comment_text
    });
  });
});