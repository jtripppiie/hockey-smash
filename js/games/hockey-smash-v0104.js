(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.12.0';
  const DISPLAY_BUILD = 'Build 2026-06-29.35';
  const DESIGN_WIDTH = 1024;
  const STORAGE_KEY = 'hockeySmashHighScore';
  const BASE_DISTANCE_SPEED = 14;
  const COMBO_TIMEOUT = 2.5;

  let api = null;
  let canvas = null;
  let scoreEl = null;
  let splashHighEl = null;
  let originalCanvasTransform = '';
  let activeState = null;
  let lastFrame = performance.now();
  let metrics = createFreshMetrics();

  function createFreshMetrics() {
    return {
      distance: 0,
      survivalTime: 0,
      bonusScore: 0,
      score: 0,
      combo: 0,
      comboTimer: 0,
      difficulty: 0,
      highScore: loadHighScore(),
      lastHealth: null,
      shake: 0,
      newHighScore: false,
    };
  }

  function loadHighScore() {
    try {
      return Number(window.localStorage.getItem(STORAGE_KEY) || 0) || 0;
    } catch (error) {
      return 0;
    }
  }

  function saveHighScore(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch (error) {
      // localStorage can be unavailable in private browsing or strict contexts.
    }
  }

  function onReady() {
    api = window.RTA_HOCKEY_SMASH;
    canvas = document.getElementById('hockey-canvas');
    originalCanvasTransform = canvas?.style?.transform || '';

    const badge = document.getElementById('hockey-build-badge');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api?.getVersion) api.getVersion = () => DISPLAY_VERSION;

    ensureScoreHud();
    exposeScoreHooks();
    window.requestAnimationFrame(runScoreLayer);
  }

  function ensureScoreHud() {
    const hud = document.querySelector('.hockey-hud');
    scoreEl = document.getElementById('hockey-score');
    if (hud && !scoreEl) {
      scoreEl = document.createElement('div');
      scoreEl.id = 'hockey-score';
      scoreEl.className = 'hockey-score';
      const status = document.getElementById('hockey-status');
      hud.insertBefore(scoreEl, status || null);
    }

    if (scoreEl) {
      Object.assign(scoreEl.style, {
        fontWeight: '900',
        letterSpacing: '.03em',
        textShadow: '0 2px 6px rgba(0,0,0,.45)',
        whiteSpace: 'nowrap',
      });
    }

    const splashContent = document.querySelector('.hockey-splash__content');
    if (splashContent && !document.getElementById('hockey-high-score')) {
      splashHighEl = document.createElement('p');
      splashHighEl.id = 'hockey-high-score';
      splashHighEl.className = 'hockey-high-score';
      splashHighEl.textContent = `High Score: ${metrics.highScore}`;
      splashContent.appendChild(splashHighEl);
    } else {
      splashHighEl = document.getElementById('hockey-high-score');
    }
  }

  function exposeScoreHooks() {
    window.RTA_HOCKEY_SMASH_SCORE = {
      recordPuckHit(payload = {}) {
        const destroyed = Boolean(payload.destroyed);
        addComboBonus(destroyed ? 200 : 80, destroyed ? 'KO!' : 'PUCK!', payload.state);
        metrics.shake = Math.max(metrics.shake, destroyed ? 0.18 : 0.09);
      },
      recordDodge(payload = {}) {
        addComboBonus(70, 'DODGE!', payload.state);
      },
      recordDamage(payload = {}) {
        resetCombo();
        metrics.shake = Math.max(metrics.shake, 0.28);
        const state = payload.state || activeState;
        if (state) state.message = payload.source === 'salmon' ? 'Fish clipped Daniel. Combo reset!' : 'Daniel got hit. Combo reset!';
      },
      getMetrics() {
        return { ...metrics };
      },
    };
  }

  function addComboBonus(points, label, state) {
    metrics.combo = Math.min(5, metrics.combo + 1);
    metrics.comboTimer = COMBO_TIMEOUT;
    metrics.bonusScore += points * metrics.combo;
    const targetState = state || activeState;
    if (targetState?.effects) {
      const player = targetState.player || { x: DESIGN_WIDTH / 2, y: 300, width: 50 };
      targetState.effects.push({
        x: player.x + player.width / 2,
        y: Math.max(80, player.y - 16),
        text: `${label} x${metrics.combo}`,
        life: 0.45,
      });
    }
  }

  function resetCombo() {
    metrics.combo = 0;
    metrics.comboTimer = 0;
  }

  function getState() {
    return api?.getState?.() || null;
  }

  function isPlayable(state) {
    return Boolean(state?.player) && !['splash', 'transition', 'tryAgain'].includes(state.mode);
  }

  function resetForState(state) {
    activeState = state;
    metrics = createFreshMetrics();
    metrics.lastHealth = state?.player?.health ?? null;
  }

  function runScoreLayer(now) {
    const dt = Math.min(0.05, Math.max(0.008, (now - lastFrame) / 1000 || 0.016));
    lastFrame = now;

    const state = getState();
    if (state && state !== activeState && state.player) resetForState(state);

    if (isPlayable(state)) {
      updateProgress(state, dt);
      detectDamage(state);
      applyScreenShake(dt);
    } else {
      clearScreenShake();
    }

    updateHud(state);
    window.requestAnimationFrame(runScoreLayer);
  }

  function updateProgress(state, dt) {
    const player = state.player;
    metrics.survivalTime += dt;
    metrics.distance += (BASE_DISTANCE_SPEED + Math.abs(player.vx || 0) * 0.018) * dt;
    metrics.difficulty = Math.min(1, metrics.survivalTime / 120);

    if (metrics.comboTimer > 0) {
      metrics.comboTimer = Math.max(0, metrics.comboTimer - dt);
      if (metrics.comboTimer === 0) metrics.combo = 0;
    }

    const baseScore = Math.floor(metrics.distance * 4) + metrics.bonusScore + metrics.combo * 25;
    metrics.score = Math.max(metrics.score, baseScore);

    if (metrics.score > metrics.highScore) {
      metrics.highScore = metrics.score;
      metrics.newHighScore = true;
      saveHighScore(metrics.highScore);
    }

    state.distance = metrics.distance;
    state.score = metrics.score;
    state.difficulty = metrics.difficulty;
    player.combo = metrics.combo;
    player.comboTimer = metrics.comboTimer;
  }

  function detectDamage(state) {
    const health = state.player?.health;
    if (typeof health !== 'number') return;
    if (metrics.lastHealth != null && health < metrics.lastHealth) {
      window.RTA_HOCKEY_SMASH_SCORE?.recordDamage?.({ state, amount: metrics.lastHealth - health });
    }
    metrics.lastHealth = health;
  }

  function applyScreenShake(dt) {
    if (!canvas) return;
    if (metrics.shake <= 0) {
      clearScreenShake();
      return;
    }
    metrics.shake = Math.max(0, metrics.shake - dt);
    const strength = Math.max(1, metrics.shake * 30);
    const x = Math.round(Math.random() * strength * 2 - strength);
    const y = Math.round(Math.random() * strength - strength / 2);
    canvas.dataset.shaking = 'true';
    canvas.style.transform = `${originalCanvasTransform ? `${originalCanvasTransform} ` : ''}translate(${x}px, ${y}px)`;
  }

  function clearScreenShake() {
    if (!canvas || canvas.dataset.shaking !== 'true') return;
    canvas.style.transform = originalCanvasTransform;
    delete canvas.dataset.shaking;
  }

  function updateHud(state) {
    if (scoreEl) {
      const comboText = metrics.combo > 1 ? ` | Combo x${metrics.combo}` : '';
      const highText = metrics.newHighScore ? ' | NEW HIGH!' : ` | High ${metrics.highScore}`;
      scoreEl.textContent = `Distance ${Math.floor(metrics.distance)}m | Score ${metrics.score}${comboText}${highText}`;
    }
    if (splashHighEl) splashHighEl.textContent = `High Score: ${metrics.highScore}`;

    if (state?.mode === 'tryAgain' && metrics.score >= metrics.highScore) {
      saveHighScore(metrics.highScore);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
