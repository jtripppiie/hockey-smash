(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.5 Earthquake Disabled';

  // Earthquake is intentionally disabled for now because the current shake / power-up
  // behavior does not feel right. Keep the old implementation in the repo, but stop
  // it from spawning or activating until we intentionally redesign it.
  const EARTHQUAKE_ROLL_MAX = 0.25;
  const POWERUP_ROLL_MAX = 0.55;

  if (!window.__HOCKEY_EARTHQUAKE_DISABLED_RANDOM_PATCH__) {
    window.__HOCKEY_EARTHQUAKE_DISABLED_RANDOM_PATCH__ = true;
    const originalRandom = Math.random.bind(Math);

    Math.random = function hockeySmashRandomWithoutEarthquake() {
      const value = originalRandom();
      if (!window.HOCKEY_DISABLE_EARTHQUAKE) return value;

      // The existing projectile layer decides the power-up type inside maybeDropPowerup:
      //   roll < 0.25 = earthquake
      //   roll < 0.55 = puck speed boost
      // Instead of rewriting that older layer here, remap only that specific roll range
      // so an earthquake drop becomes a puck-speed eligible drop.
      const stack = new Error().stack || '';
      if (stack.includes('maybeDropPowerup') && value < EARTHQUAKE_ROLL_MAX) {
        return EARTHQUAKE_ROLL_MAX + originalRandom() * (POWERUP_ROLL_MAX - EARTHQUAKE_ROLL_MAX);
      }

      return value;
    };
  }

  window.HOCKEY_DISABLE_EARTHQUAKE = true;

  function disabledEarthquakeActivate() {
    const api = window.RTA_HOCKEY_SMASH;
    const state = api?.getState?.();
    const status = document.getElementById('hockey-status');
    if (state && state.player && !['splash', 'transition', 'tryAgain'].includes(state.mode)) {
      state.message = 'Earthquake power-up is disabled for tuning.';
      if (status) status.textContent = state.message;
    }
  }

  function keepEarthquakeDisabled() {
    window.activateEarthquake = disabledEarthquakeActivate;
    window.RTA_HOCKEY_SMASH_EARTHQUAKE = {
      activate: disabledEarthquakeActivate,
      isActive: () => false,
      remainingMs: () => 0,
      disabled: true,
      version: DISPLAY_VERSION,
    };
  }

  keepEarthquakeDisabled();
  window.addEventListener('DOMContentLoaded', keepEarthquakeDisabled);
  window.setInterval(keepEarthquakeDisabled, 500);
})();
