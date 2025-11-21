import Ajv from 'ajv';
import Logger from '../../core/logger.js';

const ajv = new Ajv({
  allErrors: true,
  verbose: true
});

class BaseSchemaValidator {
  static validate(data, schema, schemaName = 'Schema') {
    const validate = ajv.compile(schema);
    const isValid = validate(data);

    const testPath =
      typeof expect !== 'undefined' && expect.getState
        ? expect.getState().testPath || ''
        : '';

    Logger.validation(schemaName, isValid, validate.errors, testPath);

    return {
      isValid,
      errors: isValid ? null : validate.errors
    };
  }
}

export default BaseSchemaValidator;
