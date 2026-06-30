(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.18 Single Background';
  const DISPLAY_BUILD = 'Build 2026-06-30.74';
  const FIRST_BACKGROUND = 'assets/hockey-smash/backgrounds/soldotna_cityscape_background_01_1280x720.webp';
  const FIRST_BACKGROUND_CACHE = `${FIRST_BACKGROUND}?v=20260630-upload-3`;
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

  function removeLegacyStageBackground() {
    document.body.classList.remove('hockey-stage-background-active');
    document.querySelectorAll('.hockey-stage-background').forEach((node) => node.remove());
  }

  function onReady() {
    const api = window.RTA_HOCKEY_SMASH;
    const badge = document.getElementById('hockey-build-badge');
    const playerOverlay = document.getElementById('hockey-player-overlay');

    lockEngineBackgroundAssets(api);
    removeLegacyStageBackground();

    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api?.getVersion) api.getVersion = () => DISPLAY_VERSION;

    if (computerMode && playerOverlay) {
      playerOverlay.hidden = true;
      playerOverlay.style.display = 'none';
      document.body.classList.add('hockey-canvas-player-only');
    }

    function keepSingleBackground() {
      // Visual/config-only lock: do not mutate gameplay state here.
      lockEngineBackgroundAssets(api);
      removeLegacyStageBackground();
      document.body.dataset.hockeySingleBackgroundReady = firstBackgroundImage.complete && firstBackgroundImage.naturalWidth ? 'true' : 'loading';
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