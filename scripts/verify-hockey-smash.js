const fs = require('fs');
const path = require('path');

const VERSION = 'Hockey Smash v0.12.1';
const BUILD = 'Build 2026-06-29.36';
const CACHE_KEY = '0.12.1-20260629.36';

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
  'js/games/hockey-smash-v0104.js',
  'scripts/verify-hockey-smash-actions.js',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_01_1280x720.webp',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_02_1280x720.webp',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_03_1280x720.webp',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_04_1280x720.webp',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_05_1280x720.webp',
  'assets/hockey-smash/sprites/hockey-player.webp',
  'assets/hockey-smash/sprites/hockey-player-sliding.webp',
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
const v096 = read('js/games/hockey-smash-v096.js');
const v0102 = read('js/games/hockey-smash-v0102.js');
const v0103 = read('js/games/hockey-smash-v0103.js');
const v0104 = read('js/games/hockey-smash-v0104.js');

if (!pkg.includes('"version": "0.12.1"')) errors.push('Package version is stale.');
if (!html.includes(`${VERSION} · ${BUILD}`)) errors.push('Build badge is stale.');
if (!html.includes(`style.css?v=${CACHE_KEY}`)) errors.push('Styles are not cache-busted.');
if (!html.includes(`js/games/hockey-smash-v0104.js?v=${CACHE_KEY}`)) errors.push('Latest score script is not linked.');
if (!html.includes('id="hockey-score"')) errors.push('Score HUD element is missing.');
if (!v0103.includes(VERSION) || !v0103.includes(BUILD)) errors.push('Puck layer build label is stale.');
if (!v0104.includes(VERSION) || !v0104.includes(BUILD)) errors.push('Score layer build label is stale.');
if (!v0103.includes('puckStatsForPlayer') || !v0103.includes('puck.damage')) errors.push('Puck power variants are missing.');
if (!v0103.includes('puckVariant') || !v0103.includes('AIR PUCK')) errors.push('Puck variant score hooks are missing.');
if (!v0104.includes('createFloatingTextNear')) errors.push('Floating feedback text is missing.');
if (!v0104.includes('hockey-run-summary') || !v0104.includes('Puck Hits')) errors.push('Run summary is missing.');
if (!v0104.includes('peakCombo') || !v0104.includes('fishDodged')) errors.push('Run stat tracking is missing.');
if (!v0103.includes('recordPuckHit') || !v0103.includes('recordDodge')) errors.push('Puck/dodge score hooks are missing.');
if (!v0104.includes('hockeySmashHighScore')) errors.push('High score persistence is missing.');
if (!v0104.includes('state.distance') || !v0104.includes('state.score')) errors.push('Distance/score state exposure is missing.');
if (!v0102.includes('BASE_SPAWN_MS') || !v0102.includes('state.difficulty') || !v0102.includes('applyVariant')) errors.push('Difficulty ramp checks are stale.');
if (!v0103.includes('function firePuck')) errors.push('Puck action layer is missing.');
if (!v0103.includes('function playerIsDodgingSalmon')) errors.push('Salmon action layer is missing.');
if (!v096.includes('RUN_ACCEL') || !v096.includes('COYOTE_MS') || !v096.includes('SLIDE_MS')) errors.push('Smooth movement checks are stale.');
if (core.includes('_1920x1080.png')) errors.push('Large background paths are still referenced.');

const textToScan = { html, core, polish, v0102, v0103, v0104 };
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
