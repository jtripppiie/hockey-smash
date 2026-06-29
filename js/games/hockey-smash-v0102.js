(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.13.6';
  const DISPLAY_BUILD = 'Build 2026-06-29.52';
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const GROUND_Y = DESIGN_HEIGHT * 0.82;
  const BASE_SPAWN_MS = 1600;
  const MIN_SPAWN_MS = 620;
  const SPAWN_JITTER_MS = 280;
  const COMBO_SPAWN_DELAY_MS = 420;
  const params = new URLSearchParams(window.location.search);
  const computerMode = params.get('computerMode') === '1';

  // This layer does not control the player.
  // It only adds moving gameplay objects to state.entities. The core game loop
  // already moves entities by vx * dt and checks overlap. Computer Mode uses
  // this same encounter pass so watch mode and normal play stay close together.
  const WAVE = [
    {
      type: 'salmon', x: DESIGN_WIDTH + 120, y: 245, width: 74, height: 42,
      vx: -420, vy: -80, hp: 1, damage: 0, dodgeDamage: 8, flip: -1,
      variant: 'normal', message: 'Fish flying in — duck or jump!'
    },
    {
      type: 'bear', x: DESIGN_WIDTH + 90, y: GROUND_Y - 104, width: 122, height: 104,
      vx: -245, hp: 2, maxHp: 2, damage: 12,
      message: 'Bear moving in — use the stick and puck!'
    },
    {
      type: 'salmon', x: DESIGN_WIDTH + 140, y: 160, width: 80, height: 45,
      vx: -580, vy: -210, hp: 1, damage: 0, dodgeDamage: 8, flip: -1,
      variant: 'highArc', message: 'High flying salmon — jump high!'
    },
    {
      type: 'salmon', x: DESIGN_WIDTH + 100, y: 340, width: 70, height: 38,
      vx: -390, vy: 120, hp: 1, damage: 0, dodgeDamage: 8, flip: -1,
      variant: 'low', message: 'Low salmon — slide!'
    },
    {
      type: 'salmon', x: DESIGN_WIDTH + 200, y: 220, width: 120, height: 50,
      vx: -460, vy: -60, hp: 1, damage: 0, dodgeDamage: 12, flip: -1,
      variant: 'school', message: 'Salmon SCHOOL incoming!'
    },
    {
      type: 'mom', x: DESIGN_WIDTH + 40, y: GROUND_Y - 88, width: 84, height: 88,
      vx: -145, hp: 2, damage: 5, bubble: 'Daniel, clean your room!',
      message: 'Mom interruption moving in!'
    },
    {
      type: 'sister', x: DESIGN_WIDTH + 70, y: GROUND_Y - 94, width: 84, height: 94,
      vx: -175, hp: 2, damage: 7, bubble: 'Spin move!',
      message: 'Sister spinning in!'
    },
    {
      type: 'moose', x: DESIGN_WIDTH + 120, y: GROUND_Y - 118, width: 146, height: 118,
      vx: -195, hp: 3, maxHp: 3, damage: 16,
      message: 'Moose moving in — use the stick and puck!'
    }
  ];

  function onReady() {
    const api = window.RTA_HOCKEY_SMASH;
    const badge = document.getElementById('hockey-build-badge');
    const status = document.getElementById('hockey-status');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api?.getVersion) api.getVersion = () => DISPLAY_VERSION;
    if (!api) return;

    let nextSpawnAt = 0;
    let waveIndex = 0;
    let firstPlayableAt = 0;
    let comboSpawnQueued = false;

    function getPlayableState() {
      const state = api.getState?.();
      if (!state || !state.player || state.mode === 'splash' || state.mode === 'transition' || state.mode === 'tryAgain') return null;
      if (!Array.isArray(state.entities)) state.entities = [];
      return state;
    }

    function activeMovingGameplayEntities(state) {
      return state.entities.filter((entity) => entity && !entity.dead && entity.fromMovingGameplayPass);
    }

    function difficultyFor(state, now) {
      const timedDifficulty = firstPlayableAt ? Math.min(1, (now - firstPlayableAt) / 120000) : 0;
      const scoreLayerDifficulty = Math.min(1, Math.max(0, Number(state.difficulty) || 0));
      return Math.max(timedDifficulty, scoreLayerDifficulty);
    }

    function forceRightSideSalmon(entity) {
      if (entity.type !== 'salmon') return entity;
      entity.x = Math.max(entity.x || 0, DESIGN_WIDTH + 72);
      entity.vx = -Math.abs(entity.vx || 420);
      entity.flip = -1;
      return entity;
    }

    function applyVariant(entity, difficulty) {
      const roll = Math.random();
      entity.difficulty = Number(difficulty.toFixed(2));
      entity.variant = entity.variant || 'normal';

      if (entity.type === 'salmon') {
        forceRightSideSalmon(entity);
        if (entity.variant === 'highArc' || entity.variant === 'low' || entity.variant === 'school') return entity;
        if (roll < 0.3 + difficulty * 0.4) {
          entity.variant = 'school';
          entity.vx *= 1.25;
          entity.width *= 1.6;
          entity.height = Math.max(entity.height || 42, 48);
          entity.dodgeDamage = 12;
          entity.message = 'Salmon SCHOOL incoming!';
          return entity;
        }
        if (roll < 0.55 + difficulty * 0.15) {
          entity.variant = 'highArc';
          entity.vy = -280;
          entity.vx *= 0.9;
          entity.message = 'High flying salmon — jump high!';
          return entity;
        }
        if (roll < 0.7 + difficulty * 0.1) {
          entity.variant = 'fast';
          entity.vx *= 1.18 + difficulty * 0.22;
          entity.vy *= 1.05;
          entity.message = 'Fast fish incoming — jump or duck!';
        }
        return entity;
      }

      if ((entity.type === 'bear' || entity.type === 'moose') && roll > 0.82 - difficulty * 0.24) {
        entity.variant = 'tank';
        entity.hp = (entity.hp || 1) + 1;
        entity.maxHp = Math.max(entity.maxHp || 1, entity.hp);
        entity.message = entity.type === 'moose' ? 'Big moose moving in — keep shooting pucks!' : 'Tough bear moving in — hit it again!';
        return entity;
      }

      if (roll < 0.18 + difficulty * 0.24) {
        entity.variant = 'fast';
        entity.vx *= 1.12 + difficulty * 0.22;
        entity.message = entity.type === 'sister' ? 'Fast spin move incoming!' : `${entity.type[0].toUpperCase()}${entity.type.slice(1)} speeding in!`;
      }

      return entity;
    }

    function spawnMovingEncounter(state, difficulty, options = {}) {
      const template = WAVE[waveIndex % WAVE.length];
      waveIndex += 1;
      const entity = applyVariant({
        ...template,
        key: `moving-${template.type}-${Date.now()}-${waveIndex}`,
        fromMovingGameplayPass: true,
        fromComputerMode: computerMode,
        comboSpawn: Boolean(options.comboSpawn)
      }, difficulty);
      state.entities.push(entity);
      state.message = entity.message || template.message;
      if (status) status.textContent = state.message;
      maybeQueueComboSpawn(difficulty);
    }

    function maybeQueueComboSpawn(difficulty) {
      // Complexity boost: later in a run, a second encounter can follow shortly
      // after the first one. The guard prevents runaway setTimeout chains.
      if (comboSpawnQueued || difficulty <= 0.08) return;
      if (Math.random() >= 0.16 + 0.18 * difficulty) return;
      comboSpawnQueued = true;
      window.setTimeout(() => {
        comboSpawnQueued = false;
        const state = getPlayableState();
        if (!state) return;
        const activeLimit = difficulty > 0.7 ? 3 : 2;
        if (activeMovingGameplayEntities(state).length >= activeLimit + 1) return;
        spawnMovingEncounter(state, difficulty * 0.8, { comboSpawn: true });
      }, COMBO_SPAWN_DELAY_MS);
    }

    function runMovingGameplay() {
      const state = getPlayableState();
      if (state) {
        const now = performance.now();
        if (!firstPlayableAt) {
          firstPlayableAt = now;
          nextSpawnAt = now + 250;
        }
        const difficulty = difficultyFor(state, now);
        state.difficulty = difficulty;
        const activeLimit = difficulty > 0.7 ? 3 : 2;
        if (now >= nextSpawnAt && activeMovingGameplayEntities(state).length < activeLimit) {
          spawnMovingEncounter(state, difficulty);
          const spawnInterval = Math.max(MIN_SPAWN_MS, BASE_SPAWN_MS * (1 - difficulty * 0.6));
          const jitter = Math.random() * SPAWN_JITTER_MS - SPAWN_JITTER_MS / 2;
          nextSpawnAt = now + spawnInterval + jitter;
        }
      }
      window.requestAnimationFrame(runMovingGameplay);
    }

    runMovingGameplay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
