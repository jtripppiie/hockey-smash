/*
 * Hockey Smash World v2.
 *
 * Defines the active game-world shape without owning DOM, rendering, or input.
 */
(function () {
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const GROUND_Y = 518;
  const SALMON_TARGET = 20;

  const PHASES = Object.freeze({
    COUNTDOWN: 'countdown',
    SALMON_RUN: 'salmonRun',
    ENCOUNTERS: 'encounters',
    VICTORY: 'victory',
    GAME_OVER: 'gameOver',
  });

  const SPRITES = Object.freeze({
    // Sprite keys are short names the game uses. The values are the real image files.
    // Keeping this list here makes it easier to rename art without hunting everywhere.
    daniel: 'assets/hockey-smash/sprites/daniel-hockey-idle.webp',
    danielSlide: 'assets/hockey-smash/sprites/daniel-hockey-slide.webp',
    danielDuck: 'assets/hockey-smash/sprites/daniel-hockey-duck.webp',
    sofie: 'assets/hockey-smash/sprites/sofie-dancer-idle.webp',
    sofieSlide: 'assets/hockey-smash/sprites/sofie-dance-spin.webp',
    bearWalkSheet: 'assets/hockey-smash/sprites/bear-walk-sheet-v2.png',
    mooseWalkSheet: 'assets/hockey-smash/sprites/moose-walk-sheet-v2.png',
    eagleFlySheet: 'assets/hockey-smash/sprites/eagle-fly-sheet-v2.png',
    salmon: 'assets/hockey-smash/sprites/salmon-static-v2.png',
    bear: 'assets/hockey-smash/sprites/bear-walk-01.webp',
    bear1: 'assets/hockey-smash/sprites/bear-walk-01.webp',
    bear2: 'assets/hockey-smash/sprites/bear-walk-02.webp',
    bear3: 'assets/hockey-smash/sprites/bear-walk-03.webp',
    bear4: 'assets/hockey-smash/sprites/bear-walk-04.webp',
    bear5: 'assets/hockey-smash/sprites/bear-walk-05.webp',
    bear6: 'assets/hockey-smash/sprites/bear-walk-06.webp',
    moose: 'assets/hockey-smash/sprites/moose-walk-01.webp',
    moose1: 'assets/hockey-smash/sprites/moose-walk-01.webp',
    moose2: 'assets/hockey-smash/sprites/moose-walk-02.webp',
    moose3: 'assets/hockey-smash/sprites/moose-walk-03.webp',
    dad: 'assets/hockey-smash/sprites/dad-cameo.webp',
    mom: 'assets/hockey-smash/sprites/mom-cameo.webp',
    danceInstructor: 'assets/hockey-smash/sprites/sofie-dance-instructor.webp',
    alaskanBoy: 'assets/hockey-smash/sprites/alaska-boy-cameo.webp',
    alaskanGirl: 'assets/hockey-smash/sprites/alaska-girl-cameo.webp',
    projectilePuck: 'assets/hockey-smash/sprites/projectile-hockey-puck.webp',
    projectileShoe: 'assets/hockey-smash/sprites/projectile-dancer-shoe.webp',
    eagle: 'assets/hockey-smash/sprites/eagle-flap-mid.webp',
  });

  const DEFAULT_TUNING = Object.freeze({
    // Tuning numbers are the knobs for game feel. Change these first before
    // rewriting systems: speed, gravity, spawn timing, and scoring windows live here.
    // countdownSeconds is a short "get ready" beat before salmon start falling.
    // Keep it small (about 3) so the game starts feeling alive right away.
    countdownSeconds: 3,
    gravity: 2250,
    walkSpeed: 360,
    slideSpeed: 575,
    groundAcceleration: 4200,
    airAcceleration: 2500,
    groundFriction: 5200,
    airFriction: 1500,
    jumpVelocity: 810,
    jumpBufferSeconds: 0.11,
    coyoteTimeSeconds: 0.09,
    airJumps: 1,
    jumpCutMultiplier: 0.52,
    safeWindowSeconds: 0.76,
    playerBoostMultiplier: 1.18,
    cameoBoostSeconds: 4.5,
    perfectCatchWindowSeconds: 0.34,
    salmonSpawnSeconds: 1.12,
    salmonFallVelocity: 235,
    salmonFallVelocityRange: 45,
    salmonFallGravity: 275,
    encounterSpawnSeconds: 2.2,
  });

  function createWorld(options = {}) {
    const character = options.character === 'sofie' ? 'sofie' : 'daniel';
    const fallbackName = character === 'sofie' ? 'Sofie' : 'Daniel';
    const name = cleanName(options.name, fallbackName);
    const tuning = { ...DEFAULT_TUNING, ...(options.tuning || {}) };

    return {
      // The world is the game's memory. The renderer reads this object and draws it.
      version: 2,
      phase: PHASES.COUNTDOWN,
      elapsed: 0,
      countdownRemaining: tuning.countdownSeconds,
      // When the countdown ends we briefly show a big "Catch!" pop on the canvas.
      // This number counts down to 0 while that flash is on screen.
      catchFlashRemaining: 0,
      salmonCaught: 0,
      salmonTarget: SALMON_TARGET,
      nextEntityId: 1,
      tuning,
      player: createPlayer({ character, name }),
      timers: {
        salmon: 0,
        encounter: tuning.encounterSpawnSeconds,
        postGateSalmon: 1.15,
      },
      debug: createDebugState(options.debug),
      difficulty: createDifficulty(options.difficulty || {}),
      environment: createEnvironment(options.environment || {}),
      cast: createCastState(),
      entities: [],
      effects: [],
      message: `Get ready, ${name}!`,
    };
  }

  function createDebugState(enabled = false) {
    return {
      enabled: Boolean(enabled),
      showFPS: Boolean(enabled),
      showHitboxes: false,
      godMode: false,
      lastCollision: '',
      fps: 0,
      visible: Boolean(enabled),
    };
  }

  function createDifficulty(options = {}) {
    return {
      level: 1,
      elapsedInEncounters: 0,
      baseSpawnMin: 1.8,
      baseSpawnMax: 3.2,
      currentSpawnMin: 1.8,
      currentSpawnMax: 3.2,
      maxActiveThreats: 1,
      maxActiveWildlife: 1,
      speedMultiplier: 1,
      threatSpeedRampPerSecond: 0.0008,
      salmonPostGateSpawnMin: 1.3,
      salmonPostGateSpawnMax: 2.0,
      ...options,
    };
  }

  function updateDifficulty(world, dt) {
    if (!world || world.phase !== PHASES.ENCOUNTERS) return world;

    const difficulty = world.difficulty || createDifficulty();
    world.difficulty = difficulty;
    difficulty.elapsedInEncounters += dt;
    difficulty.level = 1 + Math.floor(difficulty.elapsedInEncounters / 45);

    // Difficulty rises slowly during encounters so the first moments stay readable.
    const ramp = difficulty.elapsedInEncounters * difficulty.threatSpeedRampPerSecond;
    difficulty.speedMultiplier = Math.min(1.75, 1 + ramp);

    difficulty.currentSpawnMin = Math.max(1.05, difficulty.baseSpawnMin - difficulty.level * 0.08);
    difficulty.currentSpawnMax = Math.max(1.65, difficulty.baseSpawnMax - difficulty.level * 0.12);

    difficulty.maxActiveThreats = difficulty.level >= 4 ? 2 : 1;
    difficulty.maxActiveWildlife = 1;
    return world;
  }

  function createEnvironment(options = {}) {
    return {
      clock: Number(options.clock || 0),
      cycleSeconds: Number(options.cycleSeconds || 240),
      scrollX: Number(options.scrollX || 0),
      wind: Number(options.wind || 1),
      midnightSun: options.midnightSun !== false,
      nightAmount: typeof options.nightAmount === 'number' ? Number(options.nightAmount) : null,
    };
  }

  function createCastState() {
    return {
      // These flags stop special visitors from repeating too much in one run.
      cameoSpawned: false,
      dadSpawned: false,
      momSpawned: false,
      sisterSpawned: false,
      teacherSpawned: false,
    };
  }

  function createPlayer({ character, name }) {
    return {
      id: 'player',
      type: 'player',
      character,
      name,
      sprite: character,
      x: 132,
      y: GROUND_Y - 108,
      width: 104,
      height: 108,
      vx: 0,
      vy: 0,
      facing: 1,
      grounded: true,
      coyoteTimer: 0,
      jumpBufferTimer: 0,
      airJumpsRemaining: 1,
      slideActive: false,
      duckActive: false,
      lowStance: false,
      safeWindow: 0,
      score: 0,
      bestScore: 0,
      combo: 0,
      comboTimer: 0,
      maxHealth: 100,
      health: 100,
      invulnerable: 0,
      speedBoost: 0,
    };
  }

  function createEntity(world, type, values = {}) {
    // Every moving thing except the player is an entity: salmon, Dad, Mom, wildlife,
    // projectiles, warning markers, and helper cameos.
    const entity = {
      id: `${type}-${world.nextEntityId}`,
      type,
      sprite: type,
      x: 0,
      y: 0,
      width: 48,
      height: 48,
      vx: 0,
      vy: 0,
      age: 0,
      ttl: null,
      collectible: false,
      nonContact: false,
      bubble: '',
      ...values,
    };
    world.nextEntityId += 1;
    return entity;
  }

  function createSalmon(world, values = {}) {
    return createEntity(world, 'salmon', {
      sprite: 'salmon',
      width: 66,
      height: 33,
      y: -60,
      vx: (Math.random() - 0.5) * 80,
      vy: world.tuning.salmonFallVelocity + (Math.random() * world.tuning.salmonFallVelocityRange - (world.tuning.salmonFallVelocityRange / 2)),
      collectible: true,
      nonContact: true,
      facing: -1,
      perfectWindow: world.tuning.perfectCatchWindowSeconds,
      variant: Math.random() < 0.12 ? 'golden' : 'normal',
      hasLanded: false,
      ...values,
    });
  }

  function createMom(world, values = {}) {
    const height = 132;
    const width = 49;
    return createEntity(world, 'mom', {
      sprite: 'mom',
      x: 112,
      y: GROUND_Y - height,
      width,
      height,
      ttl: 4.2,
      nonContact: true,
      bubble: `${world.player.name}, clean your room!`,
      ...values,
    });
  }

  function createCameo(world, type, values = {}) {
    const safeType = type === 'alaskanBoy' ? 'alaskanBoy' : 'alaskanGirl';
    return createEntity(world, safeType, {
      sprite: safeType,
      width: 74,
      height: 92,
      y: GROUND_Y - 92,
      ttl: 5,
      nonContact: true,
      dismissOnProjectile: true,
      boostGiven: false,
      boostRadius: 92,
      hp: 1,
      maxHp: 1,
      bubble: 'Hi, you\'re cute',
      ...values,
    });
  }

  function advancePhase(world, nextPhase) {
    if (!Object.values(PHASES).includes(nextPhase)) return world;
    world.phase = nextPhase;
    if (nextPhase === PHASES.SALMON_RUN) world.message = `Salmon Run: catch 0/${world.salmonTarget}.`;
    if (nextPhase === PHASES.ENCOUNTERS) world.message = 'Salmon run complete — encounters unlocked.';
    return world;
  }

  function getSpriteForEntity(entity) {
    if (!entity) return '';
    if (entity.type === 'player' && entity.duckActive) return SPRITES.danielDuck || SPRITES.daniel;
    if (entity.type === 'player' && entity.slideActive) return SPRITES[`${entity.character}Slide`] || SPRITES[entity.character];
    return SPRITES[entity.sprite] || SPRITES[entity.type] || '';
  }

  function cleanName(value, fallback) {
    const cleaned = String(value || '')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 12);
    return cleaned || fallback || 'Daniel';
  }

  window.HOCKEY_SMASH_WORLD_V2 = Object.freeze({
    DESIGN_WIDTH,
    DESIGN_HEIGHT,
    GROUND_Y,
    SALMON_TARGET,
    PHASES,
    SPRITES,
    DEFAULT_TUNING,
    createWorld,
    createDebugState,
    createDifficulty,
    updateDifficulty,
    createEnvironment,
    createCastState,
    createPlayer,
    createEntity,
    createSalmon,
    createMom,
    createCameo,
    advancePhase,
    getSpriteForEntity,
  });
})();
