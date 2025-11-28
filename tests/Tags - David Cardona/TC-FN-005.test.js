import 'dotenv/config';
import TagsApiService from '../../bussines/apiServices/tagsApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import tagSchemas from '../../bussines/schemaValidators/tagSchemas.js';
import Logger from '../../core/logger.js';
import { setupClickUpEnvironment } from '../setup.test.js';

const tagsService = new TagsApiService();

describe('TC-FP-004 - Verify error handling with invalid Space ID', () => {
  const INVALIDSPACEID = 'ab193081hcbag';

  beforeAll(async () => {
    await setupClickUpEnvironment();
  });

  it('Create Tag with Invalid Space ID - Should Return 400 Error', async () => {
    const tagData = {
      tag: {
        name: 'TestTag',
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    Logger.info('create tag with invalid space ID', { 
      invalidSpaceId: INVALIDSPACEID,
      tagName: tagData.tag.name
    });

    let errorResponse;
    let statusCode;

    try {
      await tagsService.createTag(INVALIDSPACEID, tagData);
      throw new Error('Expected request to fail but it succeeded');
    } catch (error) {
      statusCode = error.response?.status;
      errorResponse = error.response?.data;
      
      Logger.info('Error response received as expected', { 
        statusCode,
        errorData: errorResponse 
      });
    }

    expect(statusCode).toBe(400);
    expect(errorResponse).toBeDefined();
    
    const validation = BaseSchemaValidator.validate(
      errorResponse,
      tagSchemas.errorResponseSchema,
      'Error Response'
    );
    expect(validation.isValid).toBe(true);

    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }

    expect(errorResponse).toHaveProperty('err');
    expect(errorResponse.err).toBe('Space ID invalid');
    expect(errorResponse).toHaveProperty('ECODE');
    expect(errorResponse.ECODE).toBe('INPUT_002');

    expect(Object.keys(errorResponse).length).toBeGreaterThan(0);

    Logger.info('Invalid space ID error validated successfully', {
      err: errorResponse.err,
      ECODE: errorResponse.ECODE
    });
  });
});