import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import schemas from '../../bussines/schemaValidators/commentSchemas.js';
import commentService from '../../bussines/apiServices/commentsApiService.js';
import { waitForComment } from '../../bussines/utils/waitForComment.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
import 'dotenv/config';

taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.COMMENTS, negative: true }),
  "ClickUp Comments API - Test009", () => {
  let commentId;
  let testResources;

  const MARKDOWN_TEXT = "**Bold** _Italic_ `code` <b>HTML</b>";

  beforeAll(async () => {
    testResources = global.commentsTestResources;
  });

  afterAll(async () => {
    if (commentId) await commentService.delete_comments(commentId);
  });

  it("Should create comment with markdown/html formatting", async () => {
    const created = await commentService.create_comments(
      testResources.taskId,
      { comment_text: MARKDOWN_TEXT, notify_all: false }
    );

    commentId = created.id;
    expect(commentId).toBeDefined();

    await waitForComment({
      service: commentService,
      taskId: testResources.taskId,
      commentId,
      expectedText: "Bold"
    });

    const list = await commentService.get_comments(testResources.taskId);

    const validation = BaseSchemaValidator.validate(
      list,
      schemas.commentListSchema,
      "commentListSchema"
    );

    expect(validation.isValid).toBe(true);

    const found = list.comments.find(c => c.id == commentId);
    expect(found.comment_text).toContain("Bold");
    expect(found.comment_text).toContain("Italic");
    expect(found.comment_text).toContain("code");
  });
});
