(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.12.4';
  const DISPLAY_BUILD = 'Build 2026-06-29.39';

  function onReady() {
    const api = window.RTA_HOCKEY_SMASH;
    const badge = document.getElementById('hockey-build-badge');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api?.getVersion) api.getVersion = () => DISPLAY_VERSION;
    document.body.dataset.hockeyGameplayStabilized = 'v0.12.4';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
