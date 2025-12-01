import "dotenv/config";
import tagsService from "../../bussines/apiServices/tagsApiService.js";
import BaseSchemaValidator from "../../bussines/schemaValidators/baseSchemaValidator.js";
import tagSchemas from "../../bussines/schemaValidators/tagSchemas.js";
import Logger from "../../core/logger.js";
import { setupClickUpEnvironment, getSpaceId } from "../setup.test.js";
import {
  taggedDescribe,
  buildTags,
  FUNCIONALIDADES,
} from "../../bussines/utils/tags.js";

taggedDescribe(
  buildTags({ funcionalidad: FUNCIONALIDADES.TAGS}),
  "TC-FP-008 - Verify tag creation with emojis and special characters",
  () => {
    const createdTagNames = [];
    const specialCharTags = [
      {
        name: "Tag🚀Emoji",
        tag_fg: "#FFFFFF",
        tag_bg: "#FF0000",
        description: "Tag with emoji",
      },
      {
        name: "Tag@#$%Special",
        tag_fg: "#000000",
        tag_bg: "#00FF00",
        description: "Tag with special characters",
      },
      {
        name: "Tag™®©Symbols",
        tag_fg: "#FFFFFF",
        tag_bg: "#0000FF",
        description: "Tag with trademark symbols",
      },
      {
        name: "Tag中文日本語",
        tag_fg: "#000000",
        tag_bg: "#FFFF00",
        description: "Tag with Chinese and Japanese characters",
      },
      {
        name: "Tag   Spaces",
        tag_fg: "#FFFFFF",
        tag_bg: "#FF00FF",
        description: "Tag with multiple spaces",
      },
    ];

    beforeAll(async () => {
      await setupClickUpEnvironment();
    });

    afterEach(async () => {
      for (const tagName of createdTagNames) {
        const deleteResult = await tagsService.deleteTagResult(
          getSpaceId(),
          tagName
        );

        if (deleteResult.isOk()) {
          Logger.info("Tag cleaned up successfully", { tagName });
        } else {
          Logger.warn("Cleanup failed for tag", {
            tagName,
            error: deleteResult.error,
          });
        }
      }
      createdTagNames.length = 0;
    });

    it(
      "POST - Create tag with emoji in name",
      async () => {
        const emojiTag = specialCharTags[0];

        Logger.info("Creating tag with emoji", {
          spaceId: getSpaceId(),
          tagName: emojiTag.name,
          description: emojiTag.description,
        });

        const result = await tagsService.createTagResult(getSpaceId(), {
          tag: {
            name: emojiTag.name,
            tag_fg: emojiTag.tag_fg,
            tag_bg: emojiTag.tag_bg,
          },
        });

        expect(result.isOk()).toBe(true);
        expect(result.isError()).toBe(false);

        const response = result.value;

        expect(response).toBeDefined();
        expect(typeof response).toBe("object");
        expect(response).toEqual({});

        const validation = BaseSchemaValidator.validate(
          response,
          tagSchemas.emptyBodyResponseSchema,
          "Create Tag Response"
        );
        expect(validation.isValid).toBe(true);

        if (!validation.isValid) {
          Logger.error("Schema validation failed", {
            errors: validation.errors,
          });
        }

        Logger.info("Tag with emoji created successfully", {
          tagName: emojiTag.name,
        });

        createdTagNames.push(emojiTag.name);
      },
      20000
    );

    it(
      "POST - Create tag with special characters",
      async () => {
        const specialTag = specialCharTags[1];

        Logger.info("Creating tag with special characters", {
          spaceId: getSpaceId(),
          tagName: specialTag.name,
          description: specialTag.description,
        });

        const result = await tagsService.createTagResult(getSpaceId(), {
          tag: {
            name: specialTag.name,
            tag_fg: specialTag.tag_fg,
            tag_bg: specialTag.tag_bg,
          },
        });

        expect(result.isOk()).toBe(true);
        expect(result.isError()).toBe(false);

        const response = result.value;

        expect(response).toBeDefined();
        expect(typeof response).toBe("object");
        expect(response).toEqual({});

        const validation = BaseSchemaValidator.validate(
          response,
          tagSchemas.emptyBodyResponseSchema,
          "Create Tag Response"
        );
        expect(validation.isValid).toBe(true);

        if (!validation.isValid) {
          Logger.error("Schema validation failed", {
            errors: validation.errors,
          });
        }

        Logger.info("Tag with special characters created successfully", {
          tagName: specialTag.name,
        });

        createdTagNames.push(specialTag.name);
      },
      20000
    );

    it(
      "POST - Create tag with unicode symbols",
      async () => {
        const symbolTag = specialCharTags[2];

        Logger.info("Creating tag with unicode symbols", {
          spaceId: getSpaceId(),
          tagName: symbolTag.name,
          description: symbolTag.description,
        });

        const result = await tagsService.createTagResult(getSpaceId(), {
          tag: {
            name: symbolTag.name,
            tag_fg: symbolTag.tag_fg,
            tag_bg: symbolTag.tag_bg,
          },
        });

        expect(result.isOk()).toBe(true);
        expect(result.isError()).toBe(false);

        const response = result.value;

        expect(response).toBeDefined();
        expect(typeof response).toBe("object");
        expect(response).toEqual({});

        const validation = BaseSchemaValidator.validate(
          response,
          tagSchemas.emptyBodyResponseSchema,
          "Create Tag Response"
        );
        expect(validation.isValid).toBe(true);

        if (!validation.isValid) {
          Logger.error("Schema validation failed", {
            errors: validation.errors,
          });
        }

        Logger.info("Tag with unicode symbols created successfully", {
          tagName: symbolTag.name,
        });

        createdTagNames.push(symbolTag.name);
      },
      20000
    );

    it(
      "POST - Create tag with international characters",
      async () => {
        const internationalTag = specialCharTags[3];

        Logger.info("Creating tag with international characters", {
          spaceId: getSpaceId(),
          tagName: internationalTag.name,
          description: internationalTag.description,
        });

        const result = await tagsService.createTagResult(getSpaceId(), {
          tag: {
            name: internationalTag.name,
            tag_fg: internationalTag.tag_fg,
            tag_bg: internationalTag.tag_bg,
          },
        });

        expect(result.isOk()).toBe(true);
        expect(result.isError()).toBe(false);

        const response = result.value;

        expect(response).toBeDefined();
        expect(typeof response).toBe("object");
        expect(response).toEqual({});

        const validation = BaseSchemaValidator.validate(
          response,
          tagSchemas.emptyBodyResponseSchema,
          "Create Tag Response"
        );
        expect(validation.isValid).toBe(true);

        if (!validation.isValid) {
          Logger.error("Schema validation failed", {
            errors: validation.errors,
          });
        }

        Logger.info("Tag with international characters created successfully", {
          tagName: internationalTag.name,
        });

        createdTagNames.push(internationalTag.name);
      },
      20000
    );

    it(
      "POST - Create tag with multiple spaces",
      async () => {
        const spaceTag = specialCharTags[4];

        Logger.info("Creating tag with multiple spaces", {
          spaceId: getSpaceId(),
          tagName: spaceTag.name,
          description: spaceTag.description,
        });

        const result = await tagsService.createTagResult(getSpaceId(), {
          tag: {
            name: spaceTag.name,
            tag_fg: spaceTag.tag_fg,
            tag_bg: spaceTag.tag_bg,
          },
        });

        expect(result.isOk()).toBe(true);
        expect(result.isError()).toBe(false);

        const response = result.value;

        expect(response).toBeDefined();
        expect(typeof response).toBe("object");
        expect(response).toEqual({});

        const validation = BaseSchemaValidator.validate(
          response,
          tagSchemas.emptyBodyResponseSchema,
          "Create Tag Response"
        );
        expect(validation.isValid).toBe(true);

        if (!validation.isValid) {
          Logger.error("Schema validation failed", {
            errors: validation.errors,
          });
        }

        Logger.info("Tag with multiple spaces created successfully", {
          tagName: spaceTag.name,
        });

        createdTagNames.push(spaceTag.name);
      },
      20000
    );

    it(
      "GET - Verify all special character tags exist",
      async () => {
        // Crear todos los tags primero
        for (const tagData of specialCharTags) {
          await tagsService.createTag(getSpaceId(), {
            tag: {
              name: tagData.name,
              tag_fg: tagData.tag_fg,
              tag_bg: tagData.tag_bg,
            },
          });
          createdTagNames.push(tagData.name);
        }

        Logger.info("Retrieving all tags to verify special character tags", {
          spaceId: getSpaceId(),
          expectedTags: specialCharTags.map((t) => t.name),
        });

        const response = await tagsService.getTags(getSpaceId());

        expect(response).toHaveProperty("tags");
        expect(Array.isArray(response.tags)).toBe(true);

        const validation = BaseSchemaValidator.validate(
          response,
          tagSchemas.tagsListResponseSchema,
          "Get Tags Response"
        );
        expect(validation.isValid).toBe(true);

        if (!validation.isValid) {
          Logger.error("Schema validation failed", {
            errors: validation.errors,
          });
        }

        Logger.info("Tags retrieved successfully", {
          totalTags: response.tags.length,
        });

        // Verificar que cada tag con caracteres especiales existe
        const foundTags = [];
        for (const testTag of specialCharTags) {
          const normalizedTagName = testTag.name.toLowerCase().trim();
          const tag = response.tags.find(
            (t) => t.name.toLowerCase().trim() === normalizedTagName
          );

          expect(tag).toBeDefined();
          expect(tag).toHaveProperty("name");
          expect(tag).toHaveProperty("tag_fg");
          expect(tag).toHaveProperty("tag_bg");

          foundTags.push({
            name: tag.name,
            description: testTag.description,
          });

          Logger.info("Special character tag verified", {
            tagName: tag.name,
            description: testTag.description,
            tag_fg: tag.tag_fg,
            tag_bg: tag.tag_bg,
          });
        }

        expect(foundTags.length).toBe(specialCharTags.length);

        Logger.info("All special character tags verified successfully", {
          verifiedCount: foundTags.length,
          expectedCount: specialCharTags.length,
          tags: foundTags,
        });
      },
      20000
    );
  }
);