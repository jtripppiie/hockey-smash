/*
 * Hockey Smash Parallax Starter — DISABLED ON PURPOSE
 *
 * Current status:
 * - This file is intentionally NOT loaded by index.html yet.
 * - The implementation code below is intentionally commented out.
 * - Nothing in this file changes gameplay until you generate the assets and uncomment the hooks.
 *
 * Why this file exists:
 * - It gives us the next implementation shape for parallax backgrounds.
 * - It documents the exact asset names, sizes, and activation steps.
 * - It gives the next AI/code agent a safe, explicit starting point.
 *
 * Required assets to generate first:
 *
 * 1) Midground transparent loop
 *    Path: assets/hockey-smash/backgrounds/parallax-midground-loop.webp
 *    Size: 2048x576
 *    Format: webp
 *    Background: transparent
 *    Content: small evergreen trees, cabins, utility poles, fences, snow bushes
 *    Placement: mostly y=180..380
 *    Rule: must tile seamlessly left-to-right
 *
 * 2) Foreground transparent loop
 *    Path: assets/hockey-smash/backgrounds/parallax-foreground-loop.webp
 *    Size: 2048x576
 *    Format: webp
 *    Background: transparent
 *    Content: snowbanks, sidewalk edge details, low fence pieces, small shrubs
 *    Placement: mostly y=360..560
 *    Rule: must tile seamlessly left-to-right and should not cover the player too much
 *
 * Optional later asset:
 *
 * 3) Far background loop
 *    Path: assets/hockey-smash/backgrounds/parallax-far-loop.webp
 *    Size: 2048x576
 *    Format: webp
 *    Background: full painted scene is okay
 *    Content: snowy sky, distant mountains, faint town silhouette
 *
 * Activation steps after assets exist:
 *
 * Step 1: Add the two generated webp files to:
 *   assets/hockey-smash/backgrounds/
 *
 * Step 2: In index.html, uncomment the parallax preload lines in the <head>.
 *
 * Step 3: In index.html, uncomment the script tag near the bottom:
 *   <script src='js/games/hockey-smash-v0115-parallax-starter.js?v=0.14.4-20260629.60'></script>
 *
 * Step 4: In this file, uncomment the implementation block below.
 *
 * Step 5: Test only the fish level first. The parallax should be subtle enough that fish warning circles remain easy to read.
 *
 * Design goal:
 * - Far/current background moves slowest.
 * - Midground moves medium speed.
 * - Foreground moves fastest but stays subtle.
 * - Gameplay readability is more important than visual flash.
 */

/*
(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.4';
  const DISPLAY_BUILD = 'Build 2026-06-29.60';
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;

  const LAYERS = [
    {
      name: 'midground',
      src: 'assets/hockey-smash/backgrounds/parallax-midground-loop.webp',
      speed: 18,
      opacity: 0.82,
      zIndex: 1,
    },
    {
      name: 'foreground',
      src: 'assets/hockey-smash/backgrounds/parallax-foreground-loop.webp',
      speed: 38,
      opacity: 0.72,
      zIndex: 6,
    },
  ];

  const layerNodes = new Map();
  let startedAt = performance.now();

  function api() {
    return window.RTA_HOCKEY_SMASH;
  }

  function getState() {
    const state = api()?.getState?.();
    if (!state || !state.player || ['splash', 'transition', 'tryAgain'].includes(state.mode)) return null;
    return state;
  }

  function ensureLayerShell() {
    const game = document.getElementById('hockey-game');
    const canvas = document.getElementById('hockey-canvas');
    if (!game || !canvas) return null;

    // IMPORTANT:
    // This DOM version is a first safe implementation. If the canvas background is fully opaque,
    // these layers may not show until the canvas render is adjusted to draw parallax inside canvas.
    // If that happens, keep this file as the asset loader/reference and move draw logic into the
    // core canvas background renderer instead.
    if (getComputedStyle(game).position === 'static') game.style.position = 'relative';

    return { game, canvas };
  }

  function createLayer(layer) {
    const shell = ensureLayerShell();
    if (!shell) return null;

    const node = document.createElement('div');
    node.dataset.hockeyParallaxLayer = layer.name;
    Object.assign(node.style, {
      position: 'absolute',
      inset: '0',
      zIndex: String(layer.zIndex),
      pointerEvents: 'none',
      overflow: 'hidden',
      backgroundImage: `url("${layer.src}")`,
      backgroundRepeat: 'repeat-x',
      backgroundSize: 'auto 100%',
      backgroundPosition: '0 0',
      opacity: String(layer.opacity),
    });

    // Put parallax after the canvas for foreground, before canvas for midground.
    // If this layering is visually wrong, convert to canvas drawing instead.
    shell.game.insertBefore(node, layer.zIndex < 5 ? shell.canvas : shell.canvas.nextSibling);
    layerNodes.set(layer.name, node);
    return node;
  }

  function ensureLayers() {
    LAYERS.forEach((layer) => {
      if (!layerNodes.get(layer.name)?.isConnected) createLayer(layer);
    });
  }

  function updateParallax() {
    const state = getState();
    if (!state) {
      layerNodes.forEach((node) => { node.hidden = true; });
      return;
    }

    ensureLayers();
    const elapsed = (performance.now() - startedAt) / 1000;
    const difficultyBoost = 1 + Math.min(0.35, Number(state.difficulty || 0) * 0.35);

    LAYERS.forEach((layer) => {
      const node = layerNodes.get(layer.name);
      if (!node) return;
      node.hidden = false;
      const offset = Math.round(elapsed * layer.speed * difficultyBoost) % 2048;
      node.style.backgroundPosition = `${-offset}px 0`;
    });
  }

  function loop() {
    updateParallax();
    window.requestAnimationFrame(loop);
  }

  function ready() {
    const badge = document.getElementById('hockey-build-badge');
    if (badge) badge.textContent = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
    if (api()?.getVersion) api().getVersion = () => DISPLAY_VERSION;
    document.body.dataset.hockeyButtonDebug = 'v0.14.4-parallax';
    window.HOCKEY_BOOT_LOG?.log?.('v0115', 'v0.14.4 parallax starter active.');
    window.requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
*/
