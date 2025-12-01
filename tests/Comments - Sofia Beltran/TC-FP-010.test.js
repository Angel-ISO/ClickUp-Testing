import Logger from '../../core/logger.js';
import schemas from '../../bussines/schemaValidators/commentSchemas.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import commentService from '../../bussines/apiServices/commentsApiService.js';
import { waitForComment } from '../../bussines/utils/waitForComment.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
import 'dotenv/config';

taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.COMMENTS, negative: true }),
  "ClickUp Comments API - Test009 (Duplicate Comment Creation / Idempotency)", () => {
  let firstCommentId;
  let secondCommentId;
  let testResources;
  const TEXT = "Duplicated creation test comment";

  beforeAll(async () => {
    testResources = global.commentsTestResources;
  });

  afterAll(async () => {
    if (firstCommentId) await commentService.deleteComments(firstCommentId);
    if (secondCommentId) await commentService.deleteComments(secondCommentId);

    Logger.warn("Cleanup failed");
  });

  it("Should create two identical comments but with different IDs", async () => {
    const body = {
      comment_text: TEXT,
      notify_all: false
    };

    Logger.info("Creating first comment");
    const first = await commentService.createComments(testResources.taskId, body);
    firstCommentId = String(first.id);
    expect(firstCommentId).toBeDefined();

    Logger.info("Creating second (duplicate) comment");
    const second = await commentService.createComments(testResources.taskId, body);
    secondCommentId = String(second.id);
    expect(secondCommentId).toBeDefined();

    expect(firstCommentId).not.toBe(secondCommentId);

    await waitForComment({
      service: commentService,
      taskId: testResources.taskId,
      commentId: firstCommentId,
      expectedText: "Duplicated"
    });

    await waitForComment({
      service: commentService,
      taskId: testResources.taskId,
      commentId: secondCommentId,
      expectedText: "Duplicated"
    });

    const list = await commentService.getComments(testResources.taskId);

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
      console.log("LIST ===>", JSON.stringify(list, null, 2));
      throw new Error("Unexpected format from get_comments()");
    }

    const ids = commentsArray.map(c => String(c.id));

    expect(ids).toContain(firstCommentId);
    expect(ids).toContain(secondCommentId);

    Logger.info("Both duplicated comments exist with different IDs", {
      firstCommentId,
      secondCommentId
    });
  });
});