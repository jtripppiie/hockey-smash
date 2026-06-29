const fs = require('fs');
const path = require('path');

const VERSION = 'Hockey Smash v0.13.7';
const BUILD = 'Build 2026-06-29.53';
const CACHE_KEY = '0.13.7-20260629.53';

const requiredFiles = [
  'index.html',
  'package.json',
  'script.js',
  'style.css',
  'hockey-smash.css',
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
  'js/games/hockey-smash-v0106-earthquake.js',
  'js/games/hockey-smash-v0104.js',
  'js/games/hockey-smash-v0105.js',
  'js/games/hockey-smash-v0106.js',
  'js/games/hockey-smash-v0107.js',
  'js/games/hockey-smash-v0108.js',
  'js/games/hockey-smash-v0108-weather.js',
  'js/games/hockey-smash-v0109.js',
  'js/games/hockey-smash-v0110.js',
  'scripts/verify-hockey-smash-actions.js',
  'docs/hockey-smash-workflow.md',
  'docs/hockey-smash-dev-checklist.md',
  'docs/hockey-smash-qa.md',
  'docs/hockey-smash-progress.md',
  'docs/hockey-smash-kid-handoff.md',
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

function requireText(label, text, needle, message) {
  if (!text.includes(needle)) errors.push(message || `${label} is missing ${needle}`);
}

requiredFiles.forEach(read);
const html = read('index.html');
const pkg = read('package.json');
const cssManifest = read('hockey-smash.css');
const style = read('style.css');
const readme = read('README.md');
const changelog = read('CHANGELOG.md');
const workflow = read('docs/hockey-smash-workflow.md');
const checklist = read('docs/hockey-smash-dev-checklist.md');
const qa = read('docs/hockey-smash-qa.md');
const progress = read('docs/hockey-smash-progress.md');
const kidGuide = read('docs/hockey-smash-kid-handoff.md');
const core = read('js/games/hockey-smash.js');
const touchCss = read('hockey-smash-touch.css');
const customCss = read('hockey-smash-custom.css');
const v096 = read('js/games/hockey-smash-v096.js');
const v0102 = read('js/games/hockey-smash-v0102.js');
const v0103 = read('js/games/hockey-smash-v0103.js');
const earthquake = read('js/games/hockey-smash-v0106-earthquake.js');
const v0104 = read('js/games/hockey-smash-v0104.js');
const weather = read('js/games/hockey-smash-v0108-weather.js');
const v0106 = read('js/games/hockey-smash-v0106.js');
const v0109 = read('js/games/hockey-smash-v0109.js');
const v0110 = read('js/games/hockey-smash-v0110.js');

requireText('package.json', pkg, '"version": "0.13.7"', 'Package version is stale.');
requireText('index.html', html, `${VERSION} · ${BUILD}`, 'Build badge is stale.');
requireText('index.html', html, `hockey-smash.css?v=${CACHE_KEY}`, 'CSS manifest is not linked or cache-busted.');
requireText('index.html', html, `js/games/hockey-smash-v0110.js?v=${CACHE_KEY}`, 'Final v0110 release marker is not linked or cache-busted.');
requireText('index.html', html, `js/games/hockey-smash-v0106-earthquake.js?v=${CACHE_KEY}`, 'Earthquake mode layer is not linked or cache-busted.');
requireText('index.html', html, `js/games/hockey-smash-v0108-weather.js?v=${CACHE_KEY}`, 'Weather layer is not linked or cache-busted.');
requireText('hockey-smash.css', cssManifest, `style.css?v=${CACHE_KEY}`, 'CSS manifest cache key is stale.');
requireText('hockey-smash.css', cssManifest, '[hidden]', 'Hidden screen hard override is missing.');
requireText('style.css', style, 'max-height: min(32vh, 285px)', 'Compact no-scroll splash sizing is missing from style.css.');
requireText('hockey-smash-custom.css', customCss, 'padding: 0.4rem 0.78rem', 'Compact customization control sizing is missing.');
requireText('js/games/hockey-smash-v0110.js', v0110, VERSION, 'Final marker version is stale.');
requireText('js/games/hockey-smash-v0110.js', v0110, BUILD, 'Final marker build is stale.');
requireText('js/games/hockey-smash-v0109.js', v0109, 'START_COUNTDOWN_SECONDS = 10', 'Start-game 10-second practice countdown is missing.');
requireText('js/games/hockey-smash-v0109.js', v0109, 'forceSalmonFromRight', 'Right-side-only salmon guard is missing.');
requireText('js/games/hockey-smash-v0103.js', v0103, 'PUCK_MAX_CHARGE_MS = 720', 'Stronger charge window is missing.');
requireText('js/games/hockey-smash-v0103.js', v0103, 'PUCK_COOLDOWN_MS = 180', 'Faster charged-shot cooldown is missing.');
requireText('js/games/hockey-smash-v0103.js', v0103, 'PUCK_ARC_GRAVITY = 680', 'Charged projectile arc physics are missing.');
requireText('js/games/hockey-smash-v0103.js', v0103, 'puckSpeedBoostUntil', 'Safe puck-speed power-up state is missing.');
requireText('js/games/hockey-smash-v0103.js', v0103, "'earthquake'", 'Earthquake power-up drop is missing.');
requireText('js/games/hockey-smash-v0103.js', v0103, 'earthquakeActive', 'Earthquake puck-fire-rate boost is missing.');
requireText('js/games/hockey-smash-v0106-earthquake.js', earthquake, 'activateEarthquake', 'Earthquake activation API is missing.');
requireText('js/games/hockey-smash-v0106-earthquake.js', earthquake, 'RTA_HOCKEY_SMASH_EARTHQUAKE', 'Earthquake status API is missing.');
requireText('js/games/hockey-smash-v0106-earthquake.js', earthquake, 'prefers-reduced-motion', 'Earthquake reduced-motion guard is missing.');
requireText('js/games/hockey-smash-v0103.js', v0103, 'fallingFishReachedPlayer', 'Falling-fish dodge handling is missing.');
requireText('js/games/hockey-smash-v0102.js', v0102, "variant: 'heavyRain'", 'Heavy falling-fish pattern is missing.');
requireText('js/games/hockey-smash-v0102.js', v0102, "variant: 'schoolRain'", 'School falling-fish pattern is missing.');
requireText('js/games/hockey-smash-v0102.js', v0102, 'danceInstructor', 'Dance instructor moving encounter is missing.');
requireText('js/games/hockey-smash.js', core, 'teacher.png', 'Teacher sprite is missing from core assets.');
requireText('js/games/hockey-smash.js', core, 'dance_instructor.webp', 'Dance instructor sprite is missing from core assets.');
requireText('js/games/hockey-smash-v0102.js', v0102, 'maybeQueueComboSpawn', 'Combo encounter spawning is missing.');
requireText('js/games/hockey-smash-v0106.js', v0106, "gameTitle: 'Dance Smash'", 'Dance Smash labels are missing.');
requireText('js/games/hockey-smash-v0104.js', v0104, 'Projectile Hits', 'Score feedback should support projectile hits.');
requireText('js/games/hockey-smash-v0103.js', v0103, 'currentPuckType', 'Advanced puck type selection is missing.');
requireText('js/games/hockey-smash-v0103.js', v0103, "'fire'", 'Fire puck behavior is missing.');
requireText('js/games/hockey-smash-v0103.js', v0103, "'bounce'", 'Bounce puck behavior is missing.');
requireText('js/games/hockey-smash-v0102.js', v0102, "'chargingMoose'", 'Charging moose encounter is missing.');
requireText('js/games/hockey-smash-v0102.js', v0102, "'icePatch'", 'Ice patch encounter is missing.');
requireText('js/games/hockey-smash-v0102.js', v0102, "'bird'", 'Bird encounter is missing.');
requireText('js/games/hockey-smash.js', core, 'drawIcePatch', 'Ice patch drawing is missing.');
requireText('js/games/hockey-smash-v0104.js', v0104, 'hockeyHighScore', 'Requested high-score storage key is missing.');
requireText('js/games/hockey-smash-v0108-weather.js', weather, 'RTA_HOCKEY_SMASH_WEATHER', 'Weather API is missing.');
requireText('js/games/hockey-smash-v0108-weather.js', weather, 'syncParallax', 'Weather parallax layer is missing.');
requireText('js/games/hockey-smash-v096.js', v096, 'const activePointers = new Map()', 'Pointer tracking is missing from movement layer.');
requireText('hockey-smash-touch.css', touchCss, 'touch-action: none', 'Touch-action CSS is missing.');

const docsToCheck = { readme, changelog, workflow, checklist, qa, progress, kidGuide };
Object.entries(docsToCheck).forEach(([name, text]) => {
  if (!text.includes('v0.13.7') && !text.includes('0.13.7')) errors.push(`${name} does not mention the current version.`);
});
requireText('README.md', readme, 'charged', 'README does not document charged shots.');
requireText('README.md', readme, 'salmon', 'README does not document salmon gameplay.');
requireText('CHANGELOG.md', changelog, '0.13.7 - Falling Fish Hazards', 'Changelog is missing the v0.13.7 entry.');

const textToScan = { html, cssManifest, core, v0102, v0103, v0104, v0106, v0109, v0110 };
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
