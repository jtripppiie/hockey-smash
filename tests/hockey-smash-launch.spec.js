const { test, expect } = require('@playwright/test');

test('root routes to Hockey Smash v2 harness', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto('/');
  await page.waitForURL(/dev\/hockey-smash-v2\.html$/);
  await expect(page.locator('h1')).toHaveText('Hockey Smash v2 Dev Harness');
  await expect(page.locator('#v2-canvas')).toBeVisible();
  await expect(page.locator('#v2-splash')).toBeVisible();
  await expect(page.locator('#v2-fullscreen')).toBeVisible();

  const globals = await page.evaluate(() => ({
    world: Boolean(window.HOCKEY_SMASH_WORLD_V2),
    renderer: Boolean(window.HOCKEY_SMASH_RENDERER_V2),
  }));
  expect(globals).toEqual({ world: true, renderer: true });
  expect(consoleErrors).toEqual([]);
});

test('v2 start screen applies name, character, controls, and movement', async ({ page }) => {
  await page.goto('/dev/hockey-smash-v2.html');
  await page.fill('#v2-player-name', 'Jamie');
  await page.click('[data-character="sofie"]');
  await page.click('#v2-start');

  await expect(page.locator('#v2-game-frame')).toHaveClass(/is-playing/);
  await expect(page.locator('.v2-controls')).toBeVisible();

  const before = await page.locator('#v2-readout').textContent();
  expect(before).toContain('character: sofie');
  expect(before).toContain('name: Jamie');

  await page.keyboard.down('KeyD');
  await page.waitForTimeout(250);
  await page.keyboard.up('KeyD');
  await page.keyboard.press('KeyF');
  await page.waitForTimeout(250);

  const after = await page.locator('#v2-readout').textContent();
  expect(after).toContain('character: sofie');
  expect(after).toContain('name: Jamie');
  expect(await page.locator('[data-action="stick"]').count()).toBe(1);

  const markerState = await page.evaluate(() => {
    const markerCount = window.HOCKEY_SMASH_V2_DEV.spawnSalmon();
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    const marker = world.entities.find((entity) => entity && entity.type === 'salmonMarker');
    return {
      markerCount,
      nonContact: Boolean(marker?.nonContact),
      y: marker?.y,
    };
  });
  expect(markerState.markerCount).toBeGreaterThan(0);
  expect(markerState.nonContact).toBe(true);
  expect(markerState.y).toBeGreaterThan(450);

  await page.waitForTimeout(300);
  const environmentState = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    return {
      clock: world.environment.clock,
      scrollX: world.environment.scrollX,
      cycleSeconds: world.environment.cycleSeconds,
    };
  });
  expect(environmentState.clock).toBeGreaterThan(0);
  expect(environmentState.scrollX).toBeGreaterThan(0);
  expect(environmentState.cycleSeconds).toBe(96);

  const projectileState = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    world.player.facing = -1;
    const projectile = window.HOCKEY_SMASH_V2_DEV.fireProjectile();
    return {
      facing: world.player.facing,
      vx: projectile?.vx || 0,
      x: projectile?.x || 0,
      playerRight: world.player.x + world.player.width,
    };
  });
  expect(projectileState.facing).toBe(-1);
  expect(projectileState.vx).toBeGreaterThan(0);
  expect(projectileState.x).toBeGreaterThanOrEqual(projectileState.playerRight - 20);
});

test('v2 mobile splash and controls stay inside the play frame', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/dev/hockey-smash-v2.html');

  const splashFits = await page.evaluate(() => {
    const splash = document.querySelector('#v2-splash').getBoundingClientRect();
    const content = document.querySelector('.v2-splash__content').getBoundingClientRect();
    return content.width <= splash.width && content.height <= splash.height && document.documentElement.scrollWidth <= window.innerWidth;
  });
  expect(splashFits).toBe(true);

  await page.click('#v2-start');
  await page.waitForTimeout(250);

  const controlsFit = await page.evaluate(() => {
    const frame = document.querySelector('#v2-game-frame').getBoundingClientRect();
    const controls = document.querySelector('.v2-controls').getBoundingClientRect();
    return controls.left >= frame.left && controls.right <= frame.right && controls.bottom <= frame.bottom;
  });
  expect(controlsFit).toBe(true);
});

test('v2 dry run covers both players and all cast entity types', async ({ page }) => {
  const characterRuns = [
    { character: 'daniel', name: 'Daniel' },
    { character: 'sofie', name: 'Sofie' },
  ];

  for (const run of characterRuns) {
    await page.goto('/dev/hockey-smash-v2.html');
    await page.fill('#v2-player-name', run.name);
    if (run.character === 'sofie') await page.click('[data-character="sofie"]');
    await page.click('#v2-start');

    const dryRunState = await page.evaluate(() => {
      const World = window.HOCKEY_SMASH_WORLD_V2;
      const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
      const groundY = World.GROUND_Y;

      World.advancePhase(world, World.PHASES.ENCOUNTERS);
      window.HOCKEY_SMASH_V2_DEV.spawnSalmon();
      world.entities.push(World.createMom(world, { x: 70 }));
      world.entities.push(World.createCameo(world, 'alaskanBoy', { x: 170, vx: 0 }));
      world.entities.push(World.createCameo(world, 'alaskanGirl', { x: 250, vx: 0 }));
      world.entities.push(World.createEntity(world, 'dad', {
        sprite: 'dad',
        x: 340,
        y: groundY - 100,
        width: 92,
        height: 100,
        hp: 4,
        bubble: 'Dry run dad',
      }));
      world.entities.push(World.createEntity(world, 'danceInstructor', {
        sprite: 'danceInstructor',
        x: 430,
        y: groundY - 100,
        width: 92,
        height: 100,
        hp: 3,
        bubble: 'Dry run dance',
      }));
      world.entities.push(World.createEntity(world, 'bear', {
        sprite: 'bear',
        x: 630,
        y: groundY - 84,
        width: 96,
        height: 84,
        hp: 2,
      }));
      world.entities.push(World.createEntity(world, 'moose', {
        sprite: 'moose',
        x: 750,
        y: groundY - 92,
        width: 112,
        height: 92,
        hp: 3,
      }));
      world.entities.push(World.createEntity(world, 'projectile', {
        sprite: 'stick',
        x: world.player.x + world.player.width,
        y: world.player.y + 42,
        width: 28,
        height: 18,
        ttl: 0.9,
        nonContact: true,
      }));

      return {
        player: world.player.character,
        types: world.entities.map((entity) => entity.type).sort(),
      };
    });

    expect(dryRunState.player).toBe(run.character);
    expect(dryRunState.types).toEqual(expect.arrayContaining([
      'alaskanBoy',
      'alaskanGirl',
      'bear',
      'dad',
      'danceInstructor',
      'mom',
      'moose',
      'projectile',
      'salmon',
      'salmonMarker',
    ]));

    await page.waitForTimeout(250);
    const canvasState = await page.evaluate(() => {
      const canvas = document.querySelector('#v2-canvas');
      const ctx = canvas.getContext('2d');
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let litPixels = 0;
      for (let index = 0; index < pixels.length; index += 16) {
        if (pixels[index] || pixels[index + 1] || pixels[index + 2]) litPixels += 1;
      }
      return {
        litPixels,
        readout: document.querySelector('#v2-readout').textContent,
      };
    });
    expect(canvasState.litPixels).toBeGreaterThan(1000);
    expect(canvasState.readout).toContain(`character: ${run.character}`);
  }
});
