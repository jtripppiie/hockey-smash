(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.13';
  const BUILD_LABEL = 'Hockey Smash v0.14.13 · Build 2026-06-30.69';

  function api() {
    return window.RTA_HOCKEY_SMASH;
  }

  function applyVersion() {
    const badge = document.getElementById('hockey-build-badge');
    if (badge && badge.textContent !== BUILD_LABEL) badge.textContent = BUILD_LABEL;

    const gameApi = api();
    if (gameApi?.getVersion) gameApi.getVersion = () => DISPLAY_VERSION;

    window.HOCKEY_SMASH_VERSION = DISPLAY_VERSION;
    window.HOCKEY_SMASH_BUILD_LABEL = BUILD_LABEL;
  }

  function loop() {
    applyVersion();
    window.requestAnimationFrame(loop);
  }

  applyVersion();
  window.requestAnimationFrame(loop);
})();
