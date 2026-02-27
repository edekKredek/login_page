const { test } = require('@playwright/test');

const sizes = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 800, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

for (const size of sizes) {
  test.describe(`${size.name} ${size.width}x${size.height}`, () => {
    test(`login layout screenshot - ${size.name}`, async ({ page, browserName }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('http://localhost:5173/');
      await page.waitForSelector('.login-container', { timeout: 10000 });
      const path = `test-results/screenshots/login-${browserName}-${size.name}-${size.width}x${size.height}.png`;
      await page.screenshot({ path, fullPage: true });
      console.log('Saved screenshot:', path);
    });
  });
}
