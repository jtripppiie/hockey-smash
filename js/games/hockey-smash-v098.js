(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.9.8';
  const DISPLAY_BUILD = 'Build 2026-06-29.19';
  const DESIGN_WIDTH = 1024;
  const GROUND_Y = 576 * 0.82;
  const params = new URLSearchParams(window.location.search);
  const computerMode = params.get('computerMode') === '1';

  const ENCOUNTERS = [
    { key: 'fish-1', stage: 0, x: 720, type: 'salmon', width: 74, height: 42, y: 300, vx: -2.2, message: 'Fish incoming — jump or slide!' },
    { key: 'bear-1', stage: 1, x: 760, type: 'bear', width: 132, height: 112, y: GROUND_Y - 112, vx: -0.55, hp: 2, message: 'Bear crossing — use the stick!' },
    { key: 'mom-1', stage: 1, x: 560, type: 'mom', width: 96, height: 96, y: GROUND_Y - 96, vx: 0, hp: 2, bubble: 'Daniel, clean your room!', message: 'Mom interruption!' },
    { key: 'moose-1', stage: 2, x: 760, type: 'moose', width: 150, height: 120, y: GROUND_Y - 120, vx: -0.42, hp: 3, message: 'Moose on the road — slide or stick!' },
    { key: 'sister-1', stage: 2, x: 610, type: 'sister', width: 96, height: 96, y: GROUND_Y - 96, vx: 0, hp: 2, bubble: 'Daniel, heads up!', message: 'Sister warning!' },
    { key: 'fish-2', stage: 3, x: 740, type: 'salmon', width: 82, height: 46, y: 250, vx: -2.8, message: 'Big salmon run!' },
    { key: 'dad-1', stage: 4, x: 720, type: 'dad', width: 120, height: 130, y: GROUND_Y - 130, vx: -0.3, hp: 5, bubble: 'Daniel, mow the lawn!', message: 'Dad challenge — stick attack!' },
    { key: 'dad-joke-1', stage: 4, x: 560, type: 'dadJoke', width: 92, height: 54, y: 260, vx: -1.8, hp: 1, bubble: 'Hi hungry, I’m Dad!', message: 'Dodge the Dad joke!' },
  ];

  function onReady() {
    const api = window.RTA_HOCKEY_SMASH;
    const badge = document.getElementById('hockey-build-badge');
    const status = document.getElementById('hockey-status');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api?.getVersion) api.getVersion = () => DISPLAY_VERSION;
    if (!api || computerMode) return;

    const spawned = new Set();
    const cleared = new Set();
    let lastDamageAt = 0;

    function getPlayableState() {
      const state = api.getState?.();
      if (!state || !state.player || state.mode === 'splash' || state.mode === 'transition' || state.mode === 'tryAgain') return null;
      if (!Array.isArray(state.entities)) state.entities = [];
      return state;
    }

    function stageOf(state) {
      if (typeof state.travelStage === 'number') return state.travelStage;
      return Math.max(0, Math.min(4, Math.floor((state.time || 0) / 10)));
    }

    function spawnEncounter(state, encounter) {
      if (spawned.has(encounter.key) || cleared.has(encounter.key)) return;
      spawned.add(encounter.key);
      const entity = {
        key: encounter.key,
        type: encounter.type,
        x: encounter.x,
        y: encounter.y,
        width: encounter.width,
        height: encounter.height,
        vx: encounter.vx || 0,
        hp: encounter.hp || 1,
        bubble: encounter.bubble || '',
        fromGameplayPass: true,
      };
      state.entities.push(entity);
      state.message = encounter.message;
      if (status) status.textContent = encounter.message;
    }

    function overlaps(a, b) {
      return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    }

    function playerBox(player) {
      return {
        x: player.x + 16,
        y: player.y + 12,
        width: Math.max(30, player.width - 32),
        height: Math.max(42, player.height - 20),
      };
    }

    function entityBox(entity) {
      return {
        x: entity.x + entity.width * 0.12,
        y: entity.y + entity.height * 0.14,
        width: entity.width * 0.76,
        height: entity.height * 0.76,
      };
    }

    function isAttackActive(player) {
      return Boolean(player.attackTimer && player.attackTimer > 0);
    }

    function isSliding() {
      return document.body.classList.contains('hockey-slide-active');
    }

    function damagePlayer(state, amount, message) {
      const now = performance.now();
      if (now - lastDamageAt < 850) return;
      lastDamageAt = now;
      state.player.health = Math.max(0, state.player.health - amount);
      state.message = message;
      if (status) status.textContent = message;
      const meter = document.getElementById('hockey-health');
      if (meter) meter.value = state.player.health;
    }

    function handleEntityGameplay(state, entity) {
      if (!entity.fromGameplayPass || entity.dead) return;
      const player = state.player;
      if (!overlaps(playerBox(player), entityBox(entity))) return;

      if ((entity.type === 'bear' || entity.type === 'moose' || entity.type === 'dad') && isAttackActive(player)) {
        entity.hp -= 1;
        state.message = `${entity.type.toUpperCase()} hit!`;
        if (status) status.textContent = state.message;
        if (entity.hp <= 0) {
          entity.dead = true;
          cleared.add(entity.key);
          state.message = `${entity.type.toUpperCase()} cleared!`;
          if (status) status.textContent = state.message;
        }
        return;
      }

      if ((entity.type === 'moose' || entity.type === 'salmon' || entity.type === 'dadJoke') && isSliding()) {
        entity.dead = true;
        cleared.add(entity.key);
        state.message = `${entity.type === 'salmon' ? 'Fish' : entity.type} dodged!`;
        if (status) status.textContent = state.message;
        return;
      }

      if (entity.type === 'mom' || entity.type === 'sister') {
        state.player.vx *= 0.35;
        damagePlayer(state, 4, entity.bubble || 'Family interruption!');
        entity.dead = true;
        cleared.add(entity.key);
        return;
      }

      const damage = entity.type === 'dad' ? 12 : entity.type === 'bear' || entity.type === 'moose' ? 10 : 6;
      damagePlayer(state, damage, `${entity.type.toUpperCase()} hit Daniel!`);
    }

    function updateGameplayPass() {
      const state = getPlayableState();
      if (state) {
        const stage = stageOf(state);
        ENCOUNTERS.forEach((encounter) => {
          if (encounter.stage === stage) spawnEncounter(state, encounter);
        });

        state.entities.forEach((entity) => handleEntityGameplay(state, entity));
        state.entities = state.entities.filter((entity) => !entity.fromGameplayPass || (!entity.dead && entity.x > -180 && entity.x < DESIGN_WIDTH + 260));
      }
      window.requestAnimationFrame(updateGameplayPass);
    }

    updateGameplayPass();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
