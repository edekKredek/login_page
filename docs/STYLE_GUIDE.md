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

## Accessibility Guidelines

The following accessibility checklist applies to the Login form and should be followed across the project:

- Use semantic HTML: prefer `<form>`, `<label>`, and `<input>` elements for forms.
- Ensure each `label` uses the `for` attribute that matches the input `id` (e.g., `for="login-email"`).
- Keyboard navigability: maintain logical `tab` order, include visible focus styles, and ensure interactive elements are reachable via keyboard.
- ARIA attributes: use `aria-required` on required inputs, `aria-invalid` when inputs are invalid, and `aria-describedby` to associate inputs with inline error messages.
- Programmatic error messages: surface errors in elements with `role="alert"` and `aria-live="polite"` or `assertive` depending on severity.
- Color contrast: maintain WCAG AA contrast ratios for text and interactive controls; use CSS variables for color theming.
- Touch targets: ensure interactive controls meet minimum touch target sizes (recommended `44x44` CSS pixels).
- Screen reader compatibility: do not rely on placeholder text alone; use labels; avoid hiding essential text from assistive technologies.

When updating validation logic in `src/components/LoginForm.jsx` or `src/utils/validation.js`, update this guide and the Validation Rules table accordingly.

