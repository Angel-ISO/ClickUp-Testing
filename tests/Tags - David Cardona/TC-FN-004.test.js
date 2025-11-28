import 'dotenv/config';
import TagsApiService from '../../bussines/apiServices/tagsApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import tagSchemas from '../../bussines/schemaValidators/tagSchemas.js';
import Logger from '../../core/logger.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';

const tagsService = new TagsApiService();

describe('TC-FN-004 - Verify error handling when tag name is missing', () => {
  
  beforeAll(async () => {
    await setupClickUpEnvironment();
  });

  it('POST - Missing Name should return error 400', async () => {
    const invalidTagData = {
      tag: {
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    Logger.info('Attempting to create tag without name (should fail)', { 
      spaceId: getSpaceId() 
    });

    let errorResponse;

    try {
      await tagsService.createTag(getSpaceId(), invalidTagData);
      expect(true).toBe(false);
    } catch (error) {
      errorResponse = error.response;
      Logger.info('Received expected error response', { 
        status: errorResponse?.status, 
        errorCode: errorResponse?.data?.ECODE 
      });
    }

    expect(errorResponse).toBeDefined();
    expect(errorResponse.status).toBe(400);
    expect(errorResponse.data).toBeDefined();
    expect(typeof errorResponse.data).toBe('object');

    const validation = BaseSchemaValidator.validate(
      errorResponse.data,
      tagSchemas.errorResponseSchema,
      'Error Response Schema'
    );
    expect(validation.isValid).toBe(true);

    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }

    expect(errorResponse.data.err).toBe('Tag missing from body');
    expect(errorResponse.data.ECODE).toBe('TAGS_020');
    
    Logger.info('Error response validated successfully', { 
      errorMessage: errorResponse.data.err,
      errorCode: errorResponse.data.ECODE 
    });
  });

  it('GET - Verify tag with missing name was NOT created', async () => {
    Logger.info('Fetching all tags to verify invalid tag was not created', { 
      spaceId: getSpaceId() 
    });
    
    const response = await tagsService.getTags(getSpaceId());

    expect(response).toHaveProperty('tags');
    expect(Array.isArray(response.tags)).toBe(true);

    Logger.info('Tags retrieved successfully', { 
      tagCount: response.tags.length 
    });

    const validation = BaseSchemaValidator.validate(
      response,
      tagSchemas.tagsListResponseSchema,
      'Get Tags Schema'
    );
    expect(validation.isValid).toBe(true);

    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }

    const invalidTag = response.tags.find(
      t => t.name === '' || t.name == null
    );

    expect(invalidTag).toBeUndefined();
    
    Logger.info('Verified that no invalid tags exist', { 
      invalidTagFound: invalidTag !== undefined 
    });
  });
});
