import 'dotenv/config';
import TagsApiService from '../../bussines/apiServices/tagsApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import tagSchemas from '../../bussines/schemaValidators/tagSchemas.js';
import Logger from '../../core/logger.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';

const tagsService = new TagsApiService();

describe('TC-FP-002 - Verify successful update of an existing Space Tag', () => {
  const createdTagNames = [];
  let originalTagName;

  beforeAll(async () => {
    await setupClickUpEnvironment();
  });

  afterEach(async () => {
    for (const tagName of createdTagNames) {
      try {
        await tagsService.delete_tag(getSpaceId(), tagName);
        Logger.info('Tag cleaned up successfully', { tagName });
      } catch (error) {
        Logger.warn('Cleanup failed for tag', { 
          tagName, 
          error: error.message 
        });
      }
    }
    createdTagNames.length = 0;
    originalTagName = null;
  });

  it('Create Tag - Initial Tag for Update Test', async () => {
    const tagData = {
      tag: {
        name: 'UpdateTestTag',
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    Logger.info('Creating tag for update test', { 
      tagName: tagData.tag.name,
      spaceId: getSpaceId()
    });

    const response = await tagsService.create_tag(getSpaceId(), tagData);

    expect(response).toBeDefined();
    expect(typeof response).toBe('object');
    expect(response).toEqual({});
    expect(Object.keys(response).length).toBe(0);

    const validation = BaseSchemaValidator.validate(
      response,
      tagSchemas.emptyBodyResponseSchema,
      'Create Tag Response'
    );
    expect(validation.isValid).toBe(true);

    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }

    Logger.info('Tag created successfully', { 
      tagName: tagData.tag.name,
      tag_fg: tagData.tag.tag_fg,
      tag_bg: tagData.tag.tag_bg
    });

    originalTagName = tagData.tag.name;
    createdTagNames.push(tagData.tag.name);
  });

  it('Get Tags - Verify Initial Tag Creation', async () => {
    const tagData = {
      tag: {
        name: 'UpdateTestTag',
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    await tagsService.create_tag(getSpaceId(), tagData);
    originalTagName = tagData.tag.name;
    createdTagNames.push(tagData.tag.name);

    Logger.info('Retrieving tags to verify initial creation', { 
      spaceId: getSpaceId() 
    });

    const response = await tagsService.get_tags(getSpaceId());

    expect(response).toHaveProperty('tags');
    expect(Array.isArray(response.tags)).toBe(true);

    const validation = BaseSchemaValidator.validate(
      response,
      tagSchemas.tagsListResponseSchema,
      'Get Tags Response'
    );
    expect(validation.isValid).toBe(true);

    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }

    const normalizedTagName = tagData.tag.name.toLowerCase().trim();
    const tag = response.tags.find(
      t => t.name.toLowerCase().trim() === normalizedTagName
    );

    expect(tag).toBeDefined();
    expect(tag).toHaveProperty('name');
    expect(tag).toHaveProperty('tag_fg');
    expect(tag).toHaveProperty('tag_bg');

    Logger.info('Initial tag verified in tags list', { 
      tagName: tag.name,
      tag_fg: tag.tag_fg,
      tag_bg: tag.tag_bg
    });
  });

  it('Update Tag - Change Tag Colors', async () => {
    const initialTagData = {
      tag: {
        name: 'UpdateTestTag',
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    await tagsService.create_tag(getSpaceId(), initialTagData);
    originalTagName = initialTagData.tag.name;
    createdTagNames.push(initialTagData.tag.name);

    const updatedTagData = {
      tag: {
        name: 'UpdateTestTag',
        tag_fg: '#000000',
        tag_bg: '#FF0000'
      }
    };

    Logger.info('Updating tag colors', { 
      tagName: updatedTagData.tag.name,
      oldFg: initialTagData.tag.tag_fg,
      oldBg: initialTagData.tag.tag_bg,
      newFg: updatedTagData.tag.tag_fg,
      newBg: updatedTagData.tag.tag_bg
    });

    const response = await tagsService.update_tag(
      getSpaceId(), 
      originalTagName, 
      updatedTagData
    );

    expect(response).toBeDefined();
    expect(typeof response).toBe('object');
    expect(response).toEqual({});
    expect(Object.keys(response).length).toBe(0);

    const validation = BaseSchemaValidator.validate(
      response,
      tagSchemas.emptyBodyResponseSchema,
      'Update Tag Response'
    );
    expect(validation.isValid).toBe(true);

    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }

    Logger.info('Tag updated successfully', { 
      tagName: updatedTagData.tag.name 
    });
  });

  it('Get Tags - Verify Tag Update', async () => {
    const initialTagData = {
      tag: {
        name: 'UpdateTestTag',
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    await tagsService.create_tag(getSpaceId(), initialTagData);
    originalTagName = initialTagData.tag.name;
    createdTagNames.push(initialTagData.tag.name);

    const updatedTagData = {
      tag: {
        name: 'UpdateTestTag',
        tag_fg: '#000000',
        tag_bg: '#FF0000'
      }
    };

    await tagsService.update_tag(
      getSpaceId(), 
      originalTagName, 
      updatedTagData
    );

    Logger.info('Retrieving tags to verify update', { 
      spaceId: getSpaceId(),
      tagName: updatedTagData.tag.name
    });

    const response = await tagsService.get_tags(getSpaceId());

    expect(response).toHaveProperty('tags');
    expect(Array.isArray(response.tags)).toBe(true);

    const validation = BaseSchemaValidator.validate(
      response,
      tagSchemas.tagsListResponseSchema,
      'Get Tags Response'
    );
    expect(validation.isValid).toBe(true);

    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }

    const normalizedTagName = updatedTagData.tag.name.toLowerCase().trim();
    const tag = response.tags.find(
      t => t.name.toLowerCase().trim() === normalizedTagName
    );

    expect(tag).toBeDefined();
    expect(tag).toHaveProperty('tag_fg');
    expect(tag).toHaveProperty('tag_bg');
    expect(tag.tag_fg.toUpperCase()).toBe(updatedTagData.tag.tag_fg.toUpperCase());
    expect(tag.tag_bg.toUpperCase()).toBe(updatedTagData.tag.tag_bg.toUpperCase());

    Logger.info('Tag update verified successfully', { 
      tagName: tag.name,
      tag_fg: tag.tag_fg,
      tag_bg: tag.tag_bg,
      expectedFg: updatedTagData.tag.tag_fg,
      expectedBg: updatedTagData.tag.tag_bg
    });
  });

  it('Delete Tag - Cleanup After Update Test', async () => {
    const tagData = {
      tag: {
        name: 'UpdateTestTag',
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    await tagsService.create_tag(getSpaceId(), tagData);
    originalTagName = tagData.tag.name;
    createdTagNames.push(tagData.tag.name);

    Logger.info('Deleting tag after update test', { 
      tagName: tagData.tag.name 
    });

    const deleteResponse = await tagsService.delete_tag(
      getSpaceId(), 
      tagData.tag.name
    );

    expect(deleteResponse).toBeDefined();
    expect(typeof deleteResponse).toBe('object');
    expect(deleteResponse).toEqual({});

    const validation = BaseSchemaValidator.validate(
      deleteResponse,
      tagSchemas.emptyBodyResponseSchema,
      'Delete Tag Response'
    );
    expect(validation.isValid).toBe(true);

    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }

    Logger.info('Tag deleted successfully', { 
      tagName: tagData.tag.name 
    });

    const index = createdTagNames.indexOf(tagData.tag.name);
    if (index > -1) {
      createdTagNames.splice(index, 1);
    }
  });
});
