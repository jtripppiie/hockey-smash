(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.17 Single Background';
  const DISPLAY_BUILD = 'Build 2026-06-30.73';
  const FIRST_BACKGROUND = 'assets/hockey-smash/backgrounds/soldotna_cityscape_background_01_1280x720.webp';
  const FIRST_BACKGROUND_CACHE = `${FIRST_BACKGROUND}?v=20260630-upload-2`;
  const LOCKED_BACKGROUND_KEYS = ['background01', 'background02', 'background03', 'background04', 'background05'];
  const params = new URLSearchParams(window.location.search);
  const computerMode = params.get('computerMode') === '1';

  const firstBackgroundImage = new Image();
  firstBackgroundImage.decoding = 'async';
  firstBackgroundImage.src = FIRST_BACKGROUND_CACHE;

  function lockEngineBackgroundAssets(api) {
    if (!api?.assets) return;

    // Keep this visual/config-only. The main engine may still ask for later
    // background keys during salmon runs or dad moments, but every key now
    // resolves to the uploaded first arena background.
    LOCKED_BACKGROUND_KEYS.forEach((key) => {
      api.assets[key] = FIRST_BACKGROUND_CACHE;
    });
  }

  function onReady() {
    const api = window.RTA_HOCKEY_SMASH;
    const badge = document.getElementById('hockey-build-badge');
    const playerOverlay = document.getElementById('hockey-player-overlay');
    const game = document.getElementById('hockey-game');
    const canvas = document.getElementById('hockey-canvas');

    lockEngineBackgroundAssets(api);

    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api?.getVersion) api.getVersion = () => DISPLAY_VERSION;

    if (computerMode && playerOverlay) {
      playerOverlay.hidden = true;
      playerOverlay.style.display = 'none';
      document.body.classList.add('hockey-canvas-player-only');
    }

    const stageBackground = document.createElement('div');
    stageBackground.className = 'hockey-stage-background';
    stageBackground.setAttribute('aria-hidden', 'true');
    if (game && canvas && !computerMode) {
      game.insertBefore(stageBackground, canvas);
      document.body.classList.add('hockey-stage-background-active');
    }

    function syncSingleBackground() {
      if (!stageBackground || !canvas || computerMode) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // The canvas rect already includes responsive transforms. Reset transform
      // on the helper background so it cannot drift or cover the gameplay layer.
      stageBackground.style.left = `${rect.left}px`;
      stageBackground.style.top = `${rect.top}px`;
      stageBackground.style.width = `${rect.width}px`;
      stageBackground.style.height = `${rect.height}px`;
      stageBackground.style.transform = 'none';
      stageBackground.style.zIndex = '0';
      stageBackground.style.backgroundImage = `url("${FIRST_BACKGROUND_CACHE}")`;
      stageBackground.dataset.stage = '1';
      stageBackground.dataset.targetStage = '1';
      stageBackground.dataset.ready = firstBackgroundImage.complete && firstBackgroundImage.naturalWidth ? 'true' : 'loading';

      canvas.style.position = 'relative';
      canvas.style.zIndex = '2';
    }

    function keepSingleBackground() {
      // Visual-only lock: do not mutate gameplay state here.
      lockEngineBackgroundAssets(api);
      syncSingleBackground();
      window.requestAnimationFrame(keepSingleBackground);
    }

    keepSingleBackground();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();