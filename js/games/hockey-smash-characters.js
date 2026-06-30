(function () {
  const STORAGE_KEY = 'hockeySmashPlayerConfig';
  const DEFAULT_NAMES = ['Daniel', 'DANIEL', 'Sofie', 'SOFIE'];
  const PLAYER_NAME_RE = /\b(Daniel|DANIEL|Sofie|SOFIE)\b/g;

  const CHARACTERS = {
    daniel: {
      id: 'daniel',
      name: 'Daniel',
      label: 'Daniel',
      overlayLabel: 'DANIEL',
      gameTitle: 'Hockey Smash',
      splashTagline: 'Customize your runner!',
      transitionHeading: 'Entering Hockey Smash...',
      actionText: '🏒',
      actionLabel: 'Hockey stick swing',
      actionTitle: 'Hockey stick swing',
      hero: 'assets/hockey-smash/sprites/splash.webp',
      sprite: 'assets/hockey-smash/sprites/hockey-player.webp',
      slideSprite: 'assets/hockey-smash/sprites/hockey-player-sliding.webp',
      alt: 'Daniel returns for Hockey Smash',
    },
    sofie: {
      id: 'sofie',
      name: 'Sofie',
      label: 'Sofie',
      overlayLabel: 'SOFIE',
      gameTitle: 'Dance Smash',
      splashTagline: 'Sofie spins into the salmon run!',
      transitionHeading: 'Entering Dance Smash...',
      actionText: '🩰',
      actionLabel: 'Throw pointe shoe',
      actionTitle: 'Throw pointe shoe',
      hero: 'assets/hockey-smash/sprites/dancer-player.webp',
      sprite: 'assets/hockey-smash/sprites/dancer-player.webp',
      slideSprite: 'assets/hockey-smash/sprites/sister-spinning.webp',
      alt: 'Sofie joins Dance Smash',
    },
  };

  let api = window.RTA_HOCKEY_SMASH || null;
  let config = normalizeConfig(loadConfig());

  patchAssetsForSavedCharacter();
  patchApi();

  function loadConfig() {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (error) {
      return {};
    }
  }

  function saveConfig() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      // localStorage can be blocked in strict/private browsing contexts.
    }
  }

  function sanitizeName(value, fallback) {
    const cleaned = String(value || '')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 12);
    return cleaned || fallback || 'Daniel';
  }

  function normalizeConfig(next = {}) {
    const character = CHARACTERS[next.character] ? next.character : 'daniel';
    const characterDef = CHARACTERS[character];
    const name = sanitizeName(next.name, characterDef.name);
    return {
      character,
      name,
      sprite: characterDef.sprite,
      slideSprite: characterDef.slideSprite,
      hero: characterDef.hero,
      label: characterDef.label,
      overlayLabel: name.toUpperCase(),
    };
  }

  function characterDef() {
    return CHARACTERS[config.character] || CHARACTERS.daniel;
  }

  function patchAssetsForSavedCharacter() {
    api = window.RTA_HOCKEY_SMASH || api;
    if (!api?.assets) return;
    api.assets.daniel = config.sprite;
  }

  function patchApi() {
    api = window.RTA_HOCKEY_SMASH || api;
    if (!api) return;
    api.setPlayerConfig = (next) => applyConfig(next, { save: true });
    api.getPlayerConfig = () => ({ ...config });
  }

  function personalizeText(text) {
    if (typeof text !== 'string') return text;
    return text.replace(PLAYER_NAME_RE, (match) => {
      const isAllCaps = match === match.toUpperCase();
      return isAllCaps ? config.name.toUpperCase() : config.name;
    });
  }

  function onReady() {
    api = window.RTA_HOCKEY_SMASH || api;
    patchAssetsForSavedCharacter();
    patchApi();
    bindSplashControls();
    applyConfig(config, { save: false });
    window.requestAnimationFrame(syncPersonalizationLoop);
  }

  function bindSplashControls() {
    const nameInput = document.getElementById('player-name');
    const buttons = Array.from(document.querySelectorAll('[data-character]'));
    const play = document.getElementById('hockey-play');
    const splashHero = document.getElementById('splash-hero');

    if (splashHero) {
      splashHero.addEventListener('error', () => {
        splashHero.classList.add('is-loading-fallback');
        splashHero.src = CHARACTERS.daniel.sprite;
      }, { once: true });
    }

    buttons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const character = button.dataset.character;
        const currentName = nameInput?.value || config.name;
        const shouldUseCharacterDefault = DEFAULT_NAMES.includes(config.name) || !currentName.trim();
        const nextDefault = CHARACTERS[character]?.name || 'Daniel';
        applyConfig({
          character,
          name: shouldUseCharacterDefault ? nextDefault : currentName,
        }, { save: true });
      });
    });

    nameInput?.addEventListener('input', () => {
      applyConfig({ ...config, name: nameInput.value }, { save: true, preserveInput: true });
    });

    play?.addEventListener('click', () => {
      applyConfig({ ...config, name: nameInput?.value || config.name }, { save: true });
    }, { capture: true });
  }

  function applyConfig(next, options = {}) {
    config = normalizeConfig({ ...config, ...next });
    patchAssetsForSavedCharacter();
    patchApi();
    if (options.save) saveConfig();

    const nameInput = document.getElementById('player-name');
    if (nameInput && !options.preserveInput && nameInput.value !== config.name) nameInput.value = config.name;

    document.body.dataset.hockeyCharacter = config.character;
    document.body.dataset.hockeyPlayerName = config.name;

    document.querySelectorAll('[data-character]').forEach((button) => {
      const active = button.dataset.character === config.character;
      button.textContent = CHARACTERS[button.dataset.character]?.label || button.textContent;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const splashHero = document.getElementById('splash-hero') || document.querySelector('.hockey-splash__hero');
    if (splashHero && !splashHero.src.endsWith(config.hero)) {
      splashHero.classList.remove('is-loading-fallback');
      splashHero.src = config.hero;
    }
    if (splashHero) splashHero.alt = characterDef().alt || `${config.name} character preview`;

    updateModeLabels();
    updateStaticLabels();
  }

  function updateModeLabels() {
    const def = characterDef();

    const title = document.getElementById('hockey-title');
    if (title) title.textContent = def.gameTitle;

    const tagline = document.querySelector('.hockey-splash__tagline');
    if (tagline) tagline.textContent = def.splashTagline;

    const transitionHeading = document.querySelector('#hockey-transition h2');
    if (transitionHeading) transitionHeading.textContent = def.transitionHeading;

    const actionButton = document.querySelector('[data-action="stick"]');
    if (actionButton) {
      actionButton.textContent = def.actionText;
      actionButton.setAttribute('aria-label', def.actionLabel);
      actionButton.setAttribute('title', def.actionTitle);
      actionButton.dataset.actionTheme = config.character === 'sofie' ? 'pointe-shoe' : 'hockey-stick';
    }
  }

  function updateStaticLabels() {
    const healthName = document.getElementById('hockey-player-health-label') || document.querySelector('.hockey-health span');
    if (healthName) healthName.textContent = config.name;

    const overlayLabel = document.querySelector('.hockey-player-overlay__label');
    if (overlayLabel) overlayLabel.textContent = config.name.toUpperCase();

    const tryAgainEyebrow = document.querySelector('#hockey-try-again .hockey-eyebrow');
    if (tryAgainEyebrow) tryAgainEyebrow.textContent = `${config.name} got overwhelmed`;

    const tryAgainCopy = document.querySelector('#hockey-try-again p:not(.hockey-eyebrow)');
    if (tryAgainCopy) tryAgainCopy.textContent = 'The salmon run, wildlife hazards, and Dad jokes will reset.';

    const finishCopy = document.querySelector('.hockey-finish__card p:not(.hockey-eyebrow)');
    if (finishCopy) finishCopy.textContent = `${config.name} survived the salmon run, cleared the sidewalk, and finished the final challenge.`;

    const autoplayCopy = document.querySelector('.hockey-autoplay-panel span');
    if (autoplayCopy && !new URLSearchParams(window.location.search).get('debug')) autoplayCopy.textContent = `${config.name} is being controlled by the computer.`;
  }

  function updateOverlaySprite() {
    const overlay = document.getElementById('hockey-player-overlay');
    const sprite = overlay?.querySelector('.hockey-player-overlay__sprite');
    if (!sprite) return;
    const sliding = overlay.dataset.sliding === 'true' || document.body.classList.contains('hockey-slide-active');
    const nextSrc = sliding ? config.slideSprite : config.sprite;
    if (!sprite.src.endsWith(nextSrc)) sprite.src = nextSrc;
  }

  function syncStateText() {
    const state = api?.getState?.();
    if (!state) return;
    state.playerName = config.name;
    state.playerCharacter = config.character;
    state.message = personalizeText(state.message);

    if (state.player) {
      state.player.name = config.name;
      state.player.character = config.character;
    }

    (state.entities || []).forEach((entity) => {
      if (entity?.bubble) entity.bubble = personalizeText(entity.bubble);
    });

    const status = document.getElementById('hockey-status');
    if (status?.textContent) status.textContent = personalizeText(status.textContent);
  }

  function syncPersonalizationLoop() {
    updateModeLabels();
    updateStaticLabels();
    updateOverlaySprite();
    syncStateText();
    window.requestAnimationFrame(syncPersonalizationLoop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
})();
