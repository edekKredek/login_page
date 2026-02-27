# login_page

Minimal React app with client-side routing using react-router-dom v6.

Global CSS reset: `src/styles/reset.css` is imported in `src/main.jsx` and normalizes spacing and box-sizing across browsers. Component-specific styles should be imported after the reset.

## Responsive Design Implementation

### Responsive Strategy

We follow a mobile-first approach: styles are authored for small screens first, then progressively enhanced using media queries for larger viewports. Layouts are primarily built using CSS Flexbox and Grid to provide flexible, content-driven arrangements that adapt across device sizes.

### CSS Techniques

Use Flexbox or Grid for primary layout and media queries for breakpoint adjustments. Example mobile-first CSS:

```css
.login-container {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 1rem;
	width: 100%;
	box-sizing: border-box;
}

@media (min-width: 600px) {
	.login-container {
		max-width: 600px;
		margin: 0 auto;
		flex-direction: row; /* adjust layout for larger screens */
	}
}

@media (min-width: 1024px) {
	.login-container {
		max-width: 720px;
	}
}
```

### Validation Rules

- Required fields: ensure email and password are non-empty after trimming.
- Pattern matching: validate email format with a standard regex and constrain password characters if needed.
- Length constraints: enforce minimum and maximum lengths for inputs on the client and server.
- Error reporting: surface per-field validation messages and provide an assertive live region for form-level errors.

Example JavaScript validation snippet:

```javascript
function isLoginFormValid(email, password) {
	if (email == null || password == null) return false;
	const e = String(email).trim();
	const p = String(password).trim();
	return e.length > 0 && p.length > 0;
}
```

### Accessibility Considerations

- ARIA attributes: use `aria-describedby` for linking inputs to error messages, `aria-invalid` for invalid fields, and `role="alert"` for assertive error announcements.
- Focus management: move focus to the first invalid field on submit and ensure keyboard users can access all interactive elements.
- Color contrast: follow WCAG contrast ratios for text and controls; rely on CSS variables for theme colors to make it easy to audit and adjust contrast.

Example ARIA usage:

```html
<label for="login-email">Email</label>
<input id="login-email" name="email" aria-describedby="email-error" aria-required="true" />
<div id="email-error" role="alert" aria-live="assertive">Please enter a valid email.</div>
```

Run locally:

```bash
npm install
npm run dev
```

Open the printed URL (default http://localhost:5173) and navigate to `/`.

Clicking the Login button redirects to `/success` without a full page reload.

### Accessibility Checklist

The login form implements the following accessibility features (see `src/components/LoginForm.jsx`):

- Use of semantic HTML elements: `form`, `label`, `input`.
- Proper `for` attribute linking labels to inputs (e.g., `label[for="login-email"]`).
- Keyboard navigability: tab order, visible focus indicators, and `tabindex` usage where appropriate.
- ARIA attributes: `aria-required`, `aria-invalid`, and `aria-describedby` for error associations.
- Clear, programmatic error messages surfaced via elements with `role="alert"` and `aria-live`.
- Sufficient color contrast following WCAG AA guidelines; use CSS variables to manage theme colors.
- Responsive touch targets (minimum recommended target size `44x44` pixels for touch controls).
- Screen reader compatibility: avoid hidden text for meaningful content; use accessible placeholders and labels.

Reference: `docs/STYLE_GUIDE.md#validation-rules` and `src/components/LoginForm.jsx` for implementation details.

For a detailed, canonical list of validation rules and accessibility notes, see the Validation Rules section in the project style guide: [docs/STYLE_GUIDE.md#validation-rules](docs/STYLE_GUIDE.md#validation-rules).

<!-- COVERAGE:START -->
## Test Coverage

| Metric | Coverage |
|---|---:|
| Lines | 48.64% |
| Statements | 47.82% |
| Functions | 62.5% |
| Branches | 47.91% |

_Last updated: 2026-02-26T15:35:45.787Z_
<!-- COVERAGE:END -->

## Environment Variables

- `VITE_API_BASE_URL`: Base URL for API requests used by the client during development. Default: `http://localhost:4000`.

Store additional environment overrides in a local `.env` file at the project root. Vite exposes variables prefixed with `VITE_` to the client.
