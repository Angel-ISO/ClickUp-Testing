import Logger from '../../core/logger.js';
import schemas from '../../bussines/schemaValidators/commentSchemas.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import commentService from '../../bussines/apiServices/commentsApiService.js';
import { waitForComment } from '../../bussines/utils/waitForComment.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
import 'dotenv/config';

taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.COMMENTS }),
  "ClickUp Comments API - Test Case 1: Unicode & Emojis", () => {
  let commentId;
  let testResources;
  const EXPECTED_TEXT = "🔥✨👩‍💻🇨🇴 — prueba: prueba中文 العربية 🚀";
  const UNIQUE_SUBSTRING = "👩‍💻";

  beforeAll(async () => {
    testResources = global.commentsTestResources;
    if (!testResources || !testResources.taskId) {
      Logger.error('Test resources not initialized. Make sure setupComments.test.js ran first.');
    }
    Logger.info("Using test resources from setup", testResources);
  });

  afterAll(async () => {
    if (commentId) {
      Logger.info('Cleaning up: Deleting test comment', { commentId });
      try {
        await commentService.deleteComments(commentId);
        Logger.info('Comment deleted successfully', { commentId });
      } catch (error) {
        Logger.error('Failed to delete comment', { commentId, error: error.message });
      }
    }
  });

  it("Should create a comment with emojis and Unicode complex", async () => {
    const body = {
      comment_text: EXPECTED_TEXT,
      notify_all: false,
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
    expect(typeof createdComment.id).toBe('number');

    commentId = createdComment.id;

    Logger.info('Comment created successfully, waiting for propagation', { commentId });

    await waitForComment({
      service: commentService,
      taskId: testResources.taskId,
      commentId,
      expectedText: UNIQUE_SUBSTRING
    });

    Logger.info('Comment creation verified');
  });

  it("Should validate comment list schema and verify comment existence", async () => {
    expect(commentId).toBeDefined();

    Logger.info('Fetching comments list for schema validation', {
      taskId: testResources.taskId,
      commentId
    });

    const commentsResponse = await commentService.getComments(testResources.taskId);

    const validation = BaseSchemaValidator.validate(
      commentsResponse,
      schemas.commentListSchema,
      'commentListSchema'
    );

    expect(validation.isValid).toBe(true);

    if (!validation.isValid) {
      Logger.error('Schema validation failed', {
        errors: validation.errors
      });
    }

    const createdCommentData = commentsResponse.comments.find(c => c.id == commentId);
    expect(createdCommentData).toBeDefined();

    const commentText = createdCommentData.comment_text ||
      createdCommentData.text_content ||
      createdCommentData.comment?.text ||
      createdCommentData.text;

    expect(commentText).toBeDefined();

    expect(commentText).toContain(UNIQUE_SUBSTRING);
    expect(commentText).toContain("🔥");
    expect(commentText).toContain("✨");
    expect(commentText).toContain("🇨🇴");
    expect(commentText).toContain("中文");
    expect(commentText).toContain("العربية");
    expect(commentText).toContain("🚀");

    Logger.info('Schema validation and comment existence verified', {
      commentId,
      totalComments: commentsResponse.comments.length,
      schemaValid: validation.isValid,
      fullText: commentText
    });
  });
});