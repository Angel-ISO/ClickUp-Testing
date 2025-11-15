const Ajv = require('ajv');

const ajv = new Ajv({
  allErrors: true,
  verbose: true
});

const validateSchema = (data, schema) => {
  const validate = ajv.compile(schema);
  const isValid = validate(data);
  
  return {
    isValid,
    errors: isValid ? null : validate.errors
  };
};

const expectValidSchema = (data, schema, expect, schemaName = 'Schema') => {
  const { isValid, errors } = validateSchema(data, schema);
  
  if (!isValid) {
    console.error(`${schemaName} validation failed:`);
    console.error(JSON.stringify(errors, null, 2));
  }
  
  expect(isValid).toBe(true);
};

module.exports = {
  validateSchema,
  expectValidSchema
};