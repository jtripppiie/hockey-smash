const fs = require('fs');

const VERSION = 'Hockey Smash v0.11.8';
const BUILD = 'Build 2026-06-29.33';
const CACHE_KEY = '0.11.8-20260629.33';

const requiredFiles = [
  'index.html',
  'package.json',
  'script.js',
  'style.css',
  'hockey-smash-polish.css',
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
  'scripts/verify-hockey-smash-actions.js',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_01_1280x720.webp',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_02_1280x720.webp',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_03_1280x720.webp',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_04_1280x720.webp',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_05_1280x720.webp',
  'assets/hockey-smash/sprites/hockey-player-sliding.png',
  'assets/hockey-smash/sprites/sister-spinning.png',
];

const errors = [];
function read(path) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing file: ${path}`);
    return '';
  }
  return fs.readFileSync(path, 'utf8');
}

requiredFiles.forEach(read);
const html = read('index.html');
const pkg = read('package.json');
const v096 = read('js/games/hockey-smash-v096.js');
const v0103 = read('js/games/hockey-smash-v0103.js');

if (!pkg.includes('"version": "0.11.8"')) errors.push('Package version is stale.');
if (!html.includes(`${VERSION} · ${BUILD}`)) errors.push('Build badge is stale.');
if (!html.includes(`style.css?v=${CACHE_KEY}`)) errors.push('Styles are not cache-busted.');
if (!html.includes(`js/games/hockey-smash-v0103.js?v=${CACHE_KEY}`)) errors.push('Latest script is not linked.');
if (!v0103.includes(VERSION) || !v0103.includes(BUILD)) errors.push('Latest script build label is stale.');
if (!v0103.includes('function firePuck')) errors.push('Puck action layer is missing.');
if (!v0103.includes('function playerIsDodgingSalmon')) errors.push('Salmon action layer is missing.');
if (!v096.includes('RUN_ACCEL') || !v096.includes('COYOTE_MS') || !v096.includes('SLIDE_MS')) errors.push('Smooth movement checks are stale.');
if (read('js/games/hockey-smash.js').includes('_1920x1080.png')) errors.push('Large background paths are still referenced.');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`${VERSION} static verification passed.`);
