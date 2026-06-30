(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.5 Mom Damage Restore';

  const DEFAULT_DAMAGE = {
    bear: 12,
    moose: 16,
    chargingMoose: 18,
    bird: 6,
    teacher: 5,
    danceInstructor: 5,
    sister: 7,
    dad: 7,
  };

  function state() {
    const s = window.RTA_HOCKEY_SMASH?.getState?.();
    if (!s || !s.player || ['splash', 'transition', 'tryAgain'].includes(s.mode)) return null;
    if (!Array.isArray(s.entities)) s.entities = [];
    return s;
  }

  function momIsBlocking() {
    return Boolean(document.querySelector('.hockey-clean-room-mom'));
  }

  function restoreDamageAfterMom(s) {
    if (momIsBlocking()) return;

    s.entities.forEach((entity) => {
      if (!entity || entity.dead) return;

      if (entity.type === 'salmon' && Number(entity.dodgeDamage) === 0) {
        entity.dodgeDamage = entity.variant === 'schoolRain' || entity.variant === 'heavyRain' ? 12 : 8;
        return;
      }

      const defaultDamage = DEFAULT_DAMAGE[entity.type];
      if (defaultDamage && Number(entity.damage) === 0) {
        entity.damage = defaultDamage;
      }
    });
  }

  function loop() {
    const s = state();
    if (s) restoreDamageAfterMom(s);
    window.requestAnimationFrame(loop);
  }

  window.requestAnimationFrame(loop);
})();
