import Logger from '../../core/logger.js';
import schemas from '../../bussines/schemaValidators/commentSchemas.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import commentsService from '../../bussines/apiServices/commentsApiService.js';
import {waitForComment} from '../../bussines/utils/waitForComment.js';
require("dotenv").config();

describe("ClickUp Comments API - Test003", () => {
    let commentId;
    let testResources;

    beforeAll(async () => {
        testResources = global.commentsTestResources;
        const body = {
            comment_text: "delete comment text for testing",
            notify_all: false,
        };

        const response = await commentsService.createComments(
            testResources.taskId,
            body
        );

        commentId = response.id || response.data.id;
        Logger.info("Created comment with ID:", commentId);
    });

    test("Should delete comment correctly", async () => {
        Logger.info('Deleting comment', { commentId });

        const deleteResponse = await commentsService.deleteComments(commentId);
        expect(deleteResponse).toBeDefined();

        Logger.info('Comment deleted successfully', { commentId });
    });

    test("Should validate comment (Delete) list schema and check comment absence", async () => {
        await waitForComment({
            service: commentsService,
            taskId: testResources.taskId,
            commentId,
            shouldExist: false,
        });

        const commentsResponse = await commentsService.getComments(
            testResources.taskId
        );

        const validation = BaseSchemaValidator.validate(
            commentsResponse,
            schemas.commentListAfterDeleteSchema,
            'commentListAfterDeleteSchema'
        );

        expect(validation.isValid).toBe(true);

        const exists = commentsResponse.comments.some(c => c.id == commentId);
        expect(exists).toBe(false); 
    });
});
