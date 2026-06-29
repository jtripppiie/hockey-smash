(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.5.8';
  const DISPLAY_BUILD = 'Build 2026-06-29.5';
  const params = new URLSearchParams(window.location.search);
  const computerMode = params.get('computerMode') === '1';
  const debugMode = params.get('debug') === '1';
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const CORE_GROUND_RATIO = 0.82;
  const VISUAL_GROUND_RATIO = 0.80;
  const TAP_HOLD_MS = 260;

  function onReady() {
    document.body.classList.toggle('hockey-computer-mode', computerMode);
    document.body.classList.toggle('hockey-debug-enabled', debugMode);

    const api = window.RTA_HOCKEY_SMASH;
    const game = document.getElementById('hockey-game');
    const canvas = document.getElementById('hockey-canvas');
    const badge = document.getElementById('hockey-build-badge');

    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api?.getVersion) api.getVersion = () => DISPLAY_VERSION;
    if (!api || !game) return;

    let playerOverlay = document.getElementById('hockey-player-overlay');
    if (!playerOverlay) {
      playerOverlay = document.createElement('div');
      playerOverlay.id = 'hockey-player-overlay';
      playerOverlay.className = 'hockey-player-overlay';
      playerOverlay.setAttribute('aria-hidden', 'true');

      const playerSprite = document.createElement('img');
      playerSprite.className = 'hockey-player-overlay__sprite';
      playerSprite.src = 'assets/hockey-smash/sprites/hockey-player.png';
      playerSprite.alt = '';

      const playerLabel = document.createElement('span');
      playerLabel.className = 'hockey-player-overlay__label';
      playerLabel.textContent = 'DANIEL';

      playerOverlay.appendChild(playerSprite);
      playerOverlay.appendChild(playerLabel);
      game.appendChild(playerOverlay);
    }

    enhanceTapControls();

    const autoplayPanel = createAutoplayPanel();
    if (autoplayPanel) game.appendChild(autoplayPanel);

    const finish = document.createElement('section');
    finish.id = 'hockey-finish';
    finish.className = 'hockey-finish';
    finish.hidden = true;
    finish.setAttribute('aria-live', 'assertive');

    const card = document.createElement('div');
    card.className = 'hockey-finish__card';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'hockey-eyebrow';
    eyebrow.textContent = 'Victory';

    const heading = document.createElement('h2');
    heading.textContent = 'You won!';

    const copy = document.createElement('p');
    copy.textContent = 'Daniel survived the salmon run, cleared the sidewalk, and finished the final challenge.';

    const button = document.createElement('button');
    button.className = 'hockey-button hockey-button--primary';
    button.type = 'button';
    button.textContent = 'Play Again';

    card.appendChild(eyebrow);
    card.appendChild(heading);
    card.appendChild(copy);
    card.appendChild(button);
    finish.appendChild(card);
    game.appendChild(finish);

    let finishShown = false;

    button.addEventListener('click', () => {
      finishShown = false;
      finish.hidden = true;
      const retry = document.getElementById('hockey-retry');
      if (retry) retry.click();
    });

    function createAutoplayPanel() {
      if (!computerMode) return null;
      const panel = document.createElement('aside');
      panel.className = 'hockey-autoplay-panel';
      panel.setAttribute('aria-live', 'polite');

      const label = document.createElement('p');
      label.className = 'hockey-autoplay-panel__eyebrow';
      label.textContent = 'Computer Play';

      const title = document.createElement('strong');
      title.textContent = 'Watch mode is active';

      const copy = document.createElement('span');
      copy.textContent = debugMode ? 'Debug overlay is on.' : 'Daniel is being controlled by the computer.';

      panel.appendChild(label);
      panel.appendChild(title);
      panel.appendChild(copy);
      return panel;
    }

    function enhanceTapControls() {
      const keyByAction = {
        left: 'ArrowLeft',
        right: 'ArrowRight',
        jump: ' ',
        slide: 'Shift',
        stick: 'f',
      };

      document.querySelectorAll('[data-action]').forEach((button) => {
        button.addEventListener('click', () => {
          const key = keyByAction[button.dataset.action];
          if (!key) return;
          window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
          window.setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
          }, TAP_HOLD_MS);
        });
      });
    }

    function syncPlayerOverlay(state) {
      if (!canvas) return;
      if (!state?.player || state.mode === 'splash' || state.mode === 'transition' || state.mode === 'tryAgain') return;

      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const player = state.player;
      const scaleX = rect.width / DESIGN_WIDTH;
      const scaleY = rect.height / DESIGN_HEIGHT;
      const displayWidth = Math.max(86, player.width * scaleX * 0.82);
      const displayHeight = Math.max(108, player.height * scaleY * 0.82);
      const coreGroundY = DESIGN_HEIGHT * CORE_GROUND_RATIO;
      const playerFeetY = player.y + player.height;
      const jumpLift = Math.max(0, (coreGroundY - playerFeetY) * scaleY);
      const visualFeetY = rect.top + rect.height * VISUAL_GROUND_RATIO - jumpLift;
      const visualCenterX = rect.left + (player.x + player.width / 2) * scaleX;

      playerOverlay.hidden = false;
      playerOverlay.style.display = 'block';
      playerOverlay.style.left = `${visualCenterX - displayWidth / 2}px`;
      playerOverlay.style.top = `${visualFeetY - displayHeight}px`;
      playerOverlay.style.width = `${displayWidth}px`;
      playerOverlay.style.height = `${displayHeight}px`;
      playerOverlay.style.zIndex = '9';
      playerOverlay.dataset.facing = player.facing < 0 ? 'left' : 'right';
      playerOverlay.dataset.x = String(Math.round(player.x));
    }

    function watchNormalMode() {
      const state = api.getState?.();
      syncPlayerOverlay(state);

      if (!computerMode && !finishShown && state?.dad && state.dad.hp <= 0) {
        finishShown = true;
        finish.hidden = false;
        const status = document.getElementById('hockey-status');
        if (status) status.textContent = 'Victory! Final challenge cleared.';
      }
      window.requestAnimationFrame(watchNormalMode);
    }

    watchNormalMode();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
