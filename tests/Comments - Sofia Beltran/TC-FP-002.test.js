import Logger from '../../core/logger.js';
import schemas from '../../bussines/schemaValidators/commentSchemas.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import commentsService from '../../bussines/apiServices/commentsApiService.js';
import waitForComment from '../../bussines/utils/waitForComment.js'
require("dotenv").config();

describe("ClickUp Comments API - Test002", () => {
    let commentId;
    let testResources;

    beforeAll(async () => {
        testResources = global.commentsTestResources;
        const body = {
            comment_text: "Initial comment for testing",
            notify_all: false,
        };

        const response = await commentsService.create_comments(
            testResources.taskId,
            body
        );

        commentId = response.id || response.data.id;
        Logger.info("Created comment with ID:", commentId);
    });

    afterAll(async () => {
        if (commentId) {
            Logger.info('Cleaning up: Deleting test comment', { commentId });
            await commentsService.delete_comments(commentId)
            Logger.info('Comment deleted successfully', { commentId });
        }
    });

    test("Should update comment correctly", async () => {
        const updateData = {
            comment_text: "Updated comment text for testing",
            notify_all: false,
        };

        Logger.info('Updating comment', { commentId, updateData });
        const updateResponse = await commentsService.update_comments(
            commentId,
            updateData
        );

        expect(updateResponse).toBeDefined();
        Logger.info('Comment updated and verified successfully', { commentId });
    });

    test("Should validate comment (Update) list schema and check comment existence", async () => {
        await waitForComment({
            service: commentsService,
            taskId: testResources.taskId,
            commentId,
            expectedText: "Updated comment text for testing"
        });
        const commentsResponse = await commentsService.get_comments(
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

        const comment = commentsResponse.comments.find(c => c.id == commentId);
        expect(comment).toBeDefined();
        expect(comment.comment_text).toBe("Updated comment text for testing");

        Logger.info('Comment existence verified', {
            commentId,
            exists,
            totalComments: commentsResponse.comments.length,
            commentText: comment.comment_text
        });
    });
});