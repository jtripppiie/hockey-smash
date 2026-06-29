const fs = require('fs');

const DISPLAY_VERSION = 'Hockey Smash v0.9.1';
const DISPLAY_BUILD = 'Build 2026-06-29.12';
const DISPLAY_BADGE = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
const CACHE_KEY = '0.9.1-20260629.12';

const requiredFiles = [
  'index.html',
  'style.css',
  'hockey-smash-polish.css',
  'hockey-smash-v09.css',
  'script.js',
  'js/games/hockey-smash.js',
  'js/games/hockey-smash-polish.js',
  'js/games/hockey-smash-v091.js',
  'package.json',
  'scripts/verify-hockey-smash-actions.js',
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
const polishJs = read('js/games/hockey-smash-polish.js');
const v091Js = read('js/games/hockey-smash-v091.js');
const packageJson = read('package.json');
requiredFiles.forEach((file) => read(file));

if (!packageJson.includes('"version": "0.9.1"')) errors.push('package.json version should be 0.9.1.');
if (!html.includes(DISPLAY_BADGE)) errors.push('Visible build overlay is missing or stale.');
if (!v091Js.includes(DISPLAY_BADGE)) errors.push('v0.9.1 script should force the latest visible badge.');
if (!html.includes(`style.css?v=${CACHE_KEY}`)) errors.push('Core CSS should be cache-busted.');
if (!html.includes(`hockey-smash-polish.css?v=${CACHE_KEY}`)) errors.push('Polish CSS should be cache-busted.');
if (!html.includes(`hockey-smash-v09.css?v=${CACHE_KEY}`)) errors.push('v0.9 stylesheet should be cache-busted.');
if (!html.includes(`js/games/hockey-smash.js?v=${CACHE_KEY}`)) errors.push('Core JS should be cache-busted.');
if (!html.includes(`js/games/hockey-smash-polish.js?v=${CACHE_KEY}`)) errors.push('Polish JS should be cache-busted.');
if (!html.includes(`js/games/hockey-smash-v091.js?v=${CACHE_KEY}`)) errors.push('v0.9.1 progression script should be linked and cache-busted.');
if (!v091Js.includes('RIGHT_EDGE')) errors.push('Continuous right-edge progression is missing.');
if (!v091Js.includes('STAGE_SECONDS')) errors.push('Road stage timing map is missing.');
if (!v091Js.includes('state.travelStage')) errors.push('Travel stage state is missing.');
if (!v091Js.includes("state.player.x = direction === 'back' ? RIGHT_EDGE - 80 : LEFT_ENTRY")) errors.push('Player wrap/reset logic is missing.');
if (!v091Js.includes('hockey-canvas-player-only')) errors.push('Computer-mode duplicate Daniel guard is missing.');
if (!polishJs.includes('syncEntityOverlays')) errors.push('v0.9 entity overlay sync is missing.');
if (!html.includes('data-fullscreen-toggle')) errors.push('Fullscreen controls are missing.');
if (!html.includes('Watch Computer Play')) errors.push('Watch Computer Play button is missing.');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`${DISPLAY_VERSION} static verification passed for continuous road progression and computer-mode duplicate-player guard.`);
