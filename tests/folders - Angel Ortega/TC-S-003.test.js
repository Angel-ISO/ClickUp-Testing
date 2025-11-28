import 'dotenv/config';
import FoldersApiService from '../../bussines/apiServices/foldersApiService.js';
import BaseSchemaValidator from '../../bussines/schemaValidators/baseSchemaValidator.js';
import folderSchemas from '../../bussines/schemaValidators/folderSchemas.js';
import { setupClickUpEnvironment, getSpaceId } from '../setup.test.js';
import { taggedDescribe, buildTags, FUNCIONALIDADES } from '../../bussines/utils/tags.js';

const foldersService = new FoldersApiService();

taggedDescribe(
    buildTags({ smoke: true, funcionalidad: FUNCIONALIDADES.FOLDERS }),
    'TC-S-003 - Verify that folder creation endpoint requires valid authentication token',
    () => {
        beforeAll(async () => {
            await setupClickUpEnvironment();
        });

        it('Create Folder - No Auth Token', async () => {
            try {
                await foldersService.createFolderWithCustomAuth(getSpaceId(), {
                    name: 'Test Folder'
                }, null);
                fail('Expected request to fail with 401');
            } catch (error) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toHaveProperty('err');

                const errorText = error.response.data.err.toLowerCase();
                expect(
                    errorText.includes('token') ||
                    errorText.includes('auth') ||
                    errorText.includes('unauthorized')
                ).toBe(true);

                const validation = BaseSchemaValidator.validate(
                    error.response.data,
                    folderSchemas.errorResponseSchema,
                    'Error Response'
                );
                expect(validation.isValid).toBe(true);
            }
        });

        it('Create Folder - Invalid Token', async () => {
            try {
                await foldersService.createFolderWithCustomAuth(getSpaceId(), {
                    name: 'Test Folder'
                }, 'Bearer invalid_token_12345_this_is_not_real');
                fail('Expected request to fail with 401');
            } catch (error) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toHaveProperty('err');

                const validation = BaseSchemaValidator.validate(
                    error.response.data,
                    folderSchemas.errorResponseSchema,
                    'Error Response'
                );
                expect(validation.isValid).toBe(true);
            }
        });

        it('Get Folders - No Auth Token', async () => {
            try {
                await foldersService.getFoldersWithCustomAuth(getSpaceId(), null);
                fail('Expected request to fail with 401');
            } catch (error) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toHaveProperty('err');

                const validation = BaseSchemaValidator.validate(
                    error.response.data,
                    folderSchemas.errorResponseSchema,
                    'Error Response'
                );
                expect(validation.isValid).toBe(true);
            }
        });

        it('Update Folder - No Auth Token', async () => {
            try {
                await foldersService.updateFolderWithCustomAuth('901314763847', {
                    name: 'Updated Name'
                }, null);
                fail('Expected request to fail with 401');
            } catch (error) {
                expect(error.response.status).toBe(401);
                expect(error.response.data).toHaveProperty('err');

                const validation = BaseSchemaValidator.validate(
                    error.response.data,
                    folderSchemas.errorResponseSchema,
                    'Error Response'
                );
                expect(validation.isValid).toBe(true);
            }
        });
    });
