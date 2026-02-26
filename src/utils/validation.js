/**
 * Validate login form inputs.
 * @param {string|null|undefined} email - The email input value
 * @param {string|null|undefined} password - The password input value
 * @returns {boolean} True when both email and password are non-empty after trimming
 */
function isLoginFormValid(email, password) {
  if (email === null || email === undefined) return false;
  if (password === null || password === undefined) return false;
  const e = String(email).trim();
  const p = String(password).trim();
  return e.length > 0 && p.length > 0;
}

module.exports = { isLoginFormValid };
