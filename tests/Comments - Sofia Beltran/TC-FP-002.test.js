const axios = require("axios");
const { afterAll, beforeAll, describe, test } = require("@jest/globals");
const Ajv = require("ajv");
require("dotenv").config();

const ajv = new Ajv();
const baseURL = process.env.CLICKUP_BASE_URL;
const token = process.env.CLICKUP_TOKEN;
const taskId = process.env.CLICKUP_TASK_ID;

const headers = {
    Authorization: token,
    "Content-Type": "application/json",
};

const commentListSchema = {
    type: "object",
    required: ["comments"],
    properties: {
        comments: {
            type: "array",
            items: {
                type: "object",
                required: ["id", "comment_text", "user"],
                properties: {
                    id: { type: ["string", "number"] },
                    comment_text: { type: "string" },
                    user: {
                        type: "object",
                        required: ["id", "username"],
                        properties: {
                            id: { type: "number" },
                            username: { type: "string" },
                            email: { type: "string" },
                            color: { type: "string" },
                            initials: { type: "string" },
                            profilePicture: { type: ["string", "null"] }
                        }
                    },
                    date: { type: "string" },
                    reply_count: { type: "number" }
                },
                additionalProperties: true
            }
        }
    },
    additionalProperties: true
};

describe("ClickUp Comments API - Test002", () => {
    let commentId;

    beforeAll(async () => {
        const body = {
            comment_text: "Initial comment for testing",
            notify_all: false,
        };
        const response = await axios.post(
            `${baseURL}/task/${taskId}/comment`,
            body,
            { headers }
        );

        commentId = response.data.id;
        console.log("Created comment with ID:", commentId);
    });

    afterAll(async () => {
        if (commentId) {
            await axios.delete(
                `${baseURL}/comment/${commentId}`,
                { headers }
            );
            console.log("Successfully deleted comment");
        }
    });

    test("Should update comment correctly", async () => {
        const body = {
            comment_text: "Updated comment text for testing",
            notify_all: false,
        };

        const response = await axios.put(
            `${baseURL}/comment/${commentId}`,
            body,
            { headers }
        );

        expect(response.status).toBe(200);
        expect(typeof response.data).toBe("object");

        if (Object.keys(response.data).length > 0) {
            expect(response.data).toHaveProperty("id");
            expect(response.data.comment_text).toBe("Updated comment text for testing");
        } else {
            console.log("PUT response is empty object - this is expected behavior for ClickUp API");
        }
    });

    test("Should validate comment (Update) list schema and check comment existence", async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await axios.get(
            `${baseURL}/task/${taskId}/comment`,
            { headers }
        );

        const validate = ajv.compile(commentListSchema);
        const valid = validate(response.data);

        if (!valid) {
            console.error("Schema validation errors:", JSON.stringify(validate.errors, null, 2));
        }
        expect(valid).toBe(true);
        expect(response.data.comments).toBeDefined();
        expect(Array.isArray(response.data.comments)).toBe(true);

        const commentExists = response.data.comments.some(c => String(c.id) === String(commentId));
        expect(commentExists).toBe(true);

        const updatedComment = response.data.comments.find(c => String(c.id) === String(commentId));
        expect(updatedComment).toBeDefined();
        expect(updatedComment.comment_text).toBe("Updated comment text for testing");
    });
});