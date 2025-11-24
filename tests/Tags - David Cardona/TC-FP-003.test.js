import 'dotenv/config';
import TagsApiService from '../../bussines/apiServices/tagsApiService.js';
import TasksApiService from '../../bussines/apiServices/tasksApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import tagSchemas from '../../bussines/schemaValidators/tagSchemas.js';
import Logger from '../../core/logger.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';

const tagsService = new TagsApiService();
const tasksService = new TasksApiService();

describe('TC-FP-003 - Verify adding and removing tags from tasks', () => {
  const createdTagNames = [];
  let taskId = null;

  beforeAll(async () => {
    await setupClickUpEnvironment();
    Logger.info('Obtaining task from space', { spaceId: getSpaceId() });
    const tasks = await tasksService.get_tasks_by_space(getSpaceId());
    
    if (!tasks || !tasks.tasks || tasks.tasks.length === 0) {
      throw new Error('No tasks found in space.');
    }
    
    taskId = tasks.tasks[0].id;
    Logger.info('Task obtained successfully', { taskId });
  });

  afterEach(async () => {
    for (const tagName of createdTagNames) {
      try {
        if (taskId) {
          try {
            await tagsService.remove_tag_from_task(taskId, tagName);
          } catch (e) {
            Logger.warn('Tag already removed from task', { tagName });
          }
        }

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
  });

  it('Create Tag - Initial Tag for Task Test', async () => {
    const tagData = {
      tag: {
        name: 'David Cardona',
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    Logger.info('Creating tag for task test', { 
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
    
    createdTagNames.push(tagData.tag.name);
  });

  it('Get Tags - Verify Tag Exists in Space', async () => {
    const tagData = {
      tag: {
        name: 'David Cardona',
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    await tagsService.create_tag(getSpaceId(), tagData);
    createdTagNames.push(tagData.tag.name);

    Logger.info('Retrieving tags to verify creation', { 
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

    Logger.info('Tag verified in space tags list', { 
      tagName: tag.name,
      tag_fg: tag.tag_fg,
      tag_bg: tag.tag_bg
    });
  });

  it('Add Tag to Task', async () => {
    const tagData = {
      tag: {
        name: 'David Cardona',
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    await tagsService.create_tag(getSpaceId(), tagData);
    createdTagNames.push(tagData.tag.name);

    Logger.info('Adding tag to task', { 
      taskId, 
      tagName: tagData.tag.name 
    });

    const response = await tagsService.add_tag_to_task(taskId, tagData.tag.name);
    
    expect(response).toBeDefined();
    expect(typeof response).toBe('object');
    expect(response).toEqual({});
    expect(Object.keys(response).length).toBe(0);
    
    const validation = BaseSchemaValidator.validate(
      response,
      tagSchemas.emptyBodyResponseSchema,
      'Add Tag to Task Response'
    );
    expect(validation.isValid).toBe(true);

    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }

    Logger.info('Tag added to task successfully', { 
      taskId,
      tagName: tagData.tag.name
    });
  });

  it('Get Task - Verify Tag in Task Details', async () => {
    const tagData = {
      tag: {
        name: 'David Cardona',
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    await tagsService.create_tag(getSpaceId(), tagData);
    createdTagNames.push(tagData.tag.name);
    await tagsService.add_tag_to_task(taskId, tagData.tag.name);

    Logger.info('Retrieving task to verify tag', { taskId });

    const response = await tasksService.get_task(taskId);
    
    const validation = BaseSchemaValidator.validate(
      response,
      tagSchemas.taskResponseSchema,
      'Get Task Response'
    );
    expect(validation.isValid).toBe(true);

    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }

    const taskTags = response.tags || [];
    const normalizedTagName = tagData.tag.name.toLowerCase().trim();
    const tag = taskTags.find(
      t => t.name.toLowerCase().trim() === normalizedTagName
    );
    
    expect(tag).toBeDefined();
    expect(tag).toHaveProperty('name');
    expect(tag).toHaveProperty('tag_fg');
    expect(tag).toHaveProperty('tag_bg');

    Logger.info('Tag verified in task details', { 
      taskId,
      tagName: tag.name,
      tag_fg: tag.tag_fg,
      tag_bg: tag.tag_bg
    });
  });

  it('Remove Tag from Task', async () => {
    const tagData = {
      tag: {
        name: 'David Cardona',
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    await tagsService.create_tag(getSpaceId(), tagData);
    createdTagNames.push(tagData.tag.name);
    await tagsService.add_tag_to_task(taskId, tagData.tag.name);

    Logger.info('Removing tag from task', { 
      taskId, 
      tagName: tagData.tag.name 
    });

    const response = await tagsService.remove_tag_from_task(taskId, tagData.tag.name);
    
    expect(response).toBeDefined();
    expect(typeof response).toBe('object');
    expect(response).toEqual({});
    expect(Object.keys(response).length).toBe(0);
    
    const validation = BaseSchemaValidator.validate(
      response,
      tagSchemas.emptyBodyResponseSchema,
      'Remove Tag from Task Response'
    );
    expect(validation.isValid).toBe(true);

    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }

    Logger.info('Tag removed from task successfully', { 
      taskId,
      tagName: tagData.tag.name
    });
  });

  it('Get Task - Verify Tag Removed', async () => {
    const tagData = {
      tag: {
        name: 'David Cardona',
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    await tagsService.create_tag(getSpaceId(), tagData);
    createdTagNames.push(tagData.tag.name);
    await tagsService.add_tag_to_task(taskId, tagData.tag.name);
    await tagsService.remove_tag_from_task(taskId, tagData.tag.name);

    Logger.info('Verifying tag removed from task', { taskId });

    const response = await tasksService.get_task(taskId);
    
    const validation = BaseSchemaValidator.validate(
      response,
      tagSchemas.taskResponseSchema,
      'Get Task Response'
    );
    expect(validation.isValid).toBe(true);

    if (!validation.isValid) {
      Logger.error('Schema validation failed', { errors: validation.errors });
    }

    const taskTags = response.tags || [];
    const normalizedTagName = tagData.tag.name.toLowerCase().trim();
    const tag = taskTags.find(
      t => t.name.toLowerCase().trim() === normalizedTagName
    );
    
    expect(tag).toBeUndefined();

    Logger.info('Tag removal verified successfully', { 
      taskId,
      tagName: tagData.tag.name,
      tagsRemaining: taskTags.length
    });
  });

  it('Delete Tag - Cleanup After Task Test', async () => {
    const tagData = {
      tag: {
        name: 'David Cardona',
        tag_fg: '#FFFFFF',
        tag_bg: '#0000FF'
      }
    };

    await tagsService.create_tag(getSpaceId(), tagData);
    createdTagNames.push(tagData.tag.name);

    Logger.info('Deleting tag after task test', { 
      tagName: tagData.tag.name 
    });

    const response = await tagsService.delete_tag(getSpaceId(), tagData.tag.name);

    expect(response).toBeDefined();
    expect(typeof response).toBe('object');
    expect(response).toEqual({});

    const validation = BaseSchemaValidator.validate(
      response,
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