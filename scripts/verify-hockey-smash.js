const fs = require('fs');
const path = require('path');

const VERSION = 'Hockey Smash v0.12.4';
const BUILD = 'Build 2026-06-29.39';
const CACHE_KEY = '0.12.4-20260629.39';

const requiredFiles = [
  'index.html',
  'package.json',
  'script.js',
  'style.css',
  'hockey-smash-polish.css',
  'hockey-smash-touch.css',
  'hockey-smash-custom.css',
  'hockey-smash-v09.css',
  'hockey-smash-v094.css',
  'hockey-smash-v095.css',
  'hockey-smash-v0111.css',
  'js/games/hockey-smash.js',
  'js/games/hockey-smash-polish.js',
  'js/games/hockey-smash-v091.js',
  'js/games/hockey-smash-v095.js',
  'js/games/hockey-smash-v096.js',
  'js/games/hockey-smash-v099.js',
  'js/games/hockey-smash-v0100.js',
  'js/games/hockey-smash-v0102.js',
  'js/games/hockey-smash-v0103.js',
  'js/games/hockey-smash-v0104.js',
  'js/games/hockey-smash-v0105.js',
  'js/games/hockey-smash-v0106.js',
  'js/games/hockey-smash-v0107.js',
  'scripts/verify-hockey-smash-actions.js',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_01_1280x720.webp',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_02_1280x720.webp',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_03_1280x720.webp',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_04_1280x720.webp',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_05_1280x720.webp',
  'assets/hockey-smash/sprites/hockey-player.webp',
  'assets/hockey-smash/sprites/hockey-player-sliding.webp',
  'assets/hockey-smash/sprites/dancer-player.webp',
  'assets/hockey-smash/sprites/sister-spinning.webp',
  'assets/hockey-smash/sprites/splash.webp',
];

const errors = [];
function read(filePath) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing file: ${filePath}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}

requiredFiles.forEach(read);
const html = read('index.html');
const pkg = read('package.json');
const core = read('js/games/hockey-smash.js');
const polish = read('js/games/hockey-smash-polish.js');
const touchCss = read('hockey-smash-touch.css');
const customCss = read('hockey-smash-custom.css');
const v096 = read('js/games/hockey-smash-v096.js');
const v0102 = read('js/games/hockey-smash-v0102.js');
const v0103 = read('js/games/hockey-smash-v0103.js');
const v0104 = read('js/games/hockey-smash-v0104.js');
const v0105 = read('js/games/hockey-smash-v0105.js');
const v0106 = read('js/games/hockey-smash-v0106.js');
const v0107 = read('js/games/hockey-smash-v0107.js');

if (!pkg.includes('"version": "0.12.4"')) errors.push('Package version is stale.');
if (!html.includes(`${VERSION} · ${BUILD}`)) errors.push('Build badge is stale.');
if (!html.includes(`style.css?v=${CACHE_KEY}`)) errors.push('Styles are not cache-busted.');
if (!html.includes(`js/games/hockey-smash-v0107.js?v=${CACHE_KEY}`)) errors.push('Gameplay repair marker is not linked or cache-busted.');
if (!v096.includes(VERSION) || !v096.includes(BUILD)) errors.push('Movement repair layer build label is stale.');
if (!v0107.includes(VERSION) || !v0107.includes(BUILD)) errors.push('Final gameplay repair marker build label is stale.');
if (!v096.includes('const activePointers = new Map()')) errors.push('Pointer tracking is missing from movement layer.');
if (!v096.includes('button.addEventListener(\'pointerdown\'')) errors.push('Button pointerdown handler is missing.');
if (!v096.includes('button.addEventListener(\'pointerup\'')) errors.push('Button pointerup handler is missing.');
if (!v096.includes('lostpointercapture')) errors.push('Lost pointer capture release handler is missing.');
if (!v096.includes('touchcancel')) errors.push('Touch cancel reset handler is missing.');
if (!v096.includes('window.addEventListener(\'blur\', resetAllInput)')) errors.push('Blur input reset is missing.');
if (v096.includes('stopImmediatePropagation')) errors.push('Movement layer should not stopImmediatePropagation anymore.');
if (v096.includes('capture: true')) errors.push('Movement layer should not use capture-phase control listeners anymore.');
if (v096.includes('lastPointerAt')) errors.push('Old click timing guard should be removed.');
if (!v096.includes('debug.textContent = `Input L:')) errors.push('Input debug helper is missing.');
if (!touchCss.includes('touch-action: none')) errors.push('Touch-action CSS is missing.');
if (!touchCss.includes('-webkit-tap-highlight-color: transparent')) errors.push('Tap highlight suppression is missing.');
if (!customCss.includes('.hockey-character-button') || !customCss.includes('#player-name')) errors.push('Customization CSS controls are missing.');
if (!html.includes('id="player-name"')) errors.push('Player name input is missing.');
if (!html.includes('data-character="sofie"')) errors.push('Sofie character button is missing.');
if (!v0106.includes('setPlayerConfig') || !v0106.includes('getPlayerConfig')) errors.push('Player config API is missing.');
if (!v0106.includes('dancer-player.webp') || !v0106.includes('sister-spinning.webp')) errors.push('Sofie dancer sprite config is missing.');
if (!v0103.includes('puckStatsForPlayer') || !v0103.includes('puck.damage')) errors.push('Puck power variants are missing.');
if (!v0104.includes('createFloatingTextNear')) errors.push('Floating feedback text is missing.');
if (!v0102.includes('BASE_SPAWN_MS') || !v0102.includes('state.difficulty') || !v0102.includes('applyVariant')) errors.push('Difficulty ramp checks are stale.');
if (!v096.includes('RUN_ACCEL') || !v096.includes('COYOTE_MS') || !v096.includes('SLIDE_MS')) errors.push('Smooth movement checks are stale.');
if (core.includes('_1920x1080.png')) errors.push('Large background paths are still referenced.');

const textToScan = { html, core, polish, v0102, v0103, v0104, v0105, v0106, v0107 };
Object.entries(textToScan).forEach(([name, text]) => {
  const matches = text.matchAll(/assets\/hockey-smash\/sprites\/([^'"`]+)\.png/g);
  for (const match of matches) {
    const webpCounterpart = path.join('assets', 'hockey-smash', 'sprites', `${match[1]}.webp`);
    if (fs.existsSync(webpCounterpart)) {
      errors.push(`${name} still references ${match[0]} even though ${webpCounterpart} exists.`);
    }
  }
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`${VERSION} static verification passed.`);
