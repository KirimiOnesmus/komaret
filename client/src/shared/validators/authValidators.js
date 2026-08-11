
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export function isValidEmail(value = '') {
  return EMAIL_RE.test(value.trim());
}

export function isStrongPassword(value = '') {
  return PASSWORD_RE.test(value);
}

export function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}
