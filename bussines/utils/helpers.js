const formatDate = (date) => new Date(date).toISOString().split('T')[0];

const generateRandomId = () => Math.random().toString(36).substr(2, 9);

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeString = (str) => str.replace(/[<>\"'&]/g, '');

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const isEmpty = (obj) => obj === null || obj === undefined || obj === '';

const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export {
  formatDate,
  generateRandomId,
  validateEmail,
  sanitizeString,
  deepClone,
  isEmpty,
  capitalizeFirst,
};