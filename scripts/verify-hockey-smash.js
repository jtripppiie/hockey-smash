const fs = require('fs');

const DISPLAY_VERSION = 'Hockey Smash v0.9.0';
const DISPLAY_BUILD = 'Build 2026-06-29.11';
const DISPLAY_BADGE = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
const CACHE_KEY = '0.9.0-20260629.11';

const requiredFiles = [
  'index.html',
  'style.css',
  'hockey-smash-polish.css',
  'hockey-smash-v09.css',
  'script.js',
  'js/games/hockey-smash.js',
  'js/games/hockey-smash-polish.js',
  'package.json',
  'scripts/verify-hockey-smash-actions.js',
];

const requiredAssetPaths = [
  'assets/hockey-smash/sprites/hockey-player.png',
  'assets/hockey-smash/sprites/salmon.png',
  'assets/hockey-smash/sprites/bear.png',
  'assets/hockey-smash/sprites/moose.png',
  'assets/hockey-smash/sprites/dad.png',
  'assets/hockey-smash/sprites/mom.png',
  'assets/hockey-smash/sprites/sister.png',
];

const errors = [];

function read(file) {
  if (!fs.existsSync(file)) {
    errors.push(`Missing required file: ${file}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

const html = read('index.html');
const js = read('js/games/hockey-smash.js');
const polishJs = read('js/games/hockey-smash-polish.js');
const css = read('style.css');
const polishCss = read('hockey-smash-polish.css');
const v09Css = read('hockey-smash-v09.css');
const packageJson = read('package.json');
requiredFiles.forEach((file) => read(file));

if (!packageJson.includes('"version": "0.9.0"')) errors.push('package.json version should be 0.9.0.');
if (!html.includes(DISPLAY_BADGE)) errors.push('Visible build overlay is missing or stale.');
if (!polishJs.includes(DISPLAY_BADGE)) errors.push('Runtime polish script should force the latest visible badge.');
if (!html.includes(`style.css?v=${CACHE_KEY}`)) errors.push('Core CSS should be cache-busted.');
if (!html.includes(`hockey-smash-polish.css?v=${CACHE_KEY}`)) errors.push('Polish CSS should be cache-busted.');
if (!html.includes(`hockey-smash-v09.css?v=${CACHE_KEY}`)) errors.push('v0.9 stylesheet should be linked and cache-busted.');
if (!html.includes(`js/games/hockey-smash.js?v=${CACHE_KEY}`)) errors.push('Core JS should be cache-busted.');
if (!html.includes(`js/games/hockey-smash-polish.js?v=${CACHE_KEY}`)) errors.push('Polish JS should be cache-busted.');
if (!html.includes('data-fullscreen-toggle')) errors.push('Fullscreen controls are missing.');
if (!polishJs.includes('setupFullscreen')) errors.push('Fullscreen setup is missing.');
if (!html.includes('id="hockey-player-overlay"')) errors.push('Hard-coded Daniel overlay is missing.');
if (!polishJs.includes('JUMP_VISIBLE_MS')) errors.push('Visible jump impulse is missing.');
if (!polishJs.includes('manualJumpLift')) errors.push('Manual jump lift is missing.');
if (!polishJs.includes('ENTITY_ASSETS')) errors.push('v0.9 entity asset map is missing.');
if (!polishJs.includes('syncEntityOverlays')) errors.push('v0.9 entity overlay sync is missing.');
if (!polishJs.includes('hockey-entity-layer')) errors.push('Entity layer creation is missing.');
if (!polishJs.includes('dad-boss')) errors.push('Dad boss overlay key is missing.');
if (!v09Css.includes('.hockey-entity-overlay')) errors.push('Entity overlay CSS is missing.');
if (!v09Css.includes("data-type='salmon'")) errors.push('Salmon overlay CSS is missing.');
if (!v09Css.includes('@media (orientation: landscape) and (max-height: 560px)')) errors.push('Landscape phone layout CSS is missing.');
if (!v09Css.includes('.hockey-fullscreen-chip')) errors.push('Fullscreen chip CSS is missing.');
if (!polishJs.includes('window.HOCKEY_SMASH_DPAD')) errors.push('Global D-pad fallback API is missing.');
if (!polishJs.includes('jump()')) errors.push('Global D-pad jump fallback is missing.');
if (!html.includes('Watch Computer Play')) errors.push('Watch Computer Play button is missing.');
if (!html.includes('Survive the salmon run')) errors.push('HUD subtitle is missing.');
if (!html.includes('data-action="left"') || !html.includes('data-action="right"')) errors.push('D-pad left/right actions are missing.');
if (!html.includes('data-action="jump"') || !html.includes('data-action="slide"') || !html.includes('data-action="stick"')) errors.push('Action buttons are missing.');
if (!css.includes('body.hockey-playing')) errors.push('No-scroll gameplay body class is missing.');
if (!polishCss.includes('@media (orientation: portrait) and (max-width: 760px)')) errors.push('Portrait mobile gameplay layout is missing.');
if (!js.includes('groundRatio: 0.82')) errors.push('Ground ratio must be 0.82.');
if (!js.includes('spawnWildlife')) errors.push('Core wildlife spawning is missing.');
if (!js.includes('spawnSalmon')) errors.push('Core salmon spawning is missing.');
if (!js.includes('spawnFamily')) errors.push('Core family spawning is missing.');
if (!js.includes('spawnDadJoke')) errors.push('Core Dad joke spawning is missing.');

requiredAssetPaths.forEach((assetPath) => {
  if (!js.includes(assetPath) && !polishJs.includes(assetPath) && !html.includes(assetPath)) {
    errors.push(`Missing asset path: ${assetPath}`);
  }
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`${DISPLAY_VERSION} static verification passed for v0.9.0 character overlays, fullscreen, jump, and mobile scaling.`);
