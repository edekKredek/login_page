# Style Guide

## Validation Rules

This section documents the validation rules for the Login form implemented at `src/components/LoginForm.jsx`.

| Field | Rule | Error Message | Pattern / Notes | Accessibility |
|---|---|---|---|---|
| Email (`email`) | Required; trimmed non-empty. Uses `type="email"` for HTML5 validation if supported. | `Email is required` | No custom regex in code; rely on browser `type="email"` validation. Optional recommendation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` for stricter checks. | `aria-describedby="login-email-error"` when error; `aria-invalid="true"` when invalid; `aria-required="true"`; input has `autoFocus`.
| Password (`password`) | Required; trimmed non-empty. No length constraints in client code. | `Password is required` | No pattern enforced in code. Recommend min length (e.g., 8) on server if required. | `aria-describedby="login-password-error"` when error; `aria-invalid="true"` when invalid; `aria-required="true"`.

### Notes

- Validation behavior implemented in `src/utils/validation.js` (function `isLoginFormValid(email, password)`): returns `true` when both trimmed values are non-empty. See file for the canonical implementation.
- Error messages are surfaced inline using elements with `role="alert"` and `aria-live="polite"` for field-level messages and `aria-live="assertive"` for form-level errors.
- Focus management: the form uses `autoFocus` on the email input. On submit, client-side validation sets per-field errors; consumers should move focus to the first invalid field if enhancing UX further.

### Maintenance

- When updating validation rules in `src/components/LoginForm.jsx`, update this table accordingly.
- For stricter validation (password strength, email domain checks), implement checks in `src/utils/validation.js` and surface errors via the same ARIA patterns shown above.

Reference: `src/components/LoginForm.jsx` — login form implementation and error messages.
