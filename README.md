# login_page

Minimal React app with client-side routing using react-router-dom v6.

Global CSS reset: `src/styles/reset.css` is imported in `src/main.jsx` and normalizes spacing and box-sizing across browsers. Component-specific styles should be imported after the reset.

Run locally:

```bash
npm install
npm run dev
```

Open the printed URL (default http://localhost:5173) and navigate to `/`.

Clicking the Login button redirects to `/success` without a full page reload.
