const { test, expect } = require('@playwright/test');

test('Hockey Smash v0.9.1 launches with overlays and continuous progression', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Hockey Slash 2');
  await expect(page.locator('#hockey-build-badge')).toContainText('Hockey Smash v0.9.1 · Build 2026-06-29.12');
  await expect(page.locator('[data-fullscreen-toggle]').first()).toBeVisible();
  await expect(page.locator('#hockey-watch')).toHaveAttribute('href', '?computerMode=1');
  await page.locator('#hockey-play').click();
  await expect(page.locator('#hockey-game')).toBeVisible({ timeout: 4000 });
  await expect(page.locator('#hockey-player-overlay')).toBeVisible();
  await expect(page.locator('.hockey-entity-layer')).toHaveCount(1);

  const version = await page.evaluate(() => window.RTA_HOCKEY_SMASH.getVersion());
  expect(version).toBe('Hockey Smash v0.9.1');

  await page.evaluate(() => {
    const state = window.RTA_HOCKEY_SMASH.getState();
    state.player.x = 822;
  });
  await page.waitForTimeout(700);
  const progressed = await page.evaluate(() => {
    const state = window.RTA_HOCKEY_SMASH.getState();
    return { x: state.player.x, travelStage: state.travelStage, time: state.time };
  });
  expect(progressed.travelStage).toBeGreaterThanOrEqual(1);
  expect(progressed.x).toBeLessThan(200);
  expect(progressed.time).toBeGreaterThanOrEqual(10.5);

  await page.evaluate(() => {
    const state = window.RTA_HOCKEY_SMASH.getState();
    state.entities.push({ type: 'salmon', x: 340, y: 190, width: 74, height: 42, vx: 0, hp: 1 });
    state.entities.push({ type: 'bear', x: 470, y: 360, width: 132, height: 112, vx: -1, hp: 2 });
    state.entities.push({ type: 'moose', x: 650, y: 352, width: 150, height: 120, vx: -1, hp: 3 });
  });
  await page.waitForTimeout(160);
  await expect(page.locator('.hockey-entity-overlay[data-type="salmon"]')).toHaveCount(1);
  await expect(page.locator('.hockey-entity-overlay[data-type="bear"]')).toHaveCount(1);
  await expect(page.locator('.hockey-entity-overlay[data-type="moose"]')).toHaveCount(1);

  expect(consoleErrors).toEqual([]);
});

test('Computer Play hides duplicate DOM Daniel overlay', async ({ page }) => {
  await page.goto('/?computerMode=1');
  await expect(page.locator('#hockey-build-badge')).toContainText('Hockey Smash v0.9.1 · Build 2026-06-29.12');
  await expect(page.locator('#hockey-game')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('.hockey-autoplay-panel')).toContainText('Watch mode is active');

  const computerEnabled = await page.evaluate(() => window.RTA_HOCKEY_SMASH.getState().computer.enabled);
  const version = await page.evaluate(() => window.RTA_HOCKEY_SMASH.getVersion());
  const overlayHidden = await page.locator('#hockey-player-overlay').evaluate((node) => node.hidden || getComputedStyle(node).display === 'none');

  expect(computerEnabled).toBe(true);
  expect(version).toBe('Hockey Smash v0.9.1');
  expect(overlayHidden).toBe(true);
});

test('Portrait mobile layout keeps canvas and controls separated', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('#hockey-play').click();
  await expect(page.locator('#hockey-game')).toBeVisible({ timeout: 4000 });

  const canvasBox = await page.locator('#hockey-canvas').boundingBox();
  const controlsBox = await page.locator('.hockey-controls').boundingBox();
  const version = await page.evaluate(() => window.RTA_HOCKEY_SMASH.getVersion());

  expect(version).toBe('Hockey Smash v0.9.1');
  expect(canvasBox?.y).toBeLessThan(180);
  expect(canvasBox?.height).toBeLessThan(260);
  expect(controlsBox?.y).toBeGreaterThan(canvasBox.y + canvasBox.height + 40);
});
