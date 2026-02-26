import { validateLoginForm } from '../validation';

describe('validateLoginForm', () => {
  test('empty email and password', () => {
    const result = validateLoginForm('', '');
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBeDefined();
    expect(result.errors.password).toBeDefined();
  });

  test('empty email only', () => {
    const result = validateLoginForm('', 'secret');
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Email is required');
    expect(result.errors.password).toBeUndefined();
  });

  test('empty password only', () => {
    const result = validateLoginForm('user@example.com', '');
    expect(result.isValid).toBe(false);
    expect(result.errors.password).toBe('Password is required');
    expect(result.errors.email).toBeUndefined();
  });

  test('both fields filled', () => {
    const result = validateLoginForm('user@example.com', 'secret');
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});
