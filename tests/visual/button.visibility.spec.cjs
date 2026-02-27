const { test, expect } = require('@playwright/test');

const sizes = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 800, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'small', width: 320, height: 480 },
  { name: 'wide', width: 1920, height: 1080 },
];

for (const size of sizes) {
  test.describe(`${size.name} ${size.width}x${size.height}`, () => {
    test(`login button is visible and in viewport - ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('http://localhost:5173/');
      await page.waitForSelector('.login-form', { timeout: 10000 });
      await page.waitForLoadState('networkidle');

      const loginButton = page.getByRole('button', { name: /login/i });

      await expect(loginButton).toBeVisible();

      // The button starts disabled until inputs are filled.
      await expect(loginButton).toBeDisabled();

      // Ensure the button is actually within the viewport.
      const box = await loginButton.boundingBox();
      expect(box).not.toBeNull();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(size.width + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(size.height + 1);
    });

    test(`login button becomes enabled after valid input - ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('http://localhost:5173/');
      await page.waitForSelector('.login-form', { timeout: 10000 });

      await page.getByLabel(/email address/i).fill('test@example.com');
      await page.getByLabel(/password/i).fill('password123');

      const loginButton = page.getByRole('button', { name: /login/i });
      await expect(loginButton).toBeVisible();
      await expect(loginButton).toBeEnabled();
    });
  });
}
