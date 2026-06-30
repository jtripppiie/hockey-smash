(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.6 Gameplay Fixes';
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const GROUND_Y = DESIGN_HEIGHT * 0.82;
  const MOM_WORLD_X = 620;
  const MOM_WIDTH = 96;
  const MOM_HEIGHT = 104;
  const MOM_TRIGGER_DISTANCE = 60;
  const MOM_TRIGGER_TIME = 28;
  const MOM_AUTO_DISMISS_MS = 6500;

  let activeState = null;
  let lastHealth = null;
  let momActive = false;
  let momAcknowledged = false;
  let momStartedAt = 0;
  let momNode = null;
  let rightArrowNode = null;
  let fishHitNode = null;
  let styleNode = null;
  let lastFishHitAt = 0;

  function api() {
    return window.RTA_HOCKEY_SMASH;
  }

  function state() {
    const s = api()?.getState?.();
    if (!s || !s.player || ['splash', 'transition', 'tryAgain'].includes(s.mode)) return null;
    if (!Array.isArray(s.entities)) s.entities = [];
    if (!Array.isArray(s.effects)) s.effects = [];
    return s;
  }

  function playerName() {
    return api()?.getPlayerConfig?.()?.name || 'Daniel';
  }

  function metrics() {
    return window.RTA_HOCKEY_SMASH_SCORE?.getMetrics?.() || {};
  }

  function distance() {
    return Number(metrics().distance) || 0;
  }

  function canvasRect() {
    return document.getElementById('hockey-canvas')?.getBoundingClientRect?.() || null;
  }

  function setStatus(text) {
    const status = document.getElementById('hockey-status');
    if (status && text) status.textContent = text;
  }

  function ensureStyles() {
    if (styleNode?.isConnected) return;
    styleNode = document.createElement('style');
    styleNode.textContent = `
      [data-hockey-fish-warning]::after {
        content: 'MOVE';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 0.12rem 0.34rem;
        border-radius: 999px;
        background: rgba(5, 8, 13, 0.9);
        color: #fff27a;
        font: 1000 10px/1 system-ui, sans-serif;
        letter-spacing: 0.08em;
        white-space: nowrap;
      }
      .hockey-fish-hit-flash {
        box-shadow: inset 0 0 0 9999px rgba(251, 113, 133, 0.16);
      }
      .hockey-clean-room-mom {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 35;
        width: 96px;
        height: 104px;
        pointer-events: none;
        filter: drop-shadow(0 9px 13px rgba(0,0,0,.38));
      }
      .hockey-clean-room-mom img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .hockey-clean-room-bubble {
        position: absolute;
        left: 50%;
        bottom: calc(100% - 10px);
        transform: translateX(-50%);
        min-width: 230px;
        padding: 0.6rem 0.7rem;
        border: 3px solid rgba(255,255,255,.95);
        border-radius: 1rem;
        background: rgba(15,23,42,.94);
        color: #fff7d6;
        font: 1000 15px/1.18 system-ui, sans-serif;
        text-align: center;
        box-shadow: 0 10px 24px rgba(0,0,0,.35);
      }
      .hockey-right-arrow-cue {
        position: fixed;
        z-index: 28;
        width: 64px;
        height: 42px;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: rgba(255, 242, 122, 0.92);
        color: #101923;
        font: 1000 34px/1 system-ui, sans-serif;
        box-shadow: 0 8px 22px rgba(0,0,0,.28);
        pointer-events: none;
        animation: hockeyArrowNudge 0.72s ease-in-out infinite alternate;
      }
      @keyframes hockeyArrowNudge {
        from { transform: translateX(0); }
        to { transform: translateX(14px); }
      }
      .hockey-fish-hit-toast {
        position: fixed;
        z-index: 42;
        left: 50%;
        top: 22%;
        transform: translateX(-50%);
        padding: 0.55rem 0.85rem;
        border: 3px solid #fff;
        border-radius: 999px;
        background: rgba(127, 29, 29, .94);
        color: #fff7d6;
        font: 1000 16px/1 system-ui, sans-serif;
        box-shadow: 0 10px 24px rgba(0,0,0,.38);
        pointer-events: none;
      }
    `;
    document.head.appendChild(styleNode);
  }

  function syncRightArrow(s) {
    const rect = canvasRect();
    if (!rect?.width || !rect?.height) return;
    const shouldShow = distance() < 4 && s.player.x < 190 && !momActive;
    if (!shouldShow) {
      if (rightArrowNode) rightArrowNode.hidden = true;
      return;
    }
    if (!rightArrowNode) {
      rightArrowNode = document.createElement('div');
      rightArrowNode.className = 'hockey-right-arrow-cue';
      rightArrowNode.setAttribute('aria-hidden', 'true');
      rightArrowNode.textContent = '➜';
      document.body.appendChild(rightArrowNode);
    }
    rightArrowNode.hidden = false;
    rightArrowNode.style.left = `${rect.left + rect.width * 0.44}px`;
    rightArrowNode.style.top = `${rect.top + rect.height * 0.53}px`;
  }

  function resetForNewState(s) {
    activeState = s;
    lastHealth = s?.player?.health ?? null;
    momActive = false;
    momAcknowledged = false;
    momStartedAt = 0;
    removeMomNode();
  }

  function normalizeFriendlyCast(s) {
    s.entities.forEach((entity) => {
      if (!entity || entity.dead) return;

      // Mom is no longer a normal moving hazard. The clean-room blocker below owns her event.
      if (entity.type === 'mom') {
        entity.dead = true;
        return;
      }

      // Alaska boy/girl are cute sideline/friendly cameos, not combat taunts.
      if (entity.type === 'alaskanBoy' || entity.type === 'alaskanGirl') {
        entity.bubble = "Hey, you're cute";
        entity.damage = 0;
      }
    });

    document.querySelectorAll('.hockey-sideline-cameo span').forEach((label) => {
      label.textContent = "Hey, you're cute";
    });
  }

  function shouldTriggerMom(s) {
    if (momActive || momAcknowledged) return false;
    if (!s?.player) return false;
    return distance() >= MOM_TRIGGER_DISTANCE || Number(s.time || 0) >= MOM_TRIGGER_TIME;
  }

  function ensureMomNode() {
    if (momNode?.isConnected) return momNode;
    momNode = document.createElement('div');
    momNode.className = 'hockey-clean-room-mom';
    momNode.dataset.hockeyCleanRoomMom = DISPLAY_VERSION;

    const img = document.createElement('img');
    img.src = 'assets/hockey-smash/sprites/mom.webp';
    img.alt = '';

    const bubble = document.createElement('div');
    bubble.className = 'hockey-clean-room-bubble';
    bubble.innerHTML = '<span></span>';

    momNode.appendChild(img);
    momNode.appendChild(bubble);
    document.body.appendChild(momNode);
    return momNode;
  }

  function positionMomNode() {
    const rect = canvasRect();
    if (!rect?.width || !rect?.height || !momNode) return;
    const scaleX = rect.width / DESIGN_WIDTH;
    const scaleY = rect.height / DESIGN_HEIGHT;
    const left = rect.left + MOM_WORLD_X * scaleX;
    const top = rect.top + (GROUND_Y - MOM_HEIGHT) * scaleY;
    momNode.style.left = `${left}px`;
    momNode.style.top = `${top}px`;
    momNode.style.width = `${Math.max(74, MOM_WIDTH * scaleX)}px`;
    momNode.style.height = `${Math.max(80, MOM_HEIGHT * scaleY)}px`;
    const bubbleText = momNode.querySelector('.hockey-clean-room-bubble span');
    if (bubbleText) bubbleText.textContent = `${playerName()}, clean your room`;
  }

  function removeMomNode() {
    momNode?.remove?.();
    momNode = null;
  }

  function triggerMom(s) {
    momActive = true;
    momStartedAt = performance.now();
    ensureMomNode();
    positionMomNode();
    s.message = `${playerName()}, clean your room`;
    setStatus(s.message);
  }

  function pauseHazardsForMom(s) {
    const p = s.player;
    p.x = Math.min(p.x, MOM_WORLD_X - p.width - 10);
    p.invincible = Math.max(p.invincible || 0, 0.35);

    s.entities.forEach((entity) => {
      if (!entity || entity.dead) return;
      if (entity._preMomVx == null) entity._preMomVx = entity.vx || 0;
      if (entity._preMomVy == null) entity._preMomVy = entity.vy || 0;
      entity.vx = 0;
      entity.vy = 0;
      entity.damage = 0;
      if (entity.type === 'salmon') entity.dodgeDamage = 0;
    });
  }

  function resumeHazardsAfterMom(s) {
    s.entities.forEach((entity) => {
      if (!entity) return;
      if (entity._preMomVx != null) entity.vx = entity._preMomVx;
      if (entity._preMomVy != null) entity.vy = entity._preMomVy;
      delete entity._preMomVx;
      delete entity._preMomVy;
    });
  }

  function dismissMom() {
    const s = state();
    if (s) {
      resumeHazardsAfterMom(s);
      s.message = `${playerName()} keeps running!`;
      setStatus(s.message);
    }
    momActive = false;
    momAcknowledged = true;
    momStartedAt = 0;
    removeMomNode();
  }

  function syncMom(s) {
    if (shouldTriggerMom(s)) triggerMom(s);
    if (!momActive) return;
    ensureMomNode();
    positionMomNode();
    pauseHazardsForMom(s);
    if (momStartedAt && performance.now() - momStartedAt >= MOM_AUTO_DISMISS_MS) dismissMom();
  }

  function showFishFeedback(amount, s) {
    lastFishHitAt = performance.now();
    document.body.classList.add('hockey-fish-hit-flash');
    window.setTimeout(() => document.body.classList.remove('hockey-fish-hit-flash'), 180);

    if (!fishHitNode) {
      fishHitNode = document.createElement('div');
      fishHitNode.className = 'hockey-fish-hit-toast';
      document.body.appendChild(fishHitNode);
    }
    fishHitNode.textContent = `Fish hit! -${amount} HP`;
    fishHitNode.hidden = false;
    window.setTimeout(() => {
      if (performance.now() - lastFishHitAt >= 500 && fishHitNode) fishHitNode.hidden = true;
    }, 700);

    s.effects?.push?.({
      x: s.player.x + s.player.width / 2,
      y: Math.max(70, s.player.y - 20),
      text: `-${amount} HP`,
      life: 0.65,
    });
    setStatus(`Fish hit ${playerName()} for ${amount} damage. Watch the MOVE zone!`);
  }

  function watchFishDamage(s) {
    const health = Number(s.player.health);
    if (lastHealth == null) {
      lastHealth = health;
      return;
    }
    if (health < lastHealth) {
      const amount = Math.round(lastHealth - health);
      const message = String(s.message || '');
      if (/fish|salmon|splash/i.test(message)) showFishFeedback(amount, s);
    }
    lastHealth = health;
  }

  function suppressEarthquakeArtifacts() {
    // Belt-and-suspenders backup: the dedicated disable layer prevents spawning.
    // If an older cached script still creates an Earthquake DOM node, hide it.
    document.querySelectorAll('[data-powerup="earthquake"]').forEach((node) => {
      node.hidden = true;
      node.style.display = 'none';
    });
  }

  function loop() {
    ensureStyles();
    suppressEarthquakeArtifacts();
    const s = state();
    if (s && s !== activeState) resetForNewState(s);

    if (s) {
      normalizeFriendlyCast(s);
      syncRightArrow(s);
      syncMom(s);
      watchFishDamage(s);
    } else {
      if (rightArrowNode) rightArrowNode.hidden = true;
      removeMomNode();
    }

    window.setTimeout(() => window.requestAnimationFrame(loop), 0);
  }

  function ready() {
    ensureStyles();
    window.requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
