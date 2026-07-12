const { test, expect } = require('@playwright/test');

test('root serves Hockey Smash game', async ({ page }) => {
  const consoleErrors = [];
  const requestedUrls = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('request', (request) => requestedUrls.push(request.url()));

  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Hockey Smash');
  await expect(page.locator('#v2-canvas')).toBeVisible();
  await expect(page.locator('#v2-splash')).toBeVisible();
  await expect(page.locator('#v2-splash')).toContainText('Pick your hockey player');
  await expect(page.locator('#v2-splash')).not.toContainText('runner');
  await expect(page.locator('#v2-fullscreen')).toBeVisible();

  const globals = await page.evaluate(() => ({
    world: Boolean(window.HOCKEY_SMASH_WORLD_V2),
    renderer: Boolean(window.HOCKEY_SMASH_RENDERER_V2),
    canvasWidth: document.querySelector('#v2-canvas').width,
    canvasHeight: document.querySelector('#v2-canvas').height,
  }));
  expect(globals).toEqual({
    world: true,
    renderer: true,
    canvasWidth: 1024,
    canvasHeight: 576,
  });
  expect(requestedUrls.some((url) => url.includes('hockey-smash-world-v2.js?v=2.0.1'))).toBe(true);
  expect(requestedUrls.some((url) => url.includes('hockey-smash-renderer-v2.js?v=2.0.1'))).toBe(true);
  expect(requestedUrls.some((url) => url.includes('hockey-smash-systems-v2.js?v=2.0.1'))).toBe(true);
  expect(requestedUrls.some((url) => url.includes('player-run-headless-sheet.webp'))).toBe(false);
  expect(requestedUrls.some((url) => url.includes('dad-run-sheet.webp'))).toBe(false);
  expect(requestedUrls.some((url) => url.includes('mom-run-sheet.webp'))).toBe(false);
  expect(consoleErrors).toEqual([]);
});

test('v2 start screen applies name, character, controls, and movement', async ({ page }) => {
  await page.goto('/');
  await page.fill('#v2-player-name', 'Jamie');
  await page.click('[data-character="sofie"]');
  await page.click('#v2-start');

  await expect(page.locator('#v2-game-frame')).toHaveClass(/is-playing/);
  await expect(page.locator('.v2-controls')).toBeVisible();
  await expect(page.locator('#v2-hud-score')).toContainText('Salmon');
  await expect(page.locator('#v2-health-label')).toHaveText('HP 100');

  const before = await page.locator('#v2-readout').textContent();
  expect(before).toContain('character: sofie');
  expect(before).toContain('name: Jamie');

  await page.keyboard.down('KeyD');
  await page.waitForTimeout(35);
  const rampState = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    return {
      vx: world.player.vx,
      walkSpeed: world.tuning.walkSpeed,
      groundAcceleration: world.tuning.groundAcceleration,
      maxFrameSeconds: 0.05, // the game loop caps dt at this many seconds per frame
      coyoteTimeSeconds: world.tuning.coyoteTimeSeconds,
      jumpBufferSeconds: world.tuning.jumpBufferSeconds,
      airJumps: world.tuning.airJumps,
    };
  });
  expect(rampState.vx).toBeGreaterThan(0);
  // Movement eases in instead of snapping to full speed. We check this in a
  // frame-count-independent way: reaching walkSpeed must take MORE than one
  // capped frame of acceleration. (Measuring vx after a fixed wall-clock delay
  // is flaky because slow machines fit fewer, larger frames into that window.)
  expect(rampState.walkSpeed / rampState.groundAcceleration).toBeGreaterThan(rampState.maxFrameSeconds);
  expect(rampState.vx).toBeLessThanOrEqual(rampState.walkSpeed);
  expect(rampState.coyoteTimeSeconds).toBeGreaterThan(0);
  expect(rampState.jumpBufferSeconds).toBeGreaterThan(0);
  expect(rampState.airJumps).toBe(1);

  const doubleJumpState = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    world.player.grounded = false;
    world.player.coyoteTimer = 0;
    world.player.airJumpsRemaining = 1;
    world.player.vy = 120;
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    return new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        resolve({
          vy: world.player.vy,
          airJumpsRemaining: world.player.airJumpsRemaining,
        });
      });
    });
  });
  expect(doubleJumpState.vy).toBeLessThan(0);
  expect(doubleJumpState.airJumpsRemaining).toBe(0);
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
      midnightSun: world.environment.midnightSun,
    };
  });
  expect(environmentState.clock).toBeGreaterThan(0);
  expect(environmentState.scrollX).toBeGreaterThan(0);
  expect(environmentState.cycleSeconds).toBe(240);
  expect(environmentState.midnightSun).toBe(true);

  const projectileState = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    world.player.facing = -1;
    const projectile = window.HOCKEY_SMASH_V2_DEV.fireProjectile();
    return {
      facing: world.player.facing,
      vx: projectile?.vx || 0,
      x: projectile?.x || 0,
      playerRight: world.player.x + world.player.width,
      sprite: projectile?.sprite,
      width: projectile?.width,
      height: projectile?.height,
      ttl: projectile?.ttl,
    };
  });
  expect(projectileState.facing).toBe(-1);
  expect(projectileState.vx).toBeGreaterThan(0);
  expect(projectileState.x).toBeGreaterThanOrEqual(projectileState.playerRight - 20);
  expect(projectileState.sprite).toBe('projectileShoe');
  expect(projectileState.width).toBe(40);
  expect(projectileState.height).toBe(28);
  expect(projectileState.ttl * projectileState.vx).toBeGreaterThan(1024);

  const damageState = await page.evaluate(() => {
    const World = window.HOCKEY_SMASH_WORLD_V2;
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    World.advancePhase(world, World.PHASES.ENCOUNTERS);
    world.entities.push(World.createEntity(world, 'bear', {
      sprite: 'bear',
      x: world.player.x + 18,
      y: World.GROUND_Y - 84,
      width: 96,
      height: 84,
      hp: 2,
      maxHp: 2,
      damage: 12,
      bubble: '',
    }));
    return {
      before: world.player.health,
    };
  });
  expect(damageState.before).toBe(100);
  await page.waitForTimeout(120);
  const afterDamage = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    return {
      health: world.player.health,
      hud: document.querySelector('#v2-health-label').textContent,
    };
  });
  expect(afterDamage.health).toBeLessThan(100);
  expect(afterDamage.hud).toContain(`HP ${afterDamage.health}`);

  const perfectCatchState = await page.evaluate(() => {
    const World = window.HOCKEY_SMASH_WORLD_V2;
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    World.advancePhase(world, World.PHASES.SALMON_RUN);
    world.player.x = 180;
    world.player.y = World.GROUND_Y - world.player.height;
    world.entities.push(World.createSalmon(world, {
      x: world.player.x + 26,
      y: World.GROUND_Y - 31 - 18,
      vx: 0,
      vy: 60,
    }));
    return { beforeScore: world.player.score, beforeCaught: world.salmonCaught };
  });
  expect(perfectCatchState.beforeScore).toBe(0);
  await page.waitForTimeout(90);
  const afterPerfectCatch = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    return {
      score: world.player.score,
      caught: world.salmonCaught,
      hud: document.querySelector('#v2-hud-score').textContent,
      perfectEffect: world.effects.some((effect) => String(effect.text).includes('PERFECT')),
    };
  });
  expect(afterPerfectCatch.score).toBeGreaterThanOrEqual(25);
  expect(afterPerfectCatch.caught).toBeGreaterThan(perfectCatchState.beforeCaught);
  expect(afterPerfectCatch.hud).toContain(String(afterPerfectCatch.score));
  expect(afterPerfectCatch.perfectEffect).toBe(true);

  const comboState = await page.evaluate(() => {
    const World = window.HOCKEY_SMASH_WORLD_V2;
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    world.player.x = 260;
    world.player.y = World.GROUND_Y - world.player.height;
    for (let i = 0; i < 2; i += 1) {
      world.entities.push(World.createSalmon(world, {
        x: world.player.x + 24,
        y: World.GROUND_Y - 31 - 18,
        vx: 0,
        vy: 60,
      }));
    }
    return { comboBefore: world.player.combo || 0 };
  });
  expect(comboState.comboBefore).toBeGreaterThan(0);
  await page.waitForTimeout(120);
  const afterCombo = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    return {
      combo: world.player.combo,
      comboEffect: world.effects.some((effect) => String(effect.text).includes('COMBO')),
      hud: document.querySelector('#v2-hud-score').textContent,
    };
  });
  expect(afterCombo.combo).toBeGreaterThanOrEqual(3);
  expect(afterCombo.comboEffect).toBe(true);
  expect(afterCombo.hud).toContain(`x${afterCombo.combo}`);
});

test('v2 mobile splash and controls stay inside the play frame', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

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
    const canvas = document.querySelector('#v2-canvas').getBoundingClientRect();
    const controls = document.querySelector('.v2-controls').getBoundingClientRect();
    return controls.left >= frame.left && controls.right <= frame.right && controls.top >= canvas.bottom && controls.bottom <= frame.bottom;
  });
  expect(controlsFit).toBe(true);

  const overlayGeometry = await page.evaluate(() => {
    const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    const rect = (selector) => {
      const box = document.querySelector(selector).getBoundingClientRect();
      return { left: box.left, top: box.top, right: box.right, bottom: box.bottom };
    };
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    const canvasElement = document.querySelector('#v2-canvas');
    const canvas = canvasElement.getBoundingClientRect();
    const scaleX = canvas.width / canvasElement.width;
    const scaleY = canvas.height / canvasElement.height;
    const player = {
      left: canvas.left + world.player.x * scaleX,
      top: canvas.top + world.player.y * scaleY,
      right: canvas.left + (world.player.x + world.player.width) * scaleX,
      bottom: canvas.top + (world.player.y + world.player.height) * scaleY,
    };
    const buttons = Array.from(document.querySelectorAll('.v2-control')).map((button) => {
      const box = button.getBoundingClientRect();
      return { left: box.left, top: box.top, right: box.right, bottom: box.bottom };
    });
    const hud = rect('#v2-hud');
    const fullscreen = rect('#v2-fullscreen');
    const version = rect('#v2-version-badge');

    return {
      controlsBelowPlayer: rect('.v2-controls').top >= player.bottom,
      controlsBelowCanvas: rect('.v2-controls').top >= canvas.bottom,
      buttonsClearPlayer: buttons.every((button) => !overlaps(button, player)),
      hudClearFullscreen: !overlaps(hud, fullscreen),
      hudClearVersion: !overlaps(hud, version),
    };
  });
  expect(overlayGeometry).toEqual({
    controlsBelowPlayer: true,
    controlsBelowCanvas: true,
    buttonsClearPlayer: true,
    hudClearFullscreen: true,
    hudClearVersion: true,
  });
});

test('v2 debug mode shows HUD and control safe-area bands', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?debug=1');
  await page.click('#v2-start');
  await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    world.debug.visible = true;
    world.debug.showFPS = true;
  });
  await page.waitForTimeout(80);

  const safeAreas = await page.evaluate(() => {
    const overlay = document.querySelector('#v2-safe-areas');
    const style = getComputedStyle(overlay);
    const hud = document.querySelector('.v2-safe-area--hud').getBoundingClientRect();
    const controls = document.querySelector('.v2-safe-area--controls').getBoundingClientRect();
    const frame = document.querySelector('#v2-game-frame').getBoundingClientRect();
    return {
      visible: overlay.classList.contains('is-visible') && style.display !== 'none',
      hudInsideFrame: hud.top >= frame.top && hud.bottom <= frame.bottom && hud.height > 0,
      controlsInsideFrame: controls.top >= frame.top && controls.bottom <= frame.bottom && controls.height > 0,
      controlsBelowHud: controls.top > hud.bottom,
    };
  });
  expect(safeAreas).toEqual({
    visible: true,
    hudInsideFrame: true,
    controlsInsideFrame: true,
    controlsBelowHud: true,
  });
});

test('v2 dry run covers both players and all cast entity types', async ({ page }) => {
  const characterRuns = [
    { character: 'daniel', name: 'Daniel' },
    { character: 'sofie', name: 'Sofie' },
  ];

  for (const run of characterRuns) {
    await page.goto('/');
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
      if (world.player.character === 'sofie') {
        world.entities.push(World.createEntity(world, 'danceInstructor', {
          sprite: 'danceInstructor',
          x: 430,
          y: groundY - 100,
          width: 92,
          height: 100,
          hp: 3,
          bubble: 'Dry run dance',
        }));
      }
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
      world.entities.push(World.createEntity(world, 'eagle', {
        sprite: 'eagle',
        x: 850,
        y: groundY - 126,
        width: 92,
        height: 58,
        hp: 1,
        duckable: true,
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
        cameoBubbles: world.entities
          .filter((entity) => entity.type === 'alaskanBoy' || entity.type === 'alaskanGirl')
          .map((entity) => entity.bubble),
        types: world.entities.map((entity) => entity.type).sort(),
      };
    });

    expect(dryRunState.player).toBe(run.character);
    expect(dryRunState.types).toEqual(expect.arrayContaining([
      'alaskanBoy',
      'alaskanGirl',
      'bear',
      'dad',
      'eagle',
      'mom',
      'moose',
      'projectile',
      'salmon',
      'salmonMarker',
    ]));
    if (run.character === 'sofie') {
      expect(dryRunState.types).toContain('danceInstructor');
    } else {
      expect(dryRunState.types).not.toContain('danceInstructor');
    }
    expect(dryRunState.cameoBubbles).toEqual(['Hi, you\'re cute', 'Hi, you\'re cute']);

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

test('v2 encounters gate dance instructor to Sofie and Daniel can duck eagles', async ({ page }) => {
  await page.goto('/');
  await page.click('#v2-start');

  const danielState = await page.evaluate(() => {
    const World = window.HOCKEY_SMASH_WORLD_V2;
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    World.advancePhase(world, World.PHASES.ENCOUNTERS);
    const spawned = [];
    for (let i = 0; i < 7; i += 1) {
      const entity = window.HOCKEY_SMASH_V2_DEV.spawnEncounter();
      if (entity) spawned.push({
        type: entity.type,
        bubble: entity.bubble,
        duckable: Boolean(entity.duckable),
        nonContact: Boolean(entity.nonContact),
        state: entity.state || '',
        grazeTimer: entity.grazeTimer || 0,
      });
    }
    world.player.grounded = true;
    world.player.duckActive = true;
    return {
      spawned,
      duckSprite: window.HOCKEY_SMASH_RENDERER_V2.getPlayerSpriteKey(world.player),
      warningEffects: world.effects.map((effect) => effect.text),
    };
  });
  expect(danielState.spawned.map((entity) => entity.type)).toContain('eagle');
  expect(danielState.spawned.map((entity) => entity.type)).toContain('dad');
  expect(danielState.spawned.map((entity) => entity.type)).toContain('sister');
  expect(danielState.spawned.map((entity) => entity.type)).not.toContain('danceInstructor');
  expect(danielState.spawned.some((entity) => entity.type === 'eagle' && entity.duckable)).toBe(true);
  expect(danielState.spawned.some((entity) => entity.type === 'dad' && !entity.nonContact && entity.bubble.length > 0)).toBe(true);
  expect(danielState.spawned.some((entity) => entity.type === 'bear' && entity.state === 'walking')).toBe(true);
  expect(danielState.spawned.some((entity) => entity.type === 'moose' && entity.grazeTimer > 0)).toBe(true);
  expect(danielState.warningEffects).toEqual(expect.arrayContaining(['BEAR!', 'MOOSE!', 'DUCK!']));
  expect(danielState.spawned.some((entity) => entity.bubble === 'Hi, you\'re cute')).toBe(true);
  expect(danielState.spawned.some((entity) => entity.type === 'sister' && entity.bubble === 'Go Daniel!')).toBe(true);
  expect(danielState.duckSprite).toBe('danielDuck');

  await page.goto('/');
  await page.click('[data-character="sofie"]');
  await page.click('#v2-start');
  const sofieTypes = await page.evaluate(() => {
    const World = window.HOCKEY_SMASH_WORLD_V2;
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    World.advancePhase(world, World.PHASES.ENCOUNTERS);
    const spawned = [];
    for (let i = 0; i < 7; i += 1) {
      const entity = window.HOCKEY_SMASH_V2_DEV.spawnEncounter();
      if (entity) spawned.push(entity.type);
    }
    return spawned;
  });
  expect(sofieTypes).toContain('danceInstructor');
});

test('v2 post-gate salmon timer keeps spawning and low stance avoids eagles', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-character="sofie"]');
  await page.click('#v2-start');

  const timerState = await page.evaluate(() => {
    const World = window.HOCKEY_SMASH_WORLD_V2;
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    World.advancePhase(world, World.PHASES.ENCOUNTERS);
    delete world.timers.postGateSalmon;
    return {
      before: world.timers.postGateSalmon,
      salmonBefore: world.entities.filter((entity) => entity.type === 'salmon').length,
    };
  });
  expect(timerState.before).toBeUndefined();

  await page.waitForTimeout(90);
  const afterTimer = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    return {
      timer: world.timers.postGateSalmon,
      salmonAfter: world.entities.filter((entity) => entity.type === 'salmon').length,
    };
  });
  expect(Number.isFinite(afterTimer.timer)).toBe(true);
  expect(afterTimer.salmonAfter).toBeGreaterThan(timerState.salmonBefore);

  await page.keyboard.down('Shift');
  await page.waitForTimeout(40);

  const eagleSetup = await page.evaluate(() => {
    const World = window.HOCKEY_SMASH_WORLD_V2;
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    world.entities = world.entities.filter((entity) => entity.type !== 'eagle');
    world.player.x = 180;
    world.player.y = World.GROUND_Y - world.player.height;
    world.player.grounded = true;
    world.player.health = 100;
    world.player.invulnerable = 0;
    world.entities.push(World.createEntity(world, 'eagle', {
      sprite: 'eagle',
      x: world.player.x + 12,
      y: world.player.y + 24,
      width: 92,
      height: 58,
      vx: 0,
      hp: 1,
      maxHp: 1,
      damage: 10,
      duckable: true,
    }));
    return {
      health: world.player.health,
      lowStance: Boolean(world.player.lowStance),
      slideActive: Boolean(world.player.slideActive),
    };
  });
  expect(eagleSetup).toEqual({
    health: 100,
    lowStance: true,
    slideActive: true,
  });

  await page.waitForTimeout(90);
  const whileSliding = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    return {
      health: world.player.health,
      lowStance: Boolean(world.player.lowStance),
      slideActive: Boolean(world.player.slideActive),
      eagleAlive: world.entities.some((entity) => entity.type === 'eagle' && !entity.dead),
    };
  });
  expect(whileSliding).toEqual({
    health: 100,
    lowStance: true,
    slideActive: true,
    eagleAlive: true,
  });

  await page.keyboard.up('Shift');
  await page.waitForTimeout(90);
  const afterStanding = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    return {
      health: world.player.health,
      eagleAlive: world.entities.some((entity) => entity.type === 'eagle' && !entity.dead),
    };
  });
  expect(afterStanding.health).toBeLessThan(100);
  expect(afterStanding.eagleAlive).toBe(false);
});

test('v2 paced encounters do not stack Mom or Dad cameos', async ({ page }) => {
  await page.goto('/');
  await page.click('#v2-start');

  const familyCounts = await page.evaluate(() => {
    const World = window.HOCKEY_SMASH_WORLD_V2;
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    World.advancePhase(world, World.PHASES.ENCOUNTERS);
    const spawned = [];
    for (let i = 0; i < 18; i += 1) {
      const entity = window.HOCKEY_SMASH_V2_DEV.spawnPacedEncounter();
      if (entity) spawned.push(entity.type);
    }
    return {
      spawned,
      momSpawns: spawned.filter((type) => type === 'mom').length,
      moms: world.entities.filter((entity) => entity.type === 'mom' && !entity.dead).length,
      dads: world.entities.filter((entity) => entity.type === 'dad' && !entity.dead).length,
      momTtl: world.entities.find((entity) => entity.type === 'mom')?.ttl || 0,
      momVx: world.entities.find((entity) => entity.type === 'mom')?.vx ?? null,
      dadBubble: world.entities.find((entity) => entity.type === 'dad')?.bubble || '',
      dadDamage: world.entities.find((entity) => entity.type === 'dad')?.damage || 0,
    };
  });

  expect(familyCounts.spawned).toContain('mom');
  expect(familyCounts.momSpawns).toBe(1);
  expect(familyCounts.spawned).toContain('dad');
  expect(familyCounts.moms).toBeLessThanOrEqual(1);
  expect(familyCounts.dads).toBeLessThanOrEqual(1);
  expect(familyCounts.momTtl).toBeLessThanOrEqual(4.2);
  expect(familyCounts.momVx).toBe(0);
  expect(familyCounts.dadBubble).toMatch(/\.|!|\?/);
  expect(familyCounts.dadDamage).toBeGreaterThan(0);
});

test('v2 bear stays grounded in walking state', async ({ page }) => {
  await page.goto('/');
  await page.click('#v2-start');

  const beforeBear = await page.evaluate(() => {
    const World = window.HOCKEY_SMASH_WORLD_V2;
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    World.advancePhase(world, World.PHASES.ENCOUNTERS);
    world.entities = world.entities.filter((entity) => entity.type !== 'bear');
    const bear = World.createEntity(world, 'bear', {
      sprite: 'bear',
      x: world.player.x + 140,
      y: World.GROUND_Y - 84,
      width: 96,
      height: 84,
      vx: -150,
      hp: 2,
      maxHp: 2,
      damage: 12,
      state: 'walking',
      bubble: '',
    });
    world.entities.push(bear);
    return { state: bear.state, y: bear.y };
  });
  expect(beforeBear.state).toBe('walking');

  await page.waitForTimeout(180);

  const afterBear = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    const bear = world.entities.find((entity) => entity.type === 'bear');
    return {
      state: bear?.state || null,
      y: bear?.y || 0,
      hasChargeEffect: world.effects.some((effect) => effect.text === 'CHARGE!'),
    };
  });
  expect(afterBear.state).toBe('walking');
  expect(afterBear.y).toBe(beforeBear.y);
  expect(afterBear.hasChargeEffect).toBe(false);
});

test('v2 Alaska kid cameos are once-only, timed, and dismissible', async ({ page }) => {
  await page.goto('/');
  await page.click('#v2-start');

  const cameoState = await page.evaluate(() => {
    const World = window.HOCKEY_SMASH_WORLD_V2;
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    World.advancePhase(world, World.PHASES.ENCOUNTERS);
    const first = window.HOCKEY_SMASH_V2_DEV.spawnCameo();
    const second = window.HOCKEY_SMASH_V2_DEV.spawnCameo();
    return {
      firstType: first?.type,
      secondType: second?.type || null,
      ttl: first?.ttl,
      nonContact: Boolean(first?.nonContact),
      dismissOnProjectile: Boolean(first?.dismissOnProjectile),
    };
  });

  expect(['alaskanBoy', 'alaskanGirl']).toContain(cameoState.firstType);
  expect(cameoState.secondType).toBe(null);
  expect(cameoState.ttl).toBe(5);
  expect(cameoState.nonContact).toBe(true);
  expect(cameoState.dismissOnProjectile).toBe(true);

  const boostState = await page.evaluate(() => {
    const World = window.HOCKEY_SMASH_WORLD_V2;
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    world.entities = world.entities.filter((entity) => entity.type !== 'alaskanGirl' && entity.type !== 'alaskanBoy');
    world.cast.cameoSpawned = false;
    const cameo = window.HOCKEY_SMASH_V2_DEV.spawnCameo();
    cameo.x = world.player.x + 12;
    cameo.y = World.GROUND_Y - cameo.height;
    return {
      beforeBoost: world.player.speedBoost || 0,
      cameoType: cameo.type,
    };
  });
  expect(['alaskanBoy', 'alaskanGirl']).toContain(boostState.cameoType);
  expect(boostState.beforeBoost).toBe(0);
  await page.waitForTimeout(80);
  const afterBoost = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    return {
      speedBoost: world.player.speedBoost,
      boostEffect: world.effects.some((effect) => String(effect.text).includes('BOOST')),
    };
  });
  expect(afterBoost.speedBoost).toBeGreaterThan(4);
  expect(afterBoost.boostEffect).toBe(true);

  const dismissed = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    const cameo = world.entities.find((entity) => entity.type === 'alaskanGirl' || entity.type === 'alaskanBoy');
    world.entities.push({
      id: 'test-projectile',
      type: 'projectile',
      x: cameo.x,
      y: cameo.y,
      width: cameo.width,
      height: cameo.height,
      vx: 0,
      vy: 0,
      ttl: 1,
      age: 0,
      nonContact: true,
    });
    return true;
  });
  expect(dismissed).toBe(true);
  await page.waitForTimeout(80);
  const cameoRemaining = await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    return world.entities.some((entity) => !entity.dead && (entity.type === 'alaskanGirl' || entity.type === 'alaskanBoy'));
  });
  expect(cameoRemaining).toBe(false);
});

test('v2 pause freezes play and a finished run saves the personal best', async ({ page }) => {
  await page.goto('/');
  await page.locator('#v2-start').click();

  await page.keyboard.press('KeyP');
  await expect(page.locator('#v2-game-frame')).toHaveClass(/is-paused/);
  await expect(page.locator('#v2-pause')).toBeVisible();
  const elapsedBeforePause = await page.evaluate(() => window.HOCKEY_SMASH_V2_DEV.getWorld().elapsed);
  await page.waitForTimeout(180);
  const elapsedWhilePaused = await page.evaluate(() => window.HOCKEY_SMASH_V2_DEV.getWorld().elapsed);
  expect(elapsedWhilePaused).toBeCloseTo(elapsedBeforePause, 2);

  await page.locator('#v2-resume').click();
  await expect(page.locator('#v2-game-frame')).not.toHaveClass(/is-paused/);
  await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    world.player.score = 321;
    world.player.health = 0;
  });
  await expect(page.locator('#v2-game-frame')).toHaveClass(/is-game-over/);
  await expect(page.locator('#v2-game-over-score')).toContainText('Score 321 · Best 321');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('hockey-smash-best-score'))).toBe('321');

  await page.locator('#v2-retry').click();
  await expect(page.locator('#v2-hud-score')).toContainText('Best 321');
});

test('championship edition exposes sound, golden salmon, active pad directions, and victory', async ({ page }) => {
  await page.goto('/');
  await page.click('#v2-start');

  await expect(page.locator('#v2-sound-button')).toBeVisible();
  await page.click('#v2-sound-button');
  await expect(page.locator('#v2-sound-button')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => localStorage.getItem('hockey-smash-sound-muted'))).toBe('true');

  const contracts = await page.evaluate(() => ({
    victoryPhase: window.HOCKEY_SMASH_WORLD_V2.PHASES.VICTORY,
    upLabel: document.querySelector('.v2-dpad__reserved--up')?.getAttribute('aria-label'),
    downLabel: document.querySelector('.v2-dpad__reserved--down')?.getAttribute('aria-label'),
  }));
  expect(contracts).toEqual({ victoryPhase: 'victory', upLabel: 'Jump', downLabel: 'Slide' });

  await page.evaluate(() => {
    const world = window.HOCKEY_SMASH_V2_DEV.getWorld();
    world.phase = window.HOCKEY_SMASH_WORLD_V2.PHASES.ENCOUNTERS;
    world.difficulty.elapsedInEncounters = 90;
  });
  await expect(page.locator('#v2-game-over-title')).toHaveText('Soldotna Champion!');
  await expect(page.locator('#v2-game-frame')).toHaveClass(/is-game-over/);
});

test('direction pad stays thumb-sized when the browser uses very large text', async ({ page }) => {
  await page.setViewportSize({ width: 470, height: 720 });
  await page.goto('/');
  await page.click('#v2-start');
  const size = await page.evaluate(() => {
    document.documentElement.style.fontSize = '46px';
    const box = document.querySelector('.v2-dpad').getBoundingClientRect();
    return { width: box.width, height: box.height };
  });
  expect(size.width).toBeLessThanOrEqual(104);
  expect(size.height).toBeLessThanOrEqual(104);
  expect(size.width).toBeGreaterThanOrEqual(76);
});
