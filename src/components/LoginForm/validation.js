/**
 * Validate email and password for the login form.
 * @param {string|null|undefined} email
 * @param {string|null|undefined} password
 * @returns {{isValid: boolean, errors: {email?: string, password?: string}}}
 */
export function validateLoginForm(email, password) {
  const errors = {};
  const e = email == null ? '' : String(email).trim();
  const p = password == null ? '' : String(password).trim();
  if (e.length === 0) errors.email = 'Email is required';
  if (p.length === 0) errors.password = 'Password is required';
  return { isValid: Object.keys(errors).length === 0, errors };
}

export default validateLoginForm;
