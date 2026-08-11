

const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

export function isRequired(value) {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined;
}

export function isValidPhone(value = '') {
  return PHONE_RE.test(value.trim());
}

export function isWithinLength(value = '', max = 255) {
  return typeof value === 'string' && value.length <= max;
}

export function isPositiveNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0;
}

export function validateForm(values, rules) {
  const errors = {};
  Object.entries(rules).forEach(([field, rule]) => {
    if (!rule.test(values[field], values)) {
      errors[field] = rule.message;
    }
  });
  return errors;
}
