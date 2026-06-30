(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.13 Day/Night';
  const BUILD_LABEL = 'Hockey Smash v0.14.13 · Build 2026-06-30.69';
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const CYCLE_SECONDS = 72;

  const SUN_SRC = 'assets/hockey-smash/backgrounds/sun.webp';
  const MOON_SRC = 'assets/hockey-smash/backgrounds/moon.webp';

  let root = null;
  let sun = null;
  let moon = null;
  let shade = null;
  let styleNode = null;

  function api() {
    return window.RTA_HOCKEY_SMASH;
  }

  function state() {
    return api()?.getState?.() || null;
  }

  function canvasRect() {
    return document.getElementById('hockey-canvas')?.getBoundingClientRect?.() || null;
  }

  function syncBuildBadge() {
    const badge = document.getElementById('hockey-build-badge');
    if (badge && badge.textContent !== BUILD_LABEL) badge.textContent = BUILD_LABEL;
    if (api()?.getVersion) api().getVersion = () => DISPLAY_VERSION;
  }

  function ensureStyles() {
    if (styleNode?.isConnected) return;
    styleNode = document.createElement('style');
    styleNode.textContent = `
      .hockey-celestial-layer,
      .hockey-night-filter {
        position: fixed;
        left: 0;
        top: 0;
        width: 0;
        height: 0;
        z-index: 4;
        pointer-events: none !important;
        overflow: hidden;
      }
      .hockey-celestial-layer img {
        position: absolute;
        width: 128px;
        height: 128px;
        object-fit: contain;
        pointer-events: none !important;
        user-select: none;
        -webkit-user-drag: none;
        filter: drop-shadow(0 0 28px rgba(255,242,122,.45));
        transform: translate(-50%, -50%);
        transition: opacity .35s linear;
      }
      .hockey-celestial-layer img[data-body="moon"] {
        filter: drop-shadow(0 0 24px rgba(219,234,254,.55));
      }
      .hockey-night-filter {
        z-index: 5;
        background: rgba(2, 6, 23, 0);
        mix-blend-mode: multiply;
        transition: background-color .35s linear;
      }
    `;
    document.head.appendChild(styleNode);
  }

  function ensureNodes() {
    if (!root?.isConnected) {
      root = document.createElement('div');
      root.className = 'hockey-celestial-layer';
      root.dataset.hockeyVisualLayer = DISPLAY_VERSION;
      root.setAttribute('aria-hidden', 'true');

      sun = document.createElement('img');
      sun.src = SUN_SRC;
      sun.alt = '';
      sun.dataset.body = 'sun';

      moon = document.createElement('img');
      moon.src = MOON_SRC;
      moon.alt = '';
      moon.dataset.body = 'moon';

      root.appendChild(sun);
      root.appendChild(moon);
      document.body.appendChild(root);
    }

    if (!shade?.isConnected) {
      shade = document.createElement('div');
      shade.className = 'hockey-night-filter';
      shade.dataset.hockeyNightFilter = DISPLAY_VERSION;
      shade.setAttribute('aria-hidden', 'true');
      document.body.appendChild(shade);
    }
  }

  function hideNodes() {
    if (root) root.hidden = true;
    if (shade) shade.hidden = true;
  }

  function showNodes() {
    if (root) root.hidden = false;
    if (shade) shade.hidden = false;
  }

  function playableMode(current) {
    return current && !['splash', 'transition', 'tryAgain'].includes(current.mode);
  }

  function cycleProgress(seconds) {
    return ((seconds % CYCLE_SECONDS) + CYCLE_SECONDS) % CYCLE_SECONDS / CYCLE_SECONDS;
  }

  function bodyProgress(progress, offset) {
    return (progress + offset) % 1;
  }

  function riseY(rect, progress) {
    // Starts below the skyline, rises into the sky, then exits above the scene.
    const bottom = rect.top + rect.height * 0.74;
    const top = rect.top + rect.height * 0.15;
    const eased = Math.sin(progress * Math.PI);
    return bottom - (bottom - top) * eased;
  }

  function arcX(rect, progress, reverse = false) {
    const start = rect.left + rect.width * 0.18;
    const end = rect.left + rect.width * 0.82;
    const value = start + (end - start) * progress;
    return reverse ? rect.left + rect.width - (value - rect.left) : value;
  }

  function visibleOpacity(progress) {
    if (progress < 0.08 || progress > 0.92) return 0;
    if (progress < 0.18) return (progress - 0.08) / 0.1;
    if (progress > 0.82) return (0.92 - progress) / 0.1;
    return 1;
  }

  function nightAmount(progress) {
    // Night ramps in as the moon rises and fades as it leaves.
    const moonProgress = bodyProgress(progress, 0.5);
    const moonVisible = visibleOpacity(moonProgress);
    const moonHigh = Math.sin(moonProgress * Math.PI);
    return Math.max(0, Math.min(0.42, moonVisible * moonHigh * 0.42));
  }

  function positionImage(node, rect, progress, reverse) {
    const scale = rect.width / DESIGN_WIDTH;
    const size = Math.max(66, 128 * scale);
    node.style.width = `${size}px`;
    node.style.height = `${size}px`;
    node.style.left = `${arcX(rect, progress, reverse)}px`;
    node.style.top = `${riseY(rect, progress)}px`;
    node.style.opacity = String(visibleOpacity(progress));
  }

  function syncLayerBox(rect) {
    root.style.left = `${rect.left}px`;
    root.style.top = `${rect.top}px`;
    root.style.width = `${rect.width}px`;
    root.style.height = `${rect.height}px`;

    shade.style.left = `${rect.left}px`;
    shade.style.top = `${rect.top}px`;
    shade.style.width = `${rect.width}px`;
    shade.style.height = `${rect.height}px`;
  }

  function update() {
    ensureStyles();
    ensureNodes();
    syncBuildBadge();

    const current = state();
    const rect = canvasRect();
    if (!playableMode(current) || !rect?.width || !rect?.height) {
      hideNodes();
      window.requestAnimationFrame(update);
      return;
    }

    showNodes();
    syncLayerBox(rect);

    const progress = cycleProgress(Number(current.time) || 0);
    const sunProgress = bodyProgress(progress, 0);
    const moonProgress = bodyProgress(progress, 0.5);

    positionImage(sun, rect, sunProgress, false);
    positionImage(moon, rect, moonProgress, true);

    const darkness = nightAmount(progress);
    shade.style.background = `rgba(2, 6, 23, ${darkness.toFixed(3)})`;

    window.requestAnimationFrame(update);
  }

  window.requestAnimationFrame(update);
})();
