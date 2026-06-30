(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.20';
  const BUILD_LABEL = 'Hockey Smash v0.14.20 · Build 2026-06-30.76';

  let badgeObserver = null;
  let styleNode = null;

  function api() {
    return window.RTA_HOCKEY_SMASH;
  }

  function state() {
    return api()?.getState?.() || null;
  }

  function metrics() {
    return window.RTA_HOCKEY_SMASH_SCORE?.getMetrics?.() || {};
  }

  function formatTime(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return mins ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}s`;
  }

  function progressionLabel(score) {
    if (score >= 1000) return 'Rank: Trick Shot';
    if (score >= 500) return 'Rank: Fire Shot';
    return `Next Rank ${Math.max(0, 500 - score)}`;
  }

  function ensureStyles() {
    if (styleNode?.isConnected) return;
    styleNode = document.createElement('style');
    styleNode.textContent = `
      .hockey-right-arrow-cue {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(styleNode);
  }

  function writeBadge() {
    const badge = document.getElementById('hockey-build-badge');
    if (!badge) return;
    if (badge.textContent !== BUILD_LABEL) badge.textContent = BUILD_LABEL;
  }

  function watchBadge() {
    const badge = document.getElementById('hockey-build-badge');
    if (!badge || badgeObserver) return;

    badgeObserver = new MutationObserver(() => {
      if (badge.textContent !== BUILD_LABEL) badge.textContent = BUILD_LABEL;
    });

    badgeObserver.observe(badge, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  function applyVersion() {
    ensureStyles();
    writeBadge();
    watchBadge();

    const gameApi = api();
    if (gameApi?.getVersion) gameApi.getVersion = () => DISPLAY_VERSION;

    window.HOCKEY_SMASH_VERSION = DISPLAY_VERSION;
    window.HOCKEY_SMASH_BUILD_LABEL = BUILD_LABEL;
  }

  function lockArenaHud() {
    const current = state();
    const scoreEl = document.getElementById('hockey-score');
    const data = metrics();
    if (!scoreEl || !current?.player || ['splash', 'transition', 'tryAgain'].includes(current.mode)) return;

    const score = Math.floor(Number(data.score ?? current.score) || 0);
    const salmon = Math.floor(Number(data.salmonCollected ?? current.salmonCollected) || 0);
    const high = Math.floor(Number(data.highScore) || 0);
    const combo = Number(data.combo) > 1 ? ` | Combo x${Math.floor(Number(data.combo))}` : '';
    const highText = high ? ` | High ${high}` : '';
    scoreEl.textContent = `Time ${formatTime(current.time)} | Score ${score} | Salmon: ${salmon}${combo}${highText} | ${progressionLabel(high || score)}`;
  }

  function removeOldCues() {
    document.querySelectorAll('.hockey-right-arrow-cue').forEach((node) => {
      node.hidden = true;
      node.style.display = 'none';
      node.remove();
    });

    const playerOverlay = document.getElementById('hockey-player-overlay');
    if (new URLSearchParams(window.location.search).get('computerMode') === '1' && playerOverlay) {
      playerOverlay.hidden = true;
      playerOverlay.style.display = 'none';
      document.body.classList.add('hockey-canvas-player-only');
    }
  }

  function loop() {
    applyVersion();
    lockArenaHud();
    removeOldCues();
    window.requestAnimationFrame(loop);
  }

  applyVersion();
  removeOldCues();
  window.requestAnimationFrame(loop);
})();
