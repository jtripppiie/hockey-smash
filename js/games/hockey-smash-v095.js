(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.9.5';
  const DISPLAY_BUILD = 'Build 2026-06-29.16';
  const params = new URLSearchParams(window.location.search);
  const computerMode = params.get('computerMode') === '1';

  function onReady() {
    const api = window.RTA_HOCKEY_SMASH;
    const badge = document.getElementById('hockey-build-badge');
    const splash = document.getElementById('hockey-splash');
    const splashContent = document.querySelector('.hockey-splash__content');
    const transition = document.getElementById('hockey-transition');
    const game = document.getElementById('hockey-game');
    const tryAgain = document.getElementById('hockey-try-again');
    const play = document.getElementById('hockey-play');

    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api?.getVersion) api.getVersion = () => DISPLAY_VERSION;

    let playerStarted = false;
    play?.addEventListener('click', () => {
      playerStarted = true;
      document.body.dataset.hockeyUserStarted = 'true';
    }, { capture: true });

    if (splashContent && !document.querySelector('.hockey-mobile-rotate-prompt')) {
      const rotatePrompt = document.createElement('p');
      rotatePrompt.className = 'hockey-mobile-rotate-prompt';
      rotatePrompt.textContent = 'Rotate your phone sideways for the best playing experience.';
      splashContent.appendChild(rotatePrompt);
    }

    if (game && !document.querySelector('.hockey-rotate-persistent')) {
      const persistentRotate = document.createElement('div');
      persistentRotate.className = 'hockey-rotate-persistent';
      persistentRotate.setAttribute('aria-hidden', 'true');
      persistentRotate.textContent = 'Rotate sideways for the best playing experience.';
      game.appendChild(persistentRotate);
    }

    function enforceSplashStart() {
      if (computerMode || playerStarted || document.body.dataset.hockeyUserStarted === 'true') return;
      document.body.classList.remove('hockey-playing');
      if (splash) splash.hidden = false;
      if (transition) transition.hidden = true;
      if (game) game.hidden = true;
      if (tryAgain) tryAgain.hidden = true;
    }

    if (!computerMode) {
      enforceSplashStart();
      window.setTimeout(enforceSplashStart, 80);
      window.setTimeout(enforceSplashStart, 260);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
