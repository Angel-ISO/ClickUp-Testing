import schemas from '../../bussines/schemaValidators/commentSchemas.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import commentService from '../../bussines/apiServices/commentsApiService.js';
import { waitForComment } from '../../bussines/utils/waitForComment.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
import 'dotenv/config';

taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.COMMENTS }),
  "ClickUp Comments API - Test007 (Large Comment Stress)", () => {
  let commentId;
  let testResources;

  const LONG_TEXT = "A".repeat(4000);

  beforeAll(async () => {
    testResources = global.commentsTestResources;
  });

  afterAll(async () => {
    if (commentId) await commentService.deleteComments(commentId);
  });

  test("Should create and retrieve a very large comment", async () => {
    const body = {
      comment_text: LONG_TEXT,
      notify_all: false
    };

    const created = await commentService.createComments(testResources.taskId, body);
    commentId = created.id;

    expect(commentId).toBeDefined();

    await waitForComment({
      service: commentService,
      taskId: testResources.taskId,
      commentId,
      expectedText: "AAAA"
    });

    const commentsResponse = await commentService.getComments(testResources.taskId);
    const validation = BaseSchemaValidator.validate(
      commentsResponse,
      schemas.commentListSchema,
      "commentListSchema"
    );

    expect(validation.isValid).toBe(true);

    const found = commentsResponse.comments.find(c => c.id == commentId);
    expect(found).toBeDefined();
    expect(found.comment_text.length).toBeGreaterThanOrEqual(4000);
  });
});
