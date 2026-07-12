/*
 * Hockey Smash Gameplay Systems v2.
 *
 * This file holds the "systems" that make the game move and react:
 *   - moving the player (jumping, sliding, running)
 *   - dropping and catching salmon
 *   - spawning encounters (bears, moose, family cameos, etc.)
 *   - throwing pucks/shoes and letting them hit things
 *
 * These functions used to live inside a big <script> in index.html. They were
 * moved here so they are easier to read, easier to test, and so index.html can
 * stay focused on the page itself (buttons, fullscreen, HUD text).
 *
 * How it fits together:
 *   input  ->  world state  ->  update systems (this file)  ->  canvas renderer
 *
 * Every function takes a `game` object as its first argument. Think of `game`
 * as a small backpack that carries everything a system needs:
 *   game.world       -> the live world state (player, entities, timers...)
 *   game.input       -> which buttons/keys are held right now
 *   game.World       -> the world factory module (createEntity, createSalmon...)
 *   game.encounterIndex -> which encounter comes next (this file bumps it)
 *   game.constants   -> fixed numbers like the ground height and screen size
 *
 * Because everything comes in through `game`, a test can build a fake `game`
 * and call these functions directly without a browser.
 */
(function () {
  'use strict';

  // ---- Tiny math helpers (no game state needed) --------------------------

  // approach() nudges `current` toward `target` by at most `amount`.
  // We use it for movement so speed eases in/out smoothly instead of snapping.
  function approach(current, target, amount) {
    if (current < target) return Math.min(target, current + amount);
    if (current > target) return Math.max(target, current - amount);
    return target;
  }

  // hitbox() shrinks an entity's rectangle by `inset` on every side. A slightly
  // smaller box feels fairer: you have to *really* overlap to get hit or catch.
  function hitbox(entity, inset) {
    return {
      x: entity.x + inset,
      y: entity.y + inset,
      width: Math.max(1, entity.width - inset * 2),
      height: Math.max(1, entity.height - inset * 2),
    };
  }

  // rectsOverlap() is true when two rectangles touch. This is the core of every
  // "did these two things collide?" question in the game.
  function rectsOverlap(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  // ---- Player movement ----------------------------------------------------

  // updatePlayer() reads the held buttons and moves the player for one frame.
  // This is where jump buffering, coyote time, and the double jump live.
  function updatePlayer(game, dt) {
    const { world, input, World } = game;
    const { DESIGN_WIDTH, GROUND_Y } = game.constants;
    const player = world.player;
    const wasGrounded = Boolean(player.grounded);
    player.invulnerable = Math.max(0, (player.invulnerable || 0) - dt);
    player.speedBoost = Math.max(0, (player.speedBoost || 0) - dt);
    player.comboTimer = Math.max(0, (player.comboTimer || 0) - dt);
    if (player.comboTimer <= 0) player.combo = 0;

    // Jump buffering means a button press a tiny bit early still counts.
    // Coyote time means a jump a tiny bit after leaving the ground still works.
    // airJumpsRemaining gives one true double jump so obstacles can be cleared.
    if (input.jumpPressed) {
      player.jumpBufferTimer = world.tuning.jumpBufferSeconds || 0.11;
    } else {
      player.jumpBufferTimer = Math.max(0, (player.jumpBufferTimer || 0) - dt);
    }
    player.coyoteTimer = player.grounded
      ? (world.tuning.coyoteTimeSeconds || 0.09)
      : Math.max(0, (player.coyoteTimer || 0) - dt);

    const move = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const boost = player.speedBoost > 0 ? (world.tuning.playerBoostMultiplier || 1.18) : 1;
    const speed = (input.slide ? world.tuning.slideSpeed : world.tuning.walkSpeed) * boost;
    const lowStance = Boolean(input.slide && player.grounded);
    player.duckActive = Boolean(lowStance && player.character === 'daniel');
    player.slideActive = Boolean(input.slide && !player.duckActive);
    player.lowStance = lowStance;
    const targetVx = move * speed;
    const accel = player.grounded ? world.tuning.groundAcceleration : world.tuning.airAcceleration;
    const friction = player.grounded ? world.tuning.groundFriction : world.tuning.airFriction;
    // approach() moves the player toward the target speed a little each frame.
    // That makes movement feel smooth instead of instantly snapping to full speed.
    player.vx = approach(player.vx || 0, targetVx, (move ? accel : friction) * dt);
    if (move) player.facing = move;

    const canGroundJump = player.grounded || (player.coyoteTimer || 0) > 0;
    const canAirJump = !canGroundJump && (player.airJumpsRemaining || 0) > 0;
    if ((player.jumpBufferTimer || 0) > 0 && (canGroundJump || canAirJump)) {
      player.vy = -world.tuning.jumpVelocity;
      player.grounded = false;
      if (canAirJump) player.airJumpsRemaining = Math.max(0, (player.airJumpsRemaining || 0) - 1);
      player.coyoteTimer = 0;
      player.jumpBufferTimer = 0;
      input.jump = false;
    }
    // Short-hop: letting go of jump early cuts the upward speed, so a quick tap
    // gives a small hop and a held press gives a full jump.
    if (!input.jump && player.vy < 0) {
      player.vy = Math.max(player.vy, -world.tuning.jumpVelocity * (world.tuning.jumpCutMultiplier || 0.52));
    }
    if (input.jumpPressed) input.jumpPressed = false;

    world.timers.projectile = Math.max(0, (world.timers.projectile || 0) - dt);
    if ((input.stickPressed || input.stick) && world.timers.projectile <= 0) {
      spawnProjectile(game);
      world.timers.projectile = 0.28;
      input.stick = false;
    }
    if (input.stickPressed) input.stickPressed = false;

    player.x = Math.max(22, Math.min(DESIGN_WIDTH - player.width - 22, player.x + player.vx * dt));
    player.vy += world.tuning.gravity * dt;
    player.y += player.vy * dt;
    if (player.y + player.height >= GROUND_Y) {
      const landingSpeed = player.vy;
      player.y = GROUND_Y - player.height;
      player.vy = 0;
      player.grounded = true;
      player.airJumpsRemaining = world.tuning.airJumps || 1;
      player.coyoteTimer = world.tuning.coyoteTimeSeconds || 0.09;
      if (!wasGrounded && landingSpeed > 260) {
        world.effects.push({
          kind: 'burst', x: player.x + player.width / 2, y: GROUND_Y - 5,
          color: '#d8edf5', particles: 8, spread: 42, life: 0.42, maxLife: 0.42,
        });
      }
    }
    if (!player.grounded) {
      player.duckActive = false;
      player.lowStance = false;
    }
  }

  // ---- Salmon (the main collectible) --------------------------------------

  // updateSalmonLoop() drops new salmon on a timer, moves the ones in the air,
  // and lets the player catch them by running underneath.
  function updateSalmonLoop(game, dt) {
    const { world, World } = game;
    const { GROUND_Y, DESIGN_HEIGHT } = game.constants;
    if (world.phase === World.PHASES.COUNTDOWN) return;
    // Salmon keep falling after the 20-salmon gate, but they slow down a bit
    // so encounters can share the screen without becoming impossible.
    const salmonTimerName = world.phase === World.PHASES.SALMON_RUN ? 'salmon' : 'postGateSalmon';
    if (!Number.isFinite(world.timers[salmonTimerName])) world.timers[salmonTimerName] = 0;
    world.timers[salmonTimerName] -= dt;
    if (world.timers[salmonTimerName] <= 0) {
      spawnHarnessSalmon(game);
      const difficulty = world.difficulty || {};
      const postMin = difficulty.salmonPostGateSpawnMin || 1.3;
      const postMax = difficulty.salmonPostGateSpawnMax || 2.0;
      world.timers[salmonTimerName] = world.phase === World.PHASES.SALMON_RUN
        ? Math.max(0.25, world.tuning.salmonSpawnSeconds + Math.random() * 0.22 - 0.08)
        : postMin + Math.random() * Math.max(0, postMax - postMin);
    }

    const playerBox = hitbox(world.player, 10);
    world.entities.forEach((entity) => {
      if (!entity || entity.dead || entity.type !== 'salmon') return;
      entity.age += dt;
      entity.x += entity.vx * dt;
      entity.y += entity.vy * dt;
      entity.vy += world.tuning.salmonFallGravity * dt;
      if (entity.y >= GROUND_Y - entity.height && !entity.hasLanded) {
        entity.hasLanded = true;
        entity.y = GROUND_Y - entity.height;
        entity.vx *= 0.45;
        entity.vy = Math.min(entity.vy, 34);
      }

      if (rectsOverlap(playerBox, hitbox(entity, 4))) collectSalmon(game, entity);
      if (entity.y > DESIGN_HEIGHT + 70) {
        entity.dead = true;
        world.player.combo = 0;
        world.player.comboTimer = 0;
        world.effects.push({
          x: entity.x + entity.width / 2,
          y: GROUND_Y - 18,
          text: 'MISSED',
          life: 0.55,
        });
      }
    });

    world.entities = world.entities.filter((entity) => entity && !entity.dead);
    if (world.phase === World.PHASES.SALMON_RUN) world.message = `Salmon Run: catch ${world.salmonCaught}/${world.salmonTarget}.`;
  }

  // collectSalmon() runs when the player touches a salmon: it scores points,
  // grows the combo, and shows a floating "+10" / "PERFECT" effect.
  function collectSalmon(game, entity) {
    const { world } = game;
    const { GROUND_Y } = game.constants;
    entity.dead = true;
    world.salmonCaught += 1;
    const landingY = GROUND_Y - entity.height;
    const isPerfect = !entity.hasLanded && Math.abs(entity.y - landingY) <= 34;
    world.player.combo = Math.min(9, (world.player.combo || 0) + 1);
    world.player.comboTimer = 2.1;
    const comboBonus = Math.max(0, (world.player.combo - 1) * 3);
    const golden = entity.variant === 'golden';
    const points = (golden ? 50 : (isPerfect ? 25 : 10)) + comboBonus;
    world.player.score = (world.player.score || 0) + points;
    world.effects.push({
      x: entity.x + entity.width / 2,
      y: Math.max(40, entity.y - 10),
      text: golden ? `${isPerfect ? 'GOLDEN PERFECT' : 'GOLDEN'} +${points}` : (isPerfect ? `PERFECT +${points}` : `+${points}`),
      life: 0.6,
      sound: golden ? 'golden' : (isPerfect ? 'perfect' : 'catch'),
    });
    world.effects.push({
      kind: 'burst',
      x: entity.x + entity.width / 2,
      y: entity.y + entity.height / 2,
      color: golden || isPerfect ? '#fff27a' : '#78dcff',
      particles: golden ? 20 : (isPerfect ? 14 : 8),
      spread: golden ? 95 : (isPerfect ? 70 : 46),
      life: 0.55,
      maxLife: 0.55,
    });
    if (world.player.combo >= 3) {
      world.effects.push({
        x: entity.x + entity.width / 2,
        y: Math.max(32, entity.y - 34),
        text: `COMBO x${world.player.combo}`,
        life: 0.7,
      });
    }
    if (world.debug) world.debug.lastCollision = 'player -> salmon';
  }

  function spawnHarnessSalmon(game) {
    const { world, World } = game;
    const { DESIGN_WIDTH } = game.constants;
    const activeSalmon = world.entities.filter((entity) => entity && !entity.dead && entity.type === 'salmon');
    let spawnX = 36 + Math.random() * (DESIGN_WIDTH - 108);
    // Give the player a readable choice: avoid dropping a new fish almost on top
    // of an existing one when there is room elsewhere.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      if (activeSalmon.every((entity) => Math.abs(entity.x - spawnX) >= 120)) break;
      spawnX = 36 + Math.random() * (DESIGN_WIDTH - 108);
    }
    const salmon = World.createSalmon(world, {
      x: spawnX,
      y: -70 - Math.random() * 90,
      vx: -75 + Math.random() * 150,
      vy: world.tuning.salmonFallVelocity + Math.random() * world.tuning.salmonFallVelocityRange,
    });
    spawnSalmonLandingMarker(game, salmon);
    world.entities.push(salmon);
  }

  // spawnSalmonLandingMarker() drops the yellow "run here" marker on the ground
  // so the player can see where a falling salmon will land.
  function spawnSalmonLandingMarker(game, salmon) {
    const { world, World } = game;
    const { GROUND_Y } = game.constants;
    const landing = predictSalmonLandingX(game, salmon);
    const width = 74;
    world.entities.push(World.createEntity(world, 'salmonMarker', {
      sprite: 'salmonMarker',
      x: landing.x - width / 2,
      y: GROUND_Y - 10,
      width,
      height: 10,
      ttl: Math.min(2.5, Math.max(0.8, landing.time + 0.25)),
      nonContact: true,
      landingFor: salmon.id,
    }));
  }

  function predictSalmonLandingX(game, salmon) {
    const { world } = game;
    const { DESIGN_WIDTH, GROUND_Y } = game.constants;
    // This predicts where a salmon will touch the ground using the same gravity
    // that moves it. The yellow marker shows the player where to run.
    const gravity = world.tuning.salmonFallGravity || 275;
    const targetY = GROUND_Y - salmon.height;
    const dy = Math.max(0, targetY - salmon.y);
    const vy = salmon.vy || 0;
    const discriminant = Math.max(0, (vy * vy) + (2 * gravity * dy));
    const time = gravity > 0 ? Math.max(0, (-vy + Math.sqrt(discriminant)) / gravity) : 1;
    const centerX = salmon.x + (salmon.width / 2) + ((salmon.vx || 0) * time);
    return {
      x: Math.max(34, Math.min(DESIGN_WIDTH - 34, centerX)),
      time,
    };
  }

  // ---- Encounters (bears, moose, family cameos, dad jokes...) -------------

  // spawnNextEncounter() decides what shows up next. It walks through the
  // ENCOUNTER_TYPES list in order (instead of pure random) so the game feels
  // varied and fair. It returns the spawned entity, or null if nothing fit.
  function spawnNextEncounter(game, options = {}) {
    const { world, World } = game;
    const { DESIGN_WIDTH, ENCOUNTER_TYPES, REPEATABLE_ENCOUNTERS } = game.constants;
    const ignoreCaps = Boolean(options.ignoreCaps);
    let type = null;
    // We rotate through the encounter list so the game feels varied instead of
    // rolling pure random encounters that might repeat too much.
    for (let attempts = 0; attempts < ENCOUNTER_TYPES.length; attempts += 1) {
      const candidate = ENCOUNTER_TYPES[game.encounterIndex % ENCOUNTER_TYPES.length];
      game.encounterIndex += 1;
      if (ignoreCaps || canSpawnEncounter(game, candidate)) {
        type = candidate;
        break;
      }
    }
    // Fallback: if the varied rotation could not place anything (usually because
    // the one-shot visitors are all used up), reach for a repeatable threat so
    // the action keeps coming. We only give up (return null) when even those are
    // capped out - and when that happens the game loop retries again very soon.
    if (!type && !ignoreCaps && Array.isArray(REPEATABLE_ENCOUNTERS)) {
      for (const candidate of REPEATABLE_ENCOUNTERS) {
        if (canSpawnEncounter(game, candidate)) {
          type = candidate;
          break;
        }
      }
    }
    if (!type) return null;
    if (type === 'bear') return spawnWildlife(game, 'bear');
    if (type === 'eagle') return spawnEagle(game);
    if (type === 'moose') return spawnWildlife(game, 'moose');
    if (type === 'dad') {
      world.cast.dadSpawned = true;
      return spawnDad(game);
    }
    if (type === 'mom') {
      world.cast.momSpawned = true;
      const mom = World.createMom(world, {
        x: DESIGN_WIDTH - 128,
        vx: 0,
        ttl: 4.2,
      });
      world.entities.push(mom);
      return mom;
    }
    if (type === 'castSupport') return spawnCastSupport(game);
    return spawnCameo(game);
  }

  // canSpawnEncounter() answers "is it fair to spawn this right now?". Spawn caps
  // keep the screen readable: only one Mom, one Dad, and a few dangers at once.
  function canSpawnEncounter(game, type) {
    const { world } = game;
    const difficulty = world.difficulty || {};
    // Spawn caps keep the screen fair: one Mom, one Dad, and a small number
    // of danger objects at a time.
    if (type === 'cameo' && world.cast?.cameoSpawned) return false;
    if (type === 'mom' && world.cast?.momSpawned) return false;
    if (type === 'mom' && countActiveType(game, 'mom') >= 1) return false;
    if (type === 'dad' && countActiveType(game, 'dad') >= 1) return false;
    if (type === 'castSupport' && world.player.character === 'daniel' && world.cast?.sisterSpawned) return false;
    if (type === 'castSupport' && world.player.character === 'sofie' && world.cast?.teacherSpawned) return false;
    if (type === 'castSupport' && world.player.character === 'sofie' && countActiveThreats(game) >= (difficulty.maxActiveThreats || 1)) return false;
    if (['bear', 'moose', 'eagle'].includes(type) && countActiveWildlife(game) >= (difficulty.maxActiveWildlife || 1)) return false;
    if (['bear', 'moose', 'eagle', 'dad', 'danceInstructor'].includes(type) && countActiveThreats(game) >= (difficulty.maxActiveThreats || 1)) return false;
    return true;
  }

  function countActiveWildlife(game) {
    return game.world.entities.filter((entity) => entity && !entity.dead && ['bear', 'moose', 'eagle'].includes(entity.type)).length;
  }

  function countActiveThreats(game) {
    return game.world.entities.filter((entity) => (
      entity
      && !entity.dead
      && !entity.nonContact
      && !['salmon', 'salmonMarker', 'projectile'].includes(entity.type)
    )).length;
  }

  function countActiveType(game, type) {
    return game.world.entities.filter((entity) => entity && !entity.dead && entity.type === type).length;
  }

  function addWarning(game, text, x, y) {
    const { world } = game;
    const { DESIGN_WIDTH, GROUND_Y } = game.constants;
    const warnX = x === undefined ? DESIGN_WIDTH - 140 : x;
    const warnY = y === undefined ? GROUND_Y - 120 : y;
    world.effects.push({ x: warnX, y: warnY, text, life: 0.75 });
  }

  function spawnEagle(game) {
    const { world, World } = game;
    const { DESIGN_WIDTH, GROUND_Y } = game.constants;
    const speed = (world.difficulty?.speedMultiplier || 1);
    const eagle = World.createEntity(world, 'eagle', {
      sprite: 'eagle',
      x: DESIGN_WIDTH + 80,
      y: GROUND_Y - 126,
      width: 92,
      height: 58,
      vx: -245 * speed,
      hp: 1,
      maxHp: 1,
      damage: 10,
      duckable: true,
      bubble: '',
    });
    world.entities.push(eagle);
    addWarning(game, 'DUCK!', DESIGN_WIDTH - 140, eagle.y - 12);
    return eagle;
  }

  function spawnWildlife(game, type) {
    const { world, World } = game;
    const { DESIGN_WIDTH, GROUND_Y } = game.constants;
    const isMoose = type === 'moose';
    const speed = (world.difficulty?.speedMultiplier || 1);
    const wildlife = World.createEntity(world, type, {
      sprite: type,
      x: DESIGN_WIDTH + 52,
      y: GROUND_Y - (isMoose ? 92 : 84),
      width: isMoose ? 112 : 96,
      height: isMoose ? 92 : 84,
      vx: (isMoose ? -108 : -150) * speed,
      hp: isMoose ? 3 : 2,
      maxHp: isMoose ? 3 : 2,
      damage: isMoose ? 16 : 12,
      state: 'walking',
      grazeTimer: isMoose ? 2.2 + Math.random() * 1.8 : 0,
      bubble: '',
    });
    world.entities.push(wildlife);
    addWarning(game, isMoose ? 'MOOSE!' : 'BEAR!', DESIGN_WIDTH - 140, wildlife.y - 12);
    return wildlife;
  }

  function spawnDad(game) {
    const { world } = game;
    const { DESIGN_WIDTH, GROUND_Y } = game.constants;
    const { DAD_JOKES } = game.constants;
    const speed = world.difficulty?.speedMultiplier || 1;
    const dad = spawnPerson(game, 'dad', DAD_JOKES[Math.floor(Math.random() * DAD_JOKES.length)], 2, 10, false);
    dad.width = 110;
    dad.height = 98;
    dad.y = GROUND_Y - dad.height;
    dad.vx = -78 * speed;
    dad.ttl = 8;
    dad.dismissOnProjectile = true;
    dad.mowerOffset = 0;
    addWarning(game, 'DAD JOKE!', DESIGN_WIDTH - 160, dad.y - 12);
    return dad;
  }

  function spawnPerson(game, type, bubble, hp, damage, nonContact = false) {
    const { world, World } = game;
    const { DESIGN_WIDTH, GROUND_Y } = game.constants;
    const speed = (world.difficulty?.speedMultiplier || 1);
    const person = World.createEntity(world, type, {
      sprite: type,
      x: DESIGN_WIDTH + 64,
      y: GROUND_Y - 100,
      width: 92,
      height: 100,
      vx: (nonContact ? -55 : -92) * speed,
      hp,
      maxHp: hp,
      damage,
      bubble,
      nonContact,
      ttl: nonContact ? 5.2 : null,
    });
    world.entities.push(person);
    return person;
  }

  function spawnCastSupport(game) {
    const { world, World } = game;
    const { DESIGN_WIDTH, GROUND_Y } = game.constants;
    if (world.player.character === 'sofie') {
      world.cast.teacherSpawned = true;
      return spawnPerson(game, 'danceInstructor', 'Point those toes!', 3, 7);
    }
    world.cast.sisterSpawned = true;
    const sister = World.createEntity(world, 'sister', {
      sprite: 'sofie',
      x: DESIGN_WIDTH + 44,
      y: GROUND_Y - 108,
      width: 86,
      height: 108,
      vx: -50,
      ttl: 12,
      nonContact: true,
      dismissOnProjectile: true,
      bubble: 'Go Daniel!',
    });
    world.entities.push(sister);
    return sister;
  }

  function spawnCameo(game) {
    const { world, World } = game;
    const { DESIGN_WIDTH } = game.constants;
    if (world.cast?.cameoSpawned) return null;
    world.cast.cameoSpawned = true;
    const cameoType = world.player.character === 'sofie' ? 'alaskanBoy' : 'alaskanGirl';
    const cameo = World.createCameo(world, cameoType, {
      x: DESIGN_WIDTH - 156,
      vx: 0,
      ttl: 5,
    });
    world.entities.push(cameo);
    return cameo;
  }

  // ---- Projectiles (Daniel's puck / Sofie's shoe) -------------------------

  // spawnProjectile() throws a puck or shoe from the player.
  //
  // DESIGN RULE: projectiles always fly to the RIGHT (direction = 1), on purpose.
  // Every threat marches in from the right edge of the screen, so "throw right"
  // means "throw at the things that can hurt you". That is why we ignore
  // player.facing here - facing only flips the character art, not the aim.
  // The renderer draws a small chevron on the player's right so this reads as a
  // deliberate rule to the player. (See renderAimIndicator in the renderer.)
  function spawnProjectile(game) {
    const { world, World } = game;
    const player = world.player;
    const direction = 1;
    const isSofie = player.character === 'sofie';
    const label = isSofie ? 'shoe' : 'puck';
    const width = isSofie ? 40 : 32;
    const height = isSofie ? 28 : 24;
    world.entities.push(World.createEntity(world, 'projectile', {
      sprite: isSofie ? 'projectileShoe' : 'projectilePuck',
      label,
      x: player.x + player.width - 8,
      y: player.y + (isSofie ? 38 : 42),
      width,
      height,
      vx: 520 * direction,
      vy: 0,
      // Long enough to cross the full 1024px playfield even when fired from
      // the far-left edge. Off-screen cleanup still removes it past the right.
      ttl: 2.4,
      nonContact: true,
      bubble: '',
    }));
    world.effects.push({ kind: 'burst', x: player.x + player.width, y: player.y + 48, color: '#d9f3ff', particles: 5, spread: 24, life: 0.2, maxLife: 0.2, sound: 'throw' });
  }

  // collideProjectile() checks one flying projectile against everything else and
  // handles hits: some visitors are dismissed in one shot, threats lose HP.
  function collideProjectile(game, projectile) {
    const { world } = game;
    const projectileBox = hitbox(projectile, 2);
    for (const target of world.entities) {
      if (!target || target.dead || target.type === 'projectile' || target.type === 'salmon') continue;
      if (!rectsOverlap(projectileBox, hitbox(target, 8))) continue;
      // Some friendly/funny visitors are dismissed in one shot instead of taking HP damage.
      if (target.dismissOnProjectile) {
        projectile.dead = true;
        target.dead = true;
        if (world.debug) world.debug.lastCollision = `projectile dismissed ${target.type}`;
        world.effects.push({ x: target.x + target.width / 2, y: target.y - 10, text: 'BYE!', life: 0.55 });
        break;
      }
      if (target.nonContact) continue;
      projectile.dead = true;
      target.hp = Math.max(0, (target.hp || 1) - 1);
      if (world.debug) world.debug.lastCollision = `projectile -> ${target.type}`;
      world.effects.push({ x: target.x + target.width / 2, y: target.y - 10, text: 'HIT!', life: 0.45 });
      if (target.hp <= 0) {
        target.dead = true;
        world.effects.push({ x: target.x + target.width / 2, y: target.y - 24, text: 'CLEAR!', life: 0.65 });
      }
      break;
    }
  }

  // Everything the page (index.html) and tests are allowed to call.
  window.HOCKEY_SMASH_SYSTEMS_V2 = {
    // geometry helpers
    approach,
    hitbox,
    rectsOverlap,
    // the five headline systems
    updatePlayer,
    updateSalmonLoop,
    spawnNextEncounter,
    collideProjectile,
    collectSalmon,
    // supporting spawners the page/dev-harness still calls directly
    spawnProjectile,
    spawnHarnessSalmon,
    spawnCameo,
  };
})();
