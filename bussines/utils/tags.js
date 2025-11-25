export const TAGS = {
  POSITIVE: 'FP',    // Happy path tests with valid inputs
  NEGATIVE: 'FN',    // Invalid inputs and error scenarios

  PERFORMANCE: 'P',   // Response time and load tests
  SECURITY: 'S',      // Authentication, authorization, and security validations
  FUZZ: 'FF',         // Random or unexpected input testing
  RELIABILITY: 'FR'   // Consistency and stability testing
};


export const EXECUTION_TAGS = {
  SMOKE: '@smoke',                   
  FUNCIONALIDAD: '@funcionalidad',    
  NEGATIVOS: '@negativos'             
};


export const FUNCIONALIDADES = {
  FOLDERS: 'folders',
  TASKS: 'tasks',
  TAGS: 'tags',
  LISTS: 'lists',
  COMMENTS: 'comments'
};


export const funcionalidadTag = (funcionalidad) => {
  return `${EXECUTION_TAGS.FUNCIONALIDAD}:${funcionalidad}`;
};


export const buildTags = ({ smoke = false, funcionalidad, negative = false }) => {
  const tags = [];

  if (smoke) {
    tags.push(EXECUTION_TAGS.SMOKE);
  }

  if (funcionalidad) {
    tags.push(funcionalidadTag(funcionalidad));
  }

  if (negative) {
    tags.push(EXECUTION_TAGS.NEGATIVOS);
  }

  return tags;
};



export const taggedDescribe = (tags, name, fn) => {
  const tagString = Array.isArray(tags) ? tags.join(' ') : tags;
  return describe(`${tagString} ${name}`, fn);
};


export const taggedTest = (tags, name, fn) => {
  const tagString = Array.isArray(tags) ? tags.join(' ') : tags;
  return it(`${tagString} ${name}`, fn);
};


export const isNegativeCategory = (category) => {
  return category === TAGS.NEGATIVE;
};


export const isFunctionalCategory = (category) => {
  return category === TAGS.POSITIVE || category === TAGS.NEGATIVE;
};


export const isNonFunctionalCategory = (category) => {
  return [TAGS.PERFORMANCE, TAGS.SECURITY, TAGS.FUZZ, TAGS.RELIABILITY].includes(category);
};



export default TAGS;