import Logger from '../../core/logger.js';
import schemas from '../../bussines/schemaValidators/commentSchemas.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import commentsService from '../../bussines/apiServices/commentsApiService.js';
import { waitForChatComment } from '../../bussines/utils/waitForComment.js';
require("dotenv").config();

describe("ClickUp Comments API - Test005", () => {
  let chatCommentId;
  let testResources;
  let viewId;

  beforeAll(async () => {
    testResources = global.commentsTestResources;
    viewId = testResources.viewId;
    

    Logger.info("Using chat view for tests:", { viewId });
  });

  afterAll(async () => {
    if (chatCommentId) {
      try {
        Logger.info('Cleaning up chat comment', { chatCommentId });
        await commentsService.delete_comments(chatCommentId);
      } catch (error) {
        Logger.warn('Failed to clean up chat comment', { 
          chatCommentId, 
          error: error.message 
        });
      }
    }
  });

  test("Should create a chat view comment and validate schema", async () => {
    const body = {
      comment_text: "Test comment from Jest in chat view",
      notify_all: false
    };

    const response = await commentsService.create_comments_chatView(viewId, body);
    expect(response).toBeDefined();
    chatCommentId = response.id || response.data?.id;
    Logger.info('Chat comment created successfully', { 
      viewId, 
      chatCommentId 
    });

    const validation = BaseSchemaValidator.validate(
      response,
      schemas.postChatCommentSchema,
      'postChatCommentSchema'
    );
    
    expect(validation.isValid).toBe(true);
    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }
  });

  test("Should return valid schema and contain the comment", async () => {
    await waitForChatComment({
      service: commentsService,
      viewId: viewId,
      commentId: chatCommentId,
      shouldExist: true,
    });

    const commentsResponse = await commentsService.get_comments_chatView(viewId);
    
    const validation = BaseSchemaValidator.validate(
      commentsResponse,
      schemas.getChatCommentsSchema,
      'getChatCommentsSchema'
    );
    
    expect(validation.isValid).toBe(true);
    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }

    const exists = commentsResponse.comments.some(c => c.id == chatCommentId);
    expect(exists).toBe(true);
    
    if (!exists) {
      Logger.error('Comment not found in chat view', {
        chatCommentId,
        foundComments: commentsResponse.comments.map(c => c.id)
      });
    }
  });
});