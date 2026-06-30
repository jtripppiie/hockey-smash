(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.11 Grounded Cameos';
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const GROUND_Y = DESIGN_HEIGHT * 0.82;

  const CAMEO_WORLD_X = 720;
  const CAMEO_WIDTH = 84;
  const CAMEO_HEIGHT = 96;
  const CAMEO_VISIBLE_MS = 8000;

  const DAD_START_X = 1060;
  const DAD_STOP_X = 735;
  const DAD_EXIT_X = DESIGN_WIDTH + 170;
  const DAD_WIDTH = 118;
  const DAD_HEIGHT = 104;
  const DAD_SPEED = 185;
  const DAD_EXIT_SPEED = 235;
  const DAD_LINE_HOLD_MS = 3400;
  const DAD_TRIGGER_TIME = 42;

  let activeState = null;
  let cameoStartedAt = 0;
  let cameoDone = false;
  let dadStartedAt = 0;
  let dadArrivedAt = 0;
  let dadLeaving = false;
  let dadDone = false;
  let dadWorldX = DAD_START_X;
  let dadNode = null;
  let styleNode = null;
  let lastFrame = performance.now();

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
    const text = 'Hockey Smash v0.14.11 · Build 2026-06-30.67';
    const badge = document.getElementById('hockey-build-badge');
    if (badge && badge.textContent !== text) badge.textContent = text;
    if (api()?.getVersion) api().getVersion = () => 'Hockey Smash v0.14.11';
  }

  function ensureOverrides() {
    if (styleNode?.isConnected) return;
    styleNode = document.createElement('style');
    styleNode.textContent = `
      .hockey-clean-room-bubble {
        left: calc(50% - 24px) !important;
        bottom: calc(100% + 8px) !important;
        transform: translateX(-50%) !important;
      }
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
        transform-origin: 50% 50%;
        transition: transform 0.22s ease;
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
      .hockey-dad-ride-in.is-leaving .hockey-dad-ride-in__bubble {
        opacity: 0;
      }
    `;
    document.head.appendChild(styleNode);
  }

  function resetForState(state) {
    activeState = state;
    cameoStartedAt = 0;
    cameoDone = false;
    dadStartedAt = 0;
    dadArrivedAt = 0;
    dadLeaving = false;
    dadDone = false;
    dadWorldX = DAD_START_X;
    removeDadNode();
  }

  function wildlifeStageHasStarted(state) {
    if (!state) return false;
    const time = Number(state.time) || 0;
    const hasWildlife = state.entities.some((entity) => (
      entity && !entity.dead && ['bear', 'moose', 'chargingMoose'].includes(entity.type)
    ));
    return hasWildlife || time > 32;
  }

  function cameoShouldShow(state) {
    if (!state || cameoDone) return false;
    if (!wildlifeStageHasStarted(state)) return false;

    if (!cameoStartedAt) cameoStartedAt = performance.now();
    if (performance.now() - cameoStartedAt >= CAMEO_VISIBLE_MS) {
      cameoDone = true;
      return false;
    }
    return true;
  }

  function groundedPositionFor(node) {
    const rect = canvasRect();
    if (!rect?.width || !rect?.height || !node) return null;
    const scaleX = rect.width / DESIGN_WIDTH;
    const scaleY = rect.height / DESIGN_HEIGHT;
    const width = Math.max(62, CAMEO_WIDTH * scaleX);
    const height = Math.max(72, CAMEO_HEIGHT * scaleY);
    return {
      left: rect.left + CAMEO_WORLD_X * scaleX,
      top: rect.top + (GROUND_Y - CAMEO_HEIGHT) * scaleY,
      width,
      height,
    };
  }

  function hideAlaskaCameos() {
    document.querySelectorAll('.hockey-sideline-cameo').forEach((node) => {
      node.hidden = true;
      node.style.opacity = '0';
      node.style.display = 'none';
    });
  }

  function groundAlaskaCameo(state) {
    const shouldShow = cameoShouldShow(state);
    if (!shouldShow) {
      hideAlaskaCameos();
      return;
    }

    document.querySelectorAll('.hockey-sideline-cameo').forEach((node) => {
      const pos = groundedPositionFor(node);
      if (!pos) return;

      node.hidden = false;
      Object.assign(node.style, {
        display: 'block',
        opacity: '1',
        position: 'fixed',
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        right: 'auto',
        bottom: 'auto',
        width: `${pos.width}px`,
        height: `${pos.height}px`,
        zIndex: '32',
        transform: 'translateY(0)',
        pointerEvents: 'none',
      });

      const sprite = node.querySelector('img');
      if (sprite) {
        Object.assign(sprite.style, {
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        });
      }

      const label = node.querySelector('span');
      if (label) label.textContent = "Hey, you're cute";
    });
  }

  function shouldStartDad(state) {
    if (!state || dadDone || dadStartedAt) return false;
    return wildlifeStageHasStarted(state) || Number(state.time || 0) >= DAD_TRIGGER_TIME;
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
    dadNode.style.left = `${rect.left + dadWorldX * scaleX}px`;
    dadNode.style.top = `${rect.top + (GROUND_Y - DAD_HEIGHT) * scaleY}px`;
    dadNode.style.width = `${Math.max(88, DAD_WIDTH * scaleX)}px`;
    dadNode.style.height = `${Math.max(78, DAD_HEIGHT * scaleY)}px`;
    dadNode.classList.toggle('is-leaving', dadLeaving);

    const sprite = dadNode.querySelector('img');
    if (sprite) sprite.style.transform = dadLeaving ? 'scaleX(-1)' : 'scaleX(1)';

    const bubble = dadNode.querySelector('.hockey-dad-ride-in__bubble');
    if (bubble) bubble.textContent = `${playerName()}, do your homework!`;
  }

  function normalizeDadBubbles(state) {
    state.entities.forEach((entity) => {
      if (!entity || entity.dead) return;
      if (entity.type === 'dad' || entity.type === 'dadJoke') {
        entity.bubble = `${playerName()}, do your homework!`;
      }
    });
    if (state.dad) state.dad.bubble = `${playerName()}, do your homework!`;
  }

  function startDadRideIn() {
    dadStartedAt = performance.now();
    dadArrivedAt = 0;
    dadLeaving = false;
    dadWorldX = DAD_START_X;
  }

  function updateDadRideIn(state, dt) {
    normalizeDadBubbles(state);
    if (shouldStartDad(state)) startDadRideIn();
    if (!dadStartedAt || dadDone) return;

    ensureDadNode();

    if (!dadArrivedAt) {
      dadWorldX = Math.max(DAD_STOP_X, dadWorldX - DAD_SPEED * dt);
      if (dadWorldX <= DAD_STOP_X + 0.5) dadArrivedAt = performance.now();
    } else if (!dadLeaving && performance.now() - dadArrivedAt >= DAD_LINE_HOLD_MS) {
      dadLeaving = true;
    }

    if (dadLeaving) {
      dadWorldX += DAD_EXIT_SPEED * dt;
      if (dadWorldX >= DAD_EXIT_X) {
        dadDone = true;
        removeDadNode();
        return;
      }
    }

    positionDadNode();

    if (!dadLeaving) {
      state.message = `${playerName()}, do your homework!`;
      const status = document.getElementById('hockey-status');
      if (status) status.textContent = state.message;
    }
  }

  function runAfterReleaseLayer(dt) {
    const state = getState();
    if (state && state !== activeState) resetForState(state);
    if (!state) {
      activeState = null;
      hideAlaskaCameos();
      removeDadNode();
      return;
    }
    groundAlaskaCameo(state);
    updateDadRideIn(state, dt);
  }

  function loop(now) {
    const dt = Math.min(0.05, Math.max(0.008, (now - lastFrame) / 1000 || 0.016));
    lastFrame = now;
    ensureOverrides();
    syncBuildBadge();

    // Run after the release layer's own requestAnimationFrame work so this file wins.
    window.setTimeout(() => runAfterReleaseLayer(dt), 0);
    window.requestAnimationFrame(loop);
  }

  window.requestAnimationFrame(loop);
})();
