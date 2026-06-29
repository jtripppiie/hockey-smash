(function () {
  /*
   * Hockey Smash v0.13.7 final release marker.
   *
   * This tiny file loads after the older gameplay layers. Its job is only to make
   * the visible badge and getVersion() report the newest checkpoint after all
   * earlier patch layers have finished their own startup labels.
   */
  const DISPLAY_VERSION = 'Hockey Smash v0.13.7';
  const DISPLAY_BUILD = 'Build 2026-06-29.53';

  function onReady() {
    const api = window.RTA_HOCKEY_SMASH;
    const badge = document.getElementById('hockey-build-badge');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api?.getVersion) api.getVersion = () => DISPLAY_VERSION;
    document.body.dataset.hockeyButtonDebug = 'v0.13.7';
    window.HOCKEY_BOOT_LOG?.log?.('v0110', 'v0.13.7 charged shots, salmon variants, combo spawns, and safe powerups loaded.');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
