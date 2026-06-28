const fs = require('fs');

const requiredFiles = [
  'index.html',
  'style.css',
  'script.js',
  'js/games/hockey-smash.js',
  'README.md',
  'CHANGELOG.md',
  'docs/hockey-smash-design.md',
  'docs/hockey-smash-workflow.md',
  'docs/hockey-smash-dev-checklist.md',
  'docs/roadside-realm-progress.md',
  'docs/roadside-realm-qa.md',
];

const requiredAssetPaths = [
  'assets/player_hockey_sprite_96x96.png',
  'assets/salmon_sprite_96x96.png',
  'assets/bear_sprite_96x96.png',
  'assets/moose_sprite_96x96.png',
  'assets/dad_mower_sprite_96x96.png',
  'assets/dad_sprite_96x96.png',
  'assets/mom_sprite_96x96.png',
  'assets/mom_sprite_text_96x96.png',
  'assets/sister_sprite_96x96.png',
  'assets/sister_sprite_text_96x96.png',
  'assets/soldotna_background_01.png',
  'assets/sidewalk_tile_96x32.png',
  'assets/soldotna_background_placeholder.png',
  'assets/soldotna_sidewalk_placeholder.png',
];

const errors = [];

requiredFiles.forEach((file) => {
  if (!fs.existsSync(file)) errors.push(`Missing required file: ${file}`);
});

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

const html = read('index.html');
const js = read('js/games/hockey-smash.js');
const css = read('style.css');
const readme = read('README.md');
const changelog = read('CHANGELOG.md');

[
  ['index.html', html],
  ['js/games/hockey-smash.js', js],
  ['README.md', readme],
  ['CHANGELOG.md', changelog],
].forEach(([file, content]) => {
  if (!content.includes('Hockey Smash v0.5.0')) errors.push(`${file} missing Hockey Smash v0.5.0.`);
});

if (!html.includes('Entering Hockey Smash')) errors.push('Transition text is missing.');
if (!html.includes('Rotate for the best gaming experience.')) errors.push('Rotate guidance is missing from the public UI.');
if (!html.includes('Hockey Smash v0.5.0 · Build 2026-06-28.5')) errors.push('Visible build overlay is missing or stale.');
if (!html.includes('id="hockey-canvas"')) errors.push('Hockey canvas is missing.');
if (!html.includes('data-action="left"') || !html.includes('data-action="right"')) errors.push('D-pad left/right actions are missing.');
if (!html.includes('data-action="jump"') || !html.includes('data-action="slide"') || !html.includes('data-action="stick"')) errors.push('Action buttons are missing.');
if (!css.includes('body.hockey-playing')) errors.push('No-scroll gameplay body class is missing.');
if (!css.includes('touch-action: none')) errors.push('Touch scroll prevention is missing.');
if (!js.includes('groundRatio: 0.60')) errors.push('Ground ratio must be 0.60.');
if (!js.includes('STATE')) errors.push('Game state system is missing.');
if (!js.includes('drawSpriteOrPlaceholder')) errors.push('Asset fallback placeholder system is missing.');

requiredAssetPaths.forEach((assetPath) => {
  if (!js.includes(assetPath)) errors.push(`Runtime missing asset path definition: ${assetPath}`);
  if (!readme.includes(assetPath)) errors.push(`README missing asset path: ${assetPath}`);
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Hockey Smash static verification passed for v0.5.0.');
