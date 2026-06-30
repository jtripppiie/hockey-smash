(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.9 Dad Ride-In';
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const GROUND_Y = DESIGN_HEIGHT * 0.82;
  const DAD_WIDTH = 118;
  const DAD_HEIGHT = 104;
  const DAD_START_X = 1060;
  const DAD_STOP_X = 735;
  const DAD_SPEED = 185;
  const DAD_VISIBLE_MS = 9000;
  const DAD_TRIGGER_TIME = 42;

  let activeState = null;
  let dadNode = null;
  let dadWorldX = DAD_START_X;
  let dadStartedAt = 0;
  let dadDone = false;
  let styleNode = null;

  function api() {
    return window.RTA_HOCKEY_SMASH;
  }

  function getState() {
    const state = api()?.getState?.();
    if (!state || !state.player || ['splash', 'transition', 'tryAgain'].includes(state.mode)) return null;
    if (!Array.isArray(state.entities)) state.entities = [];
    return state;
  }

  function playerName() {
    return api()?.getPlayerConfig?.()?.name || 'Daniel';
  }

  function canvasRect() {
    return document.getElementById('hockey-canvas')?.getBoundingClientRect?.() || null;
  }

  function syncBuildBadge() {
    const text = 'Hockey Smash v0.14.9 · Build 2026-06-30.65';
    const badge = document.getElementById('hockey-build-badge');
    if (badge && badge.textContent !== text) badge.textContent = text;
    if (api()?.getVersion) api().getVersion = () => 'Hockey Smash v0.14.9';
  }

  function ensureStyles() {
    if (styleNode?.isConnected) return;
    styleNode = document.createElement('style');
    styleNode.textContent = `
      .hockey-dad-ride-in {
        position: fixed;
        left: 0;
        top: 0;
        width: 118px;
        height: 104px;
        z-index: 34;
        pointer-events: none;
        filter: drop-shadow(0 10px 14px rgba(0,0,0,.38));
      }
      .hockey-dad-ride-in img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .hockey-dad-ride-in__bubble {
        position: absolute;
        left: calc(50% - 44px);
        bottom: calc(100% + 10px);
        transform: translateX(-50%);
        min-width: 250px;
        padding: 0.6rem 0.72rem;
        border: 3px solid rgba(255,255,255,.95);
        border-radius: 1rem;
        background: rgba(15,23,42,.94);
        color: #fff7d6;
        font: 1000 15px/1.18 system-ui, sans-serif;
        text-align: center;
        box-shadow: 0 10px 24px rgba(0,0,0,.35);
        white-space: nowrap;
      }
    `;
    document.head.appendChild(styleNode);
  }

  function resetForState(state) {
    activeState = state;
    dadWorldX = DAD_START_X;
    dadStartedAt = 0;
    dadDone = false;
    removeDadNode();
  }

  function wildlifeStageHasStarted(state) {
    if (!state) return false;
    const hasWildlife = state.entities.some((entity) => (
      entity && !entity.dead && ['bear', 'moose', 'chargingMoose'].includes(entity.type)
    ));
    return hasWildlife || Number(state.time || 0) >= DAD_TRIGGER_TIME;
  }

  function shouldStartDad(state) {
    if (!state || dadDone || dadStartedAt) return false;
    return wildlifeStageHasStarted(state);
  }

  function ensureDadNode() {
    if (dadNode?.isConnected) return dadNode;
    dadNode = document.createElement('div');
    dadNode.className = 'hockey-dad-ride-in';
    dadNode.dataset.hockeyDadRideIn = DISPLAY_VERSION;

    const img = document.createElement('img');
    img.src = 'assets/hockey-smash/sprites/dad.webp';
    img.alt = '';

    const bubble = document.createElement('div');
    bubble.className = 'hockey-dad-ride-in__bubble';
    bubble.textContent = `${playerName()}, do your homework!`;

    dadNode.appendChild(img);
    dadNode.appendChild(bubble);
    document.body.appendChild(dadNode);
    return dadNode;
  }

  function removeDadNode() {
    dadNode?.remove?.();
    dadNode = null;
  }

  function positionDadNode() {
    const rect = canvasRect();
    if (!rect?.width || !rect?.height || !dadNode) return;
    const scaleX = rect.width / DESIGN_WIDTH;
    const scaleY = rect.height / DESIGN_HEIGHT;
    const left = rect.left + dadWorldX * scaleX;
    const top = rect.top + (GROUND_Y - DAD_HEIGHT) * scaleY;
    dadNode.style.left = `${left}px`;
    dadNode.style.top = `${top}px`;
    dadNode.style.width = `${Math.max(88, DAD_WIDTH * scaleX)}px`;
    dadNode.style.height = `${Math.max(78, DAD_HEIGHT * scaleY)}px`;
    const bubble = dadNode.querySelector('.hockey-dad-ride-in__bubble');
    if (bubble) bubble.textContent = `${playerName()}, do your homework!`;
  }

  function suppressOldDadCast(state) {
    state.entities.forEach((entity) => {
      if (!entity || entity.dead) return;
      if (entity.type === 'dad') {
        entity.bubble = `${playerName()}, do your homework!`;
      }
      if (entity.type === 'dadJoke') {
        entity.bubble = `${playerName()}, do your homework!`;
      }
    });
  }

  function updateDad(state, dt) {
    suppressOldDadCast(state);
    if (shouldStartDad(state)) dadStartedAt = performance.now();
    if (!dadStartedAt || dadDone) return;

    ensureDadNode();
    dadWorldX = Math.max(DAD_STOP_X, dadWorldX - DAD_SPEED * dt);
    positionDadNode();

    state.message = `${playerName()}, do your homework!`;
    const status = document.getElementById('hockey-status');
    if (status) status.textContent = state.message;

    if (performance.now() - dadStartedAt >= DAD_VISIBLE_MS) {
      dadDone = true;
      removeDadNode();
    }
  }

  let lastFrame = performance.now();
  function loop(now) {
    ensureStyles();
    syncBuildBadge();
    const dt = Math.min(0.05, Math.max(0.008, (now - lastFrame) / 1000 || 0.016));
    lastFrame = now;

    const state = getState();
    if (state && state !== activeState) resetForState(state);
    if (state) updateDad(state, dt);
    else {
      activeState = null;
      removeDadNode();
    }

    window.requestAnimationFrame(loop);
  }

  window.requestAnimationFrame(loop);
})();
