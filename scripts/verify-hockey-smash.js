const fs = require('fs');

const DISPLAY_VERSION = 'Hockey Smash v0.9.3';
const DISPLAY_BUILD = 'Build 2026-06-29.14';
const DISPLAY_BADGE = `${DISPLAY_VERSION} · ${DISPLAY_BUILD}`;
const CACHE_KEY = '0.9.3-20260629.14';

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
const v09Css = read('hockey-smash-v09.css');
const packageJson = read('package.json');
requiredFiles.forEach((file) => read(file));

if (!packageJson.includes('"version": "0.9.3"')) errors.push('package.json version should be 0.9.3.');
if (!html.includes(DISPLAY_BADGE)) errors.push('Visible build overlay is missing or stale.');
if (!v091Js.includes(DISPLAY_BADGE)) errors.push('v0.9.3 script should force the latest visible badge.');
if (!html.includes(`style.css?v=${CACHE_KEY}`)) errors.push('Core CSS should be cache-busted.');
if (!html.includes(`hockey-smash-polish.css?v=${CACHE_KEY}`)) errors.push('Polish CSS should be cache-busted.');
if (!html.includes(`hockey-smash-v09.css?v=${CACHE_KEY}`)) errors.push('v0.9 stylesheet should be cache-busted.');
if (!html.includes(`js/games/hockey-smash.js?v=${CACHE_KEY}`)) errors.push('Core JS should be cache-busted.');
if (!html.includes(`js/games/hockey-smash-polish.js?v=${CACHE_KEY}`)) errors.push('Polish JS should be cache-busted.');
if (!html.includes(`js/games/hockey-smash-v091.js?v=${CACHE_KEY}`)) errors.push('v0.9.3 progression script should be linked and cache-busted.');
if (!html.includes('rel="preload" as="image" href="assets/hockey-smash/backgrounds/soldotna_cityscape_background_05_1920x1080.png"')) errors.push('Road background preload links are missing.');
if (html.includes('border:3px solid rgba(255,242,122')) errors.push('Daniel debug border should be removed from inline style.');
if (!html.includes('border:0;border-radius:0;background:transparent;box-shadow:none')) errors.push('Daniel overlay should have no border/glow.');
if (html.includes('>Ready.</div>')) errors.push('Default Ready status text should be removed.');
if (!v09Css.includes('.hockey-status:empty')) errors.push('Empty status overlay should be hidden.');
if (!v09Css.includes('.hockey-stage-background')) errors.push('Stage background CSS is missing.');
if (!v09Css.includes('hockey-stage-background-active')) errors.push('Stage background active CSS is missing.');
if (!v091Js.includes('preloadedBackgrounds')) errors.push('Runtime background preloader is missing.');
if (!v091Js.includes("image.decoding = 'async'")) errors.push('Async image decoding hint is missing.');
if (!v091Js.includes('STAGE_BACKGROUNDS')) errors.push('Stage background image list is missing.');
if (!v091Js.includes('syncStageBackground')) errors.push('Stage background sync is missing.');
if (!v091Js.includes('state.travelStage')) errors.push('Travel stage state is missing.');
if (!v091Js.includes('syncStageBackground();\n      state.player.x')) errors.push('Stage background should sync before player reset.');
if (!v091Js.includes('hockey-canvas-player-only')) errors.push('Computer-mode duplicate Daniel guard is missing.');
if (!polishJs.includes('syncEntityOverlays')) errors.push('v0.9 entity overlay sync is missing.');
if (!html.includes('data-fullscreen-toggle')) errors.push('Fullscreen controls are missing.');
if (!html.includes('Watch Computer Play')) errors.push('Watch Computer Play button is missing.');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`${DISPLAY_VERSION} static verification passed for no player border and preloaded road backgrounds.`);
