const format_date = (date) => new Date(date).toISOString().split('T')[0];

const generate_random_id = () => Math.random().toString(36).substr(2, 9);

const validate_email = (email) => {
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email_regex.test(email);
};

const sanitize_string = (str) => str.replace(/[<>\"'&]/g, '');

const deep_clone = (obj) => JSON.parse(JSON.stringify(obj));

const is_empty = (obj) => obj === null || obj === undefined || obj === '';

const capitalize_first = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export {
  format_date,
  generate_random_id,
  validate_email,
  sanitize_string,
  deep_clone,
  is_empty,
  capitalize_first,
};