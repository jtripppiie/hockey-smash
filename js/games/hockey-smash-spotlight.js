(function () {
  const W = 1024;
  const BEAR_BASE = 132;
  const BEAR_LATE = 188;
  const POWERUP_MS = 6500;
  let calmBoostUntil = 0;

  function api() { return window.RTA_HOCKEY_SMASH; }
  function getState() {
    const s = api()?.getState?.();
    if (!s || !s.player || ['splash', 'transition', 'tryAgain'].includes(s.mode)) return null;
    if (!Array.isArray(s.effects)) s.effects = [];
    return s;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function difficulty(s) { return clamp(Number(s?.difficulty) || ((s?.time || 0) / 125), 0, 1); }
  function status(text) { const el = document.getElementById('hockey-status'); if (el && text) el.textContent = text; }
  function effect(s, x, y, text, life = 0.45) { s.effects?.push?.({ x, y, text, life }); }

  function activateCalmBoost(duration = POWERUP_MS) {
    const s = getState();
    if (!s) return;
    calmBoostUntil = performance.now() + Math.min(Math.max(Number(duration) || POWERUP_MS, 2500), 9000);
    resetCamera();
    s.message = 'Spotlight boost! Clear shot, no screen shake.';
    effect(s, s.player.x + s.player.width / 2, s.player.y - 20, 'SPOTLIGHT!', 0.6);
    status(s.message);
  }

  function calmBoostActive() {
    return performance.now() < calmBoostUntil;
  }

  function resetCamera() {
    const canvas = document.getElementById('hockey-canvas');
    if (canvas && canvas.style.transform) canvas.style.transform = '';
  }

  function slowBears(s) {
    const d = difficulty(s);
    const target = BEAR_BASE + (BEAR_LATE - BEAR_BASE) * d;
    (s.entities || []).forEach((e) => {
      if (!e || e.dead || e.type !== 'bear') return;
      e.vx = -target;
      e._bearTunedSlow = Number(target.toFixed(1));
    });
  }

  function removeOldCameoNodes() {
    document.querySelectorAll('[data-cute-boy-cameo], .hockey-sideline-cameo').forEach((node) => node.remove());
  }

  function loop() {
    resetCamera();
    removeOldCameoNodes();
    const s = getState();
    if (s) slowBears(s);
    window.requestAnimationFrame(loop);
  }

  function ready() {
    document.body.dataset.hockeySpotlight = 'v0.14.37';
    window.RTA_HOCKEY_SMASH_SPOTLIGHT = {
      activateCalmBoost,
      calmBoostActive,
    };
    removeOldCameoNodes();
    window.HOCKEY_BOOT_LOG?.log?.('spotlight', 'Camera/slow-bear spotlight layer loaded. Cute-boy cheer bubble removed at source.');
    window.requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
