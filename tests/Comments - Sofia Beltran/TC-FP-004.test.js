import Logger from '../../core/logger.js';
import schemas from '../../bussines/schemaValidators/commentSchemas.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import commentService from '../../bussines/apiServices/commentsApiService.js';
import { waitForReply } from '../../bussines/utils/waitForComment.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
import 'dotenv/config';

taggedDescribe(
  buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.COMMENTS }),
  "ClickUp Comments API - Test004", () => {
  let commentId;
  let replyId;
  let testResources;

  beforeAll(async () => {
    testResources = global.commentsTestResources;

    const body = {
      comment_text: "Initial comment for testing",
      notify_all: false,
    };

    const response = await commentService.createComments(
      testResources.taskId,
      body
    );

    commentId = response.id || response.data.id;
    Logger.info("Created parent comment:", { commentId });
  });

  afterAll(async () => {
    if (commentId) {
      Logger.info('Cleaning up parent comment', { commentId });
      await commentService.deleteComments(commentId);
    }
  });

  it("Should create a thread reply comment correctly", async () => {
    const body = {
      comment_text: "reply comment text for testing",
      notify_all: false,
    };

    const reply = await commentService.createCommentsReply(commentId, body);

    replyId = reply.id;

    expect(replyId).toBeDefined();
    expect(typeof replyId).toBe("number");

    Logger.info('Reply comment created successfully', { replyId });

    const validation = BaseSchemaValidator.validate(
      reply,
      schemas.postThreadSchema,
      'postThreadSchema'
    );

    expect(validation.isValid).toBe(true);
  });


  it("Should validate replies list schema and confirm reply exists", async () => {
    await waitForReply({
      service: commentService,
      parentCommentId: commentId,
      replyId: replyId,
      expectedText: "reply comment text for testing"
    });

    const response = await commentService.getCommentsReply(commentId);
    const validation = BaseSchemaValidator.validate(
      response,
      schemas.getThreadSchema,
      'getThreadSchema'
    );

    if (!validation.isValid) {
      Logger.error("GET replies schema errors:", validation.errors);
    }

    expect(validation.isValid).toBe(true);


    const exists = response.comments.some(
      (c) => String(c.id) === String(replyId)
    );

    expect(exists).toBe(true);

    const foundComment = response.comments.find(c => String(c.id) === String(replyId));
    expect(foundComment.comment_text).toBe("reply comment text for testing");
  });
});
