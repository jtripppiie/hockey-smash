(function () {
  const SALMON_TARGET = 20;
  const FISH_TYPES = new Set(['salmon']);
  const WILDLIFE_TYPES = new Set(['bear', 'moose', 'chargingMoose', 'bird']);
  const PEOPLE_TYPES = new Set(['teacher', 'danceInstructor', 'sister', 'adultCoach', 'dad', 'mom', 'daniel']);
  const BOSS_TYPES = new Set(['dadJoke']);
  const phaseByState = new WeakMap();
  let wrappedScoreHooks = false;

  function api() { return window.RTA_HOCKEY_SMASH; }
  function getState() {
    const s = api()?.getState?.();
    if (!s || !s.player || ['splash', 'transition', 'tryAgain'].includes(s.mode)) return null;
    if (!Array.isArray(s.entities)) s.entities = [];
    if (!Array.isArray(s.effects)) s.effects = [];
    return s;
  }
  function status(text) {
    const el = document.getElementById('hockey-status');
    if (el && text) el.textContent = text;
  }
  function effect(s, x, y, text, life = 0.5) {
    s.effects?.push?.({ x, y, text, life });
  }
  function phaseInfo(s) {
    let info = phaseByState.get(s);
    if (!info) {
      const startingCollected = Number(s.salmonCollected) || 0;
      info = { phase: 'salmonRun', startedAt: performance.now(), salmonStart: startingCollected, salmonCaught: 0, announcedWildlife: false };
      phaseByState.set(s, info);
    }
    return info;
  }
  function getCollectedCount(s, info) {
    const scoreMetrics = window.RTA_HOCKEY_SMASH_SCORE?.getMetrics?.();
    const current = Number(scoreMetrics?.salmonCollected ?? s.salmonCollected ?? 0) || 0;
    info.salmonCaught = Math.max(info.salmonCaught || 0, current - (info.salmonStart || 0));
    return info.salmonCaught;
  }
  function wrapScoreHooks() {
    const score = window.RTA_HOCKEY_SMASH_SCORE;
    if (wrappedScoreHooks || !score?.recordSalmonCollect) return;
    wrappedScoreHooks = true;
    const originalCollect = score.recordSalmonCollect.bind(score);
    score.recordSalmonCollect = function wrappedRecordSalmonCollect(payload = {}) {
      const result = originalCollect(payload);
      const s = payload.state || getState();
      if (s) {
        const info = phaseInfo(s);
        if (info.phase === 'salmonRun') info.salmonCaught = getCollectedCount(s, info);
      }
      return result;
    };
  }
  function holdOldTimeline(s) {
    if (s.mode === 'bossIntro' || s.mode === 'bossFight') s.mode = 'playing';
    s.salmonRunStarted = true;
    s.salmonRunTimer = 0;
    s.bossIntroTimer = 0;
    s.dad = null;
  }
  function keepOnlySalmonRunEntities(s) {
    s.entities = s.entities.filter((entity) => entity && !entity.dead && FISH_TYPES.has(entity.type));
    if (s.spawn) {
      s.spawn.family = Math.max(s.spawn.family || 0, 12);
      s.spawn.dadJoke = Math.max(s.spawn.dadJoke || 0, 12);
      s.spawn.wildlife = Math.max(s.spawn.wildlife || 0, 12);
      s.spawn.salmon = Math.min(Math.max(s.spawn.salmon || 0.35, 0.25), 0.7);
    }
  }
  function keepAllowedEncounters(s) {
    s.entities = s.entities.filter((entity) => {
      if (!entity || entity.dead) return false;
      if (BOSS_TYPES.has(entity.type)) return false;
      return WILDLIFE_TYPES.has(entity.type) || FISH_TYPES.has(entity.type) || PEOPLE_TYPES.has(entity.type);
    });
    if (s.spawn) {
      s.spawn.family = Math.min(Math.max(s.spawn.family || 2.2, 1.6), 4.5);
      s.spawn.dadJoke = Math.max(s.spawn.dadJoke || 0, 12);
      s.spawn.wildlife = Math.min(Math.max(s.spawn.wildlife || 0.8, 0.6), 1.6);
      s.spawn.salmon = Math.min(Math.max(s.spawn.salmon || 1.0, 0.75), 1.8);
    }
  }
  function updateSalmonRunMessage(s, info) {
    const caught = Math.min(SALMON_TARGET, getCollectedCount(s, info));
    s.salmonRunTarget = SALMON_TARGET;
    s.salmonRunCaught = caught;
    const text = `Salmon Run: catch ${caught}/${SALMON_TARGET} before the road opens.`;
    s.message = text;
    status(text);
  }
  function salmonRunComplete(s, info) {
    return getCollectedCount(s, info) >= SALMON_TARGET;
  }
  function enterWildlifePhase(s, info) {
    info.phase = 'wildlife';
    info.announcedWildlife = true;
    keepAllowedEncounters(s);
    if (s.spawn) {
      s.spawn.wildlife = 0.8;
      s.spawn.salmon = 1.5;
      s.spawn.family = 2.2;
      s.spawn.dadJoke = 12;
    }
    s.message = 'Salmon run complete — moose, bears, and family are active!';
    effect(s, s.player.x + s.player.width / 2, s.player.y - 26, 'SALMON RUN COMPLETE!', 0.9);
    status(s.message);
  }
  function runStageRules() {
    wrapScoreHooks();
    const s = getState();
    if (!s) return;
    const info = phaseInfo(s);
    holdOldTimeline(s);
    document.body.dataset.hockeyStagePhase = info.phase;
    document.body.dataset.hockeySalmonTarget = String(SALMON_TARGET);
    document.body.dataset.hockeySalmonCaught = String(Math.min(SALMON_TARGET, getCollectedCount(s, info)));

    if (info.phase === 'salmonRun') {
      keepOnlySalmonRunEntities(s);
      updateSalmonRunMessage(s, info);
      if (salmonRunComplete(s, info)) enterWildlifePhase(s, info);
      return;
    }

    keepAllowedEncounters(s);
    if (!info.lastWildlifeStatusAt || performance.now() - info.lastWildlifeStatusAt > 3500) {
      info.lastWildlifeStatusAt = performance.now();
      s.message = 'Clear the moose, bears, and family challenges!';
      status(s.message);
    }
  }
  function loop() {
    runStageRules();
    window.requestAnimationFrame(loop);
  }
  function ready() {
    document.body.dataset.hockeyStageFlow = 'v0.14.46';
    window.HOCKEY_BOOT_LOG?.log?.('stage-flow', 'Opening salmon run requires 20 caught salmon before encounters unlock.');
    window.requestAnimationFrame(loop);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
