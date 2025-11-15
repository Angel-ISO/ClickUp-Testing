const axios = require("axios");
const { beforeAll, describe, test } = require("@jest/globals");
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

const commentListAfterDeleteSchema = {
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

describe("ClickUp Comments API - Test003", () => {
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

    test("Should delete comment correctly", async () => {
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
        expect(response.data).toEqual({});
    });

    test("Should validate comment (Delete) list schema and check comment existence", async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await axios.get(
            `${baseURL}/task/${taskId}/comment`,
            { headers }
        );

        const validateGet = ajv.compile(commentListAfterDeleteSchema);
        const validGet = validateGet(response.data);

        if (!validGet) {
            console.error("Get schema validation errors:", JSON.stringify(validateGet.errors, null, 2));
        }

        expect(validGet).toBe(true);
        const exists = response.data.comments.some(c => c.id == commentId);
        expect(exists).toBe(true);
    });
});
