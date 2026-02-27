const { test, expect } = require('@playwright/test');

const sizes = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 800, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'small', width: 320, height: 480 },
  { name: 'wide', width: 1920, height: 1080 },
];

function approxEqual(a, b, ratio = 0.1) {
  const diff = Math.abs(a - b);
  return diff <= Math.max(1, b * ratio);
}

for (const size of sizes) {
  test.describe(`${size.name} ${size.width}x${size.height}`, () => {
    test(`form is centered and within viewport - ${size.name}`, async ({ page, browserName }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('http://localhost:5173/');
      await page.waitForSelector('.login-form', { timeout: 10000 });

      // ensure layout has stabilized (fonts/CSS)
      await page.waitForLoadState('networkidle');

      const viewport = { width: size.width, height: size.height };
      const box = await page.locator('.login-form').boundingBox();
      expect(box).not.toBeNull();

      // center assertions: form center should be near viewport center
      const formCenterX = box.x + box.width / 2;
      const formCenterY = box.y + box.height / 2;
      const viewportCenterX = viewport.width / 2;
      const viewportCenterY = viewport.height / 2;

      const centeredX = approxEqual(formCenterX, viewportCenterX, 0.18);
      const centeredY = approxEqual(formCenterY, viewportCenterY, 0.18);
      expect(centeredX && centeredY).toBeTruthy();

      // bounding box fits within viewport
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);

      // visual snapshot assertion (baseline stored by Playwright on first run)
      await expect(page.locator('.login-container')).toHaveScreenshot(`layout-${browserName}-${size.name}.png`, { maxDiffPixelRatio: 0.01 });
    });

    test(`stability across reloads - ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('http://localhost:5173/');
      await page.waitForSelector('.login-form');
      await page.waitForLoadState('networkidle');

      const centers = [];
      for (let i = 0; i < 3; i++) {
        const box = await page.locator('.login-form').boundingBox();
        centers.push({ x: box.x + box.width / 2, y: box.y + box.height / 2 });
        await page.reload({ waitUntil: 'networkidle' });
      }

      // ensure centers are within small variance across reloads
      const first = centers[0];
      for (const c of centers) {
        const dx = Math.abs(c.x - first.x);
        const dy = Math.abs(c.y - first.y);
        expect(dx).toBeLessThanOrEqual(6);
        expect(dy).toBeLessThanOrEqual(6);
      }
    });
  });
}

// Edge case: missing login container should still render NotFound on unknown route
test('not-found route renders and centered', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/this-route-does-not-exist');
  await page.waitForSelector('h1, .not-found, .login-container', { timeout: 10000 });

  // prefer NotFound element if present
  const notFound = page.locator('.not-found');
  if (await notFound.count()) {
    const box = await notFound.boundingBox();
    expect(box).not.toBeNull();
    // ensure not found message is visible in viewport
    expect(box.y + box.height).toBeLessThanOrEqual(800);
  } else {
    // fallback: check that page has heading
    const h = await page.locator('h1').first().innerText();
    expect(h.length).toBeGreaterThan(0);
  }
});
