const { test, expect } = require('@playwright/test');

test('real computer mode completes the normal route without console errors', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto('/?computerMode=1&speed=fast');
  await expect(page.locator('#realm-computer-status')).toContainText('Status: PASSED', { timeout: 15000 });

  const report = await page.evaluate(() => window.RTA_ROADSIDE_REALM.getComputerReport());
  const state = await page.evaluate(() => window.RTA_ROADSIDE_REALM.getState());
  const sceneSignature = await page.locator('#realm-neo-view').getAttribute('data-scene-signature');

  expect(consoleErrors).toEqual([]);
  expect(report.mode).toBe('real-playthrough');
  expect(report.failed).toBe(0);
  expect(report.complete).toBe(true);
  expect(state.ending).toBe('normal');
  expect(state.counters.steps).toBeGreaterThan(10);
  expect(state.player.inventory).toContain('mapstone');
  expect(sceneSignature).toBeTruthy();
});

test('debug deep mode is clearly separate and checks deep routes', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto('/?computerMode=1&speed=fast&debugDeep=1');
  await expect(page.locator('#realm-computer-status')).toContainText('Status: PASSED', { timeout: 15000 });

  const report = await page.evaluate(() => window.RTA_ROADSIDE_REALM.getComputerReport());
  const state = await page.evaluate(() => window.RTA_ROADSIDE_REALM.getState());

  expect(consoleErrors).toEqual([]);
  expect(report.mode).toBe('debug-deep-check');
  expect(report.failed).toBe(0);
  expect(report.complete).toBe(true);
  expect(state.ending).toBe('glass');
});
