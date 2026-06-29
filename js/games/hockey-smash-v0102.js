(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.12.0';
  const DISPLAY_BUILD = 'Build 2026-06-29.35';
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const GROUND_Y = DESIGN_HEIGHT * 0.82;
  const BASE_SPAWN_MS = 1600;
  const MIN_SPAWN_MS = 640;
  const SPAWN_JITTER_MS = 260;
  const params = new URLSearchParams(window.location.search);
  const computerMode = params.get('computerMode') === '1';

  // This layer does not control Daniel.
  // It only adds moving gameplay objects to state.entities. The core game loop
  // already moves entities by vx * dt and checks overlap. Computer Mode uses
  // this same encounter pass so watch mode and normal play stay close together.
  const WAVE = [
    {
      type: 'salmon',
      x: DESIGN_WIDTH + 120,
      y: 245,
      width: 74,
      height: 42,
      vx: -420,
      vy: -80,
      hp: 1,
      damage: 0,
      dodgeDamage: 8,
      flip: -1,
      message: 'Fish flying in — duck or jump!'
    },
    {
      type: 'bear',
      x: DESIGN_WIDTH + 90,
      y: GROUND_Y - 104,
      width: 122,
      height: 104,
      vx: -245,
      hp: 2,
      maxHp: 2,
      damage: 12,
      message: 'Bear moving in — use the stick and puck!'
    },
    {
      type: 'salmon',
      x: -120,
      y: 285,
      width: 72,
      height: 40,
      vx: 410,
      vy: -60,
      hp: 1,
      damage: 0,
      dodgeDamage: 8,
      flip: 1,
      message: 'Fish crossing back — duck or jump!'
    },
    {
      type: 'mom',
      x: DESIGN_WIDTH + 40,
      y: GROUND_Y - 88,
      width: 84,
      height: 88,
      vx: -145,
      hp: 2,
      damage: 5,
      bubble: 'Daniel, clean your room!',
      message: 'Mom interruption moving in!'
    },
    {
      type: 'sister',
      x: DESIGN_WIDTH + 70,
      y: GROUND_Y - 94,
      width: 84,
      height: 94,
      vx: -175,
      hp: 2,
      damage: 7,
      bubble: 'Spin move!',
      message: 'Sister spinning in!'
    },
    {
      type: 'moose',
      x: DESIGN_WIDTH + 120,
      y: GROUND_Y - 118,
      width: 146,
      height: 118,
      vx: -195,
      hp: 3,
      maxHp: 3,
      damage: 16,
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

    function applyVariant(entity, difficulty) {
      const roll = Math.random();
      entity.difficulty = Number(difficulty.toFixed(2));
      entity.variant = 'normal';

      if (entity.type === 'salmon') {
        if (roll < 0.22 + difficulty * 0.28) {
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

    function spawnMovingEncounter(state, difficulty) {
      const template = WAVE[waveIndex % WAVE.length];
      waveIndex += 1;
      const entity = applyVariant({
        ...template,
        key: `moving-${template.type}-${Date.now()}-${waveIndex}`,
        fromMovingGameplayPass: true,
        fromComputerMode: computerMode
      }, difficulty);
      state.entities.push(entity);
      state.message = entity.message || template.message;
      if (status) status.textContent = state.message;
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
