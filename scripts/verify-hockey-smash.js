const fs = require('fs');
const path = require('path');

const VERSION = 'Hockey Smash v0.14.4';
const BUILD = 'Build 2026-06-30.60';
const CACHE_KEY = '0.14.4-20260630.60';

const requiredFiles = [
  'index.html',
  'package.json',
  'script.js',
  'style.css',
  'hockey-smash.css',
  'hockey-smash-polish.css',
  'hockey-smash-touch.css',
  'hockey-smash-custom.css',
  'hockey-smash-overlays.css',
  'hockey-smash-rotate.css',
  'hockey-smash-hud.css',
  'js/games/hockey-smash.js',
  'js/games/hockey-smash-polish.js',
  'js/games/hockey-smash-backgrounds.js',
  'js/games/hockey-smash-mobile-flow.js',
  'js/games/hockey-smash-input.js',
  'js/games/hockey-smash-computer-balance.js',
  'js/games/hockey-smash-game-over.js',
  'js/games/hockey-smash-encounters.js',
  'js/games/hockey-smash-projectiles.js',
  'js/games/hockey-smash-powerups.js',
  'js/games/hockey-smash-score.js',
  'js/games/hockey-smash-characters.js',
  'js/games/hockey-smash-weather.js',
  'js/games/hockey-smash-safety.js',
  'js/games/hockey-smash-family-combat.js',
  'js/games/hockey-smash-pacing.js',
  'js/games/hockey-smash-spotlight.js',
  'js/games/hockey-smash-stage-flow.js',
  'js/games/hockey-smash-release.js',
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
const inputLayer = read('js/games/hockey-smash-input.js');
const encountersLayer = read('js/games/hockey-smash-encounters.js');
const projectilesLayer = read('js/games/hockey-smash-projectiles.js');
const powerupsLayer = read('js/games/hockey-smash-powerups.js');
const scoreLayer = read('js/games/hockey-smash-score.js');
const weather = read('js/games/hockey-smash-weather.js');
const charactersLayer = read('js/games/hockey-smash-characters.js');
const safetyLayer = read('js/games/hockey-smash-safety.js');
const familyLayer = read('js/games/hockey-smash-family-combat.js');
const pacingLayer = read('js/games/hockey-smash-pacing.js');
const spotlightLayer = read('js/games/hockey-smash-spotlight.js');
const stageFlowLayer = read('js/games/hockey-smash-stage-flow.js');
const releaseLayer = read('js/games/hockey-smash-release.js');

requireText('package.json', pkg, '"version": "0.14.4"', 'Package version is stale.');
requireText('index.html', html, `${VERSION} · ${BUILD}`, 'Build badge is stale.');
requireText('index.html', html, `hockey-smash.css?v=${CACHE_KEY}`, 'CSS manifest is not linked or cache-busted.');
requireText('index.html', html, `js/games/hockey-smash-release.js?v=${CACHE_KEY}`, 'Final release layer is not linked or cache-busted.');
requireText('index.html', html, `js/games/hockey-smash-powerups.js?v=${CACHE_KEY}`, 'Earthquake mode layer is not linked or cache-busted.');
requireText('index.html', html, `js/games/hockey-smash-weather.js?v=${CACHE_KEY}`, 'Weather layer is not linked or cache-busted.');
requireText('hockey-smash.css', cssManifest, `style.css?v=${CACHE_KEY}`, 'CSS manifest cache key is stale.');
requireText('hockey-smash.css', cssManifest, '[hidden]', 'Hidden screen hard override is missing.');
requireText('style.css', style, 'max-height: min(32vh, 285px)', 'Compact no-scroll splash sizing is missing from style.css.');
requireText('hockey-smash-custom.css', customCss, 'padding: 0.4rem 0.78rem', 'Compact customization control sizing is missing.');
requireText('js/games/hockey-smash-release.js', releaseLayer, VERSION, 'Final release layer version is stale.');
requireText('js/games/hockey-smash-release.js', releaseLayer, BUILD, 'Final release layer build is stale.');
requireText('js/games/hockey-smash-family-combat.js', familyLayer, 'doubleJump', 'Double-jump layer is missing.');
requireText('js/games/hockey-smash-pacing.js', pacingLayer, 'Progressive pacing', 'Progressive pacing layer is missing.');
requireText('js/games/hockey-smash-spotlight.js', spotlightLayer, 'slowBears', 'Bear-speed tuning layer is missing.');
requireText('js/games/hockey-smash-stage-flow.js', stageFlowLayer, 'Fish Dodge Level', 'Staged fish-dodge level is missing.');
requireText('js/games/hockey-smash-release.js', releaseLayer, 'BEAR_START_SPEED = 82', 'Final bear-speed tuning is missing.');
requireText('js/games/hockey-smash-safety.js', safetyLayer, 'START_COUNTDOWN_SECONDS = 10', 'Start-game 10-second practice countdown is missing.');
requireText('js/games/hockey-smash-safety.js', safetyLayer, 'forceSalmonFromRight', 'Right-side-only salmon guard is missing.');
requireText('js/games/hockey-smash-projectiles.js', projectilesLayer, 'PUCK_MAX_CHARGE_MS = 720', 'Stronger charge window is missing.');
requireText('js/games/hockey-smash-projectiles.js', projectilesLayer, 'PUCK_COOLDOWN_MS = 180', 'Faster charged-shot cooldown is missing.');
requireText('js/games/hockey-smash-projectiles.js', projectilesLayer, 'PUCK_ARC_GRAVITY = 680', 'Charged projectile arc physics are missing.');
requireText('js/games/hockey-smash-projectiles.js', projectilesLayer, 'const shotDirection = 1', 'Projectiles should always fire to the right.');
requireText('js/games/hockey-smash-projectiles.js', projectilesLayer, 'puckSpeedBoostUntil', 'Safe puck-speed power-up state is missing.');
requireText('js/games/hockey-smash-projectiles.js', projectilesLayer, "'earthquake'", 'Earthquake power-up drop is missing.');
requireText('js/games/hockey-smash-projectiles.js', projectilesLayer, 'earthquakeActive', 'Earthquake puck-fire-rate boost is missing.');
requireText('js/games/hockey-smash-powerups.js', powerupsLayer, 'activateEarthquake', 'Earthquake activation API is missing.');
requireText('js/games/hockey-smash-powerups.js', powerupsLayer, 'RTA_HOCKEY_SMASH_EARTHQUAKE', 'Earthquake status API is missing.');
requireText('js/games/hockey-smash-powerups.js', powerupsLayer, 'prefers-reduced-motion', 'Earthquake reduced-motion guard is missing.');
requireText('js/games/hockey-smash-projectiles.js', projectilesLayer, 'fallingFishReachedPlayer', 'Falling-fish dodge handling is missing.');
requireText('js/games/hockey-smash-encounters.js', encountersLayer, "variant: 'heavyRain'", 'Heavy falling-fish pattern is missing.');
requireText('js/games/hockey-smash-encounters.js', encountersLayer, "variant: 'schoolRain'", 'School falling-fish pattern is missing.');
requireText('js/games/hockey-smash-encounters.js', encountersLayer, 'danceInstructor', 'Dance instructor moving encounter is missing.');
requireText('js/games/hockey-smash.js', core, 'teacher.png', 'Teacher sprite is missing from core assets.');
requireText('js/games/hockey-smash.js', core, 'dance_instructor.webp', 'Dance instructor sprite is missing from core assets.');
requireText('js/games/hockey-smash-encounters.js', encountersLayer, 'maybeQueueComboSpawn', 'Combo encounter spawning is missing.');
requireText('js/games/hockey-smash-characters.js', charactersLayer, "gameTitle: 'Dance Smash'", 'Dance Smash labels are missing.');
requireText('js/games/hockey-smash-score.js', scoreLayer, 'Projectile Hits', 'Score feedback should support projectile hits.');
requireText('js/games/hockey-smash-projectiles.js', projectilesLayer, 'currentPuckType', 'Advanced puck type selection is missing.');
requireText('js/games/hockey-smash-projectiles.js', projectilesLayer, "'fire'", 'Fire puck behavior is missing.');
requireText('js/games/hockey-smash-projectiles.js', projectilesLayer, "'bounce'", 'Bounce puck behavior is missing.');
requireText('js/games/hockey-smash-encounters.js', encountersLayer, "'chargingMoose'", 'Charging moose encounter is missing.');
requireText('js/games/hockey-smash-encounters.js', encountersLayer, "'icePatch'", 'Ice patch encounter is missing.');
requireText('js/games/hockey-smash-encounters.js', encountersLayer, "'bird'", 'Bird encounter is missing.');
requireText('js/games/hockey-smash.js', core, 'drawIcePatch', 'Ice patch drawing is missing.');
requireText('js/games/hockey-smash-score.js', scoreLayer, 'hockeyHighScore', 'Requested high-score storage key is missing.');
requireText('js/games/hockey-smash-weather.js', weather, 'RTA_HOCKEY_SMASH_WEATHER', 'Weather API is missing.');
requireText('js/games/hockey-smash-weather.js', weather, 'syncParallax', 'Weather parallax layer is missing.');
requireText('js/games/hockey-smash-input.js', inputLayer, 'const activePointers = new Map()', 'Pointer tracking is missing from movement layer.');
requireText('hockey-smash-touch.css', touchCss, 'touch-action: none', 'Touch-action CSS is missing.');

const docsToCheck = { readme, changelog, workflow, checklist, qa, progress, kidGuide };
Object.entries(docsToCheck).forEach(([name, text]) => {
  if (!text.includes('v0.14.4') && !text.includes('0.14.4')) errors.push(`${name} does not mention the current version.`);
});
requireText('README.md', readme, 'charged', 'README does not document charged shots.');
requireText('README.md', readme, 'salmon', 'README does not document salmon gameplay.');
requireText('CHANGELOG.md', changelog, '0.14.4 - Cast QA And Controls', 'Changelog is missing the v0.14.4 entry.');

const textToScan = { html, cssManifest, core, encountersLayer, projectilesLayer, scoreLayer, charactersLayer, safetyLayer, familyLayer };
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
