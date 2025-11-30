import Logger from '../../core/logger.js';
import schemas from '../../bussines/schemaValidators/commentSchemas.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import commentService from '../../bussines/apiServices/commentsApiService.js';
import {waitForComment} from '../../bussines/utils/waitForComment.js'
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';
import 'dotenv/config';

taggedDescribe(
    buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.COMMENTS }),
    "ClickUp Comments API - Test002", () => {
    let commentId;
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
        Logger.info("Created comment with ID:", commentId);
    });

    afterAll(async () => {
        if (commentId) {
            Logger.info('Cleaning up: Deleting test comment', { commentId });
            await commentService.deleteComments(commentId)
            Logger.info('Comment deleted successfully', { commentId });
        }
    });

    it("Should update comment correctly", async () => {
        const updateData = {
            comment_text: "Updated comment text for testing",
            notify_all: false,
        };

        Logger.info('Updating comment', { commentId, updateData });
        const updateResponse = await commentService.updateComments(
            commentId,
            updateData
        );

        expect(updateResponse).toBeDefined();
        Logger.info('Comment updated and verified successfully', { commentId });
    });

    it("Should validate comment (Update) list schema and check comment existence", async () => {
        await waitForComment({
            service: commentService,
            taskId: testResources.taskId,
            commentId,
            expectedText: "Updated comment text for testing"
        });
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