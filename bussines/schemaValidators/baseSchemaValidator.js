const Ajv = require('ajv');
const Logger = require('../../core/logger');

const ajv = new Ajv({
  allErrors: true,
  verbose: true
});

class BaseSchemaValidator {
  static validate(data, schema, schemaName = 'Schema') {
    const validate = ajv.compile(schema);
    const isValid = validate(data);

    if (!isValid) {
      Logger.error(`${schemaName} validation failed:`, validate.errors);
    } else {
      Logger.info(`${schemaName} validation passed`);
    }

    return {
      isValid,
      errors: isValid ? null : validate.errors
    };
  }
}

module.exports = BaseSchemaValidator;