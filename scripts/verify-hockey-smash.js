const fs = require('fs');
const vm = require('vm');

const requiredFiles = [
  'index.html',
  'dev/hockey-smash-v2.html',
  'js/games/hockey-smash-world-v2.js',
  'js/games/hockey-smash-renderer-v2.js',
  'js/games/hockey-smash-systems-v2.js',
  'docs/hockey-smash-v2-architecture.md',
  'docs/LEARNING_GUIDE.md',
  'docs/README.md',
  'docs/GAMEPLAY_POLISH.md',
  'docs/hockey-smash-sprite-sheet-port.md',
  'assets/hockey-smash/backgrounds/soldotna_cityscape_background_01_1280x720.webp',
  'assets/hockey-smash/backgrounds/sun.webp',
  'assets/hockey-smash/backgrounds/moon.webp',
  'assets/hockey-smash/backgrounds/parallax/PLACEHOLDER_ASSETS.md',
  'assets/hockey-smash/backgrounds/parallax/hockey-smash-parallax-kenai-mountains-bg-1536x576.svg',
  'assets/hockey-smash/backgrounds/parallax/hockey-smash-parallax-nelson-engineering-sign-1536x320.svg',
  'assets/hockey-smash/backgrounds/parallax/hockey-smash-parallax-soldotna-city-nelson-engineering-mid-1536x320.svg',
  'assets/hockey-smash/backgrounds/parallax/hockey-smash-parallax-soldotna-city-nelson-engineering-mid-1536x320.webp',
  'assets/hockey-smash/backgrounds/parallax/hockey-smash-parallax-sidewalk-soldotna-front-1536x170.svg',
  'assets/hockey-smash/backgrounds/parallax/hockey-smash-parallax-skyline-far-1536x576.svg',
  'assets/hockey-smash/sprites/daniel-hockey-idle.webp',
  'assets/hockey-smash/sprites/daniel-hockey-slide.webp',
  'assets/hockey-smash/sprites/daniel-hockey-duck.webp',
  'assets/hockey-smash/sprites/sofie-dancer-idle.webp',
  'assets/hockey-smash/sprites/sofie-dance-spin.webp',
  'assets/hockey-smash/sprites/bear-walk-sheet.webp',
  'assets/hockey-smash/sprites/moose-walk-sheet.webp',
  'assets/hockey-smash/sprites/eagle-fly-sheet.webp',
  'assets/hockey-smash/sprites/salmon-swim-sheet.webp',
  'assets/hockey-smash/sprites/salmon-falling.webp',
  'assets/hockey-smash/sprites/bear-walk-01.webp',
  'assets/hockey-smash/sprites/bear-walk-06.webp',
  'assets/hockey-smash/sprites/moose-walk-01.webp',
  'assets/hockey-smash/sprites/moose-walk-03.webp',
  'assets/hockey-smash/sprites/eagle-flap-mid.webp',
  'assets/hockey-smash/sprites/mom-cameo.webp',
  'assets/hockey-smash/sprites/dad-cameo.webp',
  'assets/hockey-smash/sprites/sofie-dance-instructor.webp',
  'assets/hockey-smash/sprites/alaska-boy-cameo.webp',
  'assets/hockey-smash/sprites/alaska-girl-cameo.webp',
  'assets/hockey-smash/sprites/projectile-hockey-puck.webp',
  'assets/hockey-smash/sprites/projectile-dancer-shoe.webp',
  'assets/hockey-smash/sprites/daniel-splash.webp',
];

const removedFiles = [
  'hockey-smash.css',
  'hockey-smash-touch.css',
  'style.css',
  'script.js',
  'js/games/hockey-smash.js',
  'js/games/hockey-smash-input.js',
  'js/games/hockey-smash-release.js',
  'scripts/verify-hockey-smash-actions.js',
  'js/games/hockey-smash-legacy-dungeon-data.js',
  'scripts/verify-hockey-smash-legacy-data.js',
  'scripts/verify-hockey-smash-legacy-vm.js',
  'docs/hockey-smash-game-plan.md',
  'docs/hockey-smash-summary.md',
  'docs/game-design.md',
  'docs/technical-plan.md',
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

function forbidText(label, text, needle, message) {
  if (text.includes(needle)) errors.push(message || `${label} should not include ${needle}`);
}

requiredFiles.forEach(read);
removedFiles.forEach((filePath) => {
  if (fs.existsSync(filePath)) errors.push(`Old v1/legacy file still exists: ${filePath}`);
});

const html = read('index.html');
const devRedirect = read('dev/hockey-smash-v2.html');
const packageJson = JSON.parse(read('package.json'));
const packageLock = JSON.parse(read('package-lock.json'));
const harness = html;
const worldSource = read('js/games/hockey-smash-world-v2.js');
const rendererSource = read('js/games/hockey-smash-renderer-v2.js');
const systemsSource = read('js/games/hockey-smash-systems-v2.js');
const architecture = read('docs/hockey-smash-v2-architecture.md');
const spriteSheetPort = read('docs/hockey-smash-sprite-sheet-port.md');
const parallaxPlaceholders = read('assets/hockey-smash/backgrounds/parallax/PLACEHOLDER_ASSETS.md');

requireText('index.html', html, 'id="v2-canvas"', 'Root page should serve the Hockey Smash game.');
requireText('dev redirect', devRedirect, 'window.location.replace(\'../\')', 'Old v2 dev URL should redirect to the root game.');
requireText('v2 game', harness, 'id="v2-canvas"', 'V2 game canvas is missing.');
requireText('v2 harness', harness, 'width="1024" height="576"', 'V2 canvas should keep the intended game coordinate size.');
requireText('v2 harness', harness, 'id="v2-player-name"', 'V2 name input is missing.');
requireText('v2 harness', harness, 'data-character="daniel"', 'Daniel selection is missing.');
requireText('v2 harness', harness, 'data-character="sofie"', 'Sofie selection is missing.');
requireText('v2 harness', harness, 'data-action="stick"', 'Stick action control is missing.');
requireText('v2 harness', harness, 'id="v2-fullscreen"', 'V2 fullscreen toggle is missing.');
requireText('v2 harness', harness, 'id="v2-version-badge"', 'V2 version overlay badge is missing.');
if (packageJson.version !== '1.6.0') errors.push('package.json version should be 1.6.0.');
if (packageLock.version !== packageJson.version) errors.push('package-lock.json root version should match package.json.');
if (packageLock.packages?.['']?.version !== packageJson.version) errors.push('package-lock package version should match package.json.');
requireText('v2 harness', harness, "const VERSION_FALLBACK = '1.6.0'", 'V2 version fallback should match package.json.');
requireText('v2 harness', harness, 'loadVersionBadge', 'V2 version badge loader is missing.');
requireText('v2 harness', harness, 'fetch(\'package.json\'', 'V2 version badge should read package.json when available.');
requireText('v2 harness', harness, 'id="v2-hud-score"', 'V2 mobile scoring HUD is missing.');
requireText('v2 harness', harness, 'id="v2-health-fill"', 'V2 player health bar is missing.');
requireText('v2 harness', harness, 'id="v2-retry"', 'V2 retry button is missing.');
requireText('v2 harness', harness, 'updateHud', 'V2 HUD update loop is missing.');
requireText('v2 harness', harness, 'Salmon ${world.salmonCaught', 'V2 HUD should show salmon score.');
requireText('v2 systems', systemsSource, 'PERFECT +${points}', 'V2 perfect catch feedback is missing.');
requireText('v2 systems', systemsSource, "text: 'MISSED'", 'V2 missed-salmon feedback is missing.');
requireText('v2 systems', systemsSource, "kind: 'burst'", 'V2 gameplay particle bursts are missing.');
requireText('v2 renderer', rendererSource, 'function renderBurst', 'V2 particle burst renderer is missing.');
requireText('v2 systems', systemsSource, 'COMBO x', 'V2 salmon combo feedback is missing.');
requireText('v2 systems', systemsSource, 'addWarning', 'V2 encounter warning effect helper is missing.');
requireText('v2 harness', harness, 'maybeApplyCameoBoost', 'V2 cameo boost proximity handler is missing.');
requireText('v2 harness', harness, 'updateEncounterBehavior', 'V2 encounter behavior updater is missing.');
requireText('v2 harness', harness, 'DAD_JOKES', 'V2 Dad joke pool is missing.');
requireText('v2 harness', harness, 'REPEATABLE_ENCOUNTERS', 'V2 repeatable encounter pool is missing.');
requireText('v2 harness', harness, 'ONESHOT_ENCOUNTERS', 'V2 one-shot encounter pool is missing.');
requireText('v2 harness', harness, 'world.timers.encounter = 0.25', 'V2 encounter loop should retry quickly when nothing spawns.');
requireText('v2 systems', systemsSource, 'REPEATABLE_ENCOUNTERS', 'V2 encounter fallback should use the repeatable pool.');
requireText('v2 harness', harness, 'normalizeSpritePaths(World.SPRITES)', 'V2 root game should load sprite paths without dev-page prefixes.');
forbidText('v2 harness', harness, '`../${src}`', 'V2 root game should not prefix sprite paths with ../.');
forbidText('v2 harness', harness, 'entity.state = \'charging\'', 'V2 bear charge should stay out until future development.');
forbidText('v2 harness', harness, 'CHARGE!', 'V2 bear charge callout should stay out until future development.');
requireText('v2 harness', harness, 'entity.state = \'grazing\'', 'V2 moose graze state is missing.');
requireText('v2 harness', harness, 'HP ${Math.round(health)}', 'V2 HUD should show player health.');
requireText('v2 harness', harness, 'height: 100vh', 'V2 fullscreen landscape should fill the viewport.');
requireText('v2 harness', harness, 'gameStarted', 'V2 harness should gate updates behind Start.');
requireText('v2 systems', systemsSource, 'bubble: \'\'', 'Bear/moose speech bubbles should remain disabled.');
requireText('v2 systems', systemsSource, 'spawnSalmonLandingMarker', 'V2 salmon landing marker spawn is missing.');
requireText('v2 systems', systemsSource, 'predictSalmonLandingX', 'V2 salmon landing prediction is missing.');
requireText('v2 systems', systemsSource, 'approach(player.vx', 'V2 player movement should ease toward target velocity.');
requireText('v2 systems', systemsSource, 'jumpBufferTimer', 'V2 player jump buffer is missing.');
requireText('v2 systems', systemsSource, 'airJumpsRemaining', 'V2 player double jump state is missing.');
requireText('v2 harness', harness, 'PARALLAX_LAYERS', 'V2 parallax layer config is missing.');
requireText('v2 harness', harness, 'hockey-smash-parallax-kenai-mountains-bg-1536x576.svg', 'Editable mountain parallax layer is not wired.');
requireText('v2 harness', harness, 'hockey-smash-parallax-soldotna-city-nelson-engineering-mid-1536x320.webp', 'Runtime Soldotna city parallax layer is not wired.');
requireText('v2 harness', harness, 'hockey-smash-parallax-sidewalk-soldotna-front-1536x170.svg', 'Editable sidewalk parallax layer is not wired.');
requireText('v2 harness', harness, 'mapParallaxLayers', 'V2 parallax preloading should be key-based.');
requireText('v2 harness', harness, 'updateEnvironment', 'V2 environment update loop is missing.');
requireText('v2 systems', systemsSource, 'const direction = 1', 'V2 projectiles should fire right only (deliberate rule: threats come from the right).');
requireText('v2 renderer', rendererSource, 'renderAimIndicator', 'V2 should show a right-side aim indicator so the always-right throw reads as a rule.');
requireText('v2 systems', systemsSource, 'projectilePuck', 'V2 Daniel projectile puck sprite is missing.');
requireText('v2 systems', systemsSource, 'projectileShoe', 'V2 Sofie projectile shoe sprite is missing.');
requireText('v2 systems', systemsSource, 'spawnEagle', 'V2 eagle encounter spawn is missing.');
requireText('v2 harness', harness, 'player.duckActive', 'V2 Daniel duck state is missing.');
requireText('v2 harness', harness, 'world.environment.scrollX += (world.player.vx || 0)', 'V2 background scroll should follow player movement.');
requireText('v2 harness', harness, 'HOCKEY_SMASH_V2_DEV', 'V2 dev test hook is missing.');
requireText('v2 harness', harness, 'fireProjectile', 'V2 projectile dev test hook is missing.');
requireText('v2 harness', harness, 'new URLSearchParams(window.location.search).has(\'debug\')', 'V2 debug mode should be gated by ?debug=1.');
requireText('v2 harness', harness, 'handleDebugKey', 'V2 debug keyboard toggles are missing.');
requireText('v2 harness', harness, 'showHitboxes', 'V2 debug hitbox toggle is missing.');
requireText('v2 harness', harness, 'godMode', 'V2 debug god mode toggle is missing.');
requireText('v2 harness', harness, 'World.updateDifficulty(world, dt)', 'V2 harness should use centralized difficulty updates.');
requireText('v2 harness', harness, 'damagePlayer', 'V2 player damage handler is missing.');
requireText('v2 systems', systemsSource, 'spawnCastSupport', 'V2 cast support spawn helper is missing.');
requireText('v2 systems', systemsSource, 'Go Daniel!', 'V2 Daniel sister support cameo is missing.');
requireText('v2 systems', systemsSource, 'Point those toes!', 'V2 Sofie dance teacher encounter is missing.');
requireText('v2 systems', systemsSource, 'dismissOnProjectile', 'V2 dismissible non-contact entities are missing.');
requireText('v2 systems', systemsSource, 'canSpawnEncounter', 'V2 encounter pacing should consult spawn caps.');
requireText('v2 systems', systemsSource, 'countActiveWildlife', 'V2 wildlife cap helper is missing.');
requireText('v2 systems', systemsSource, 'countActiveThreats', 'V2 active threat cap helper is missing.');
requireText('v2 harness', harness, 'HOCKEY_SMASH_WORLD_V2', 'V2 world script usage is missing.');
requireText('v2 harness', harness, 'HOCKEY_SMASH_RENDERER_V2', 'V2 renderer script usage is missing.');
requireText('v2 harness', harness, 'HOCKEY_SMASH_SYSTEMS_V2', 'V2 gameplay systems script usage is missing.');
requireText('v2 harness', harness, 'hockey-smash-world-v2.js?v=1.6.0', 'V2 world script include should be cache-busted.');
requireText('v2 harness', harness, 'hockey-smash-renderer-v2.js?v=1.6.0', 'V2 renderer script include should be cache-busted.');
requireText('v2 harness', harness, 'hockey-smash-systems-v2.js?v=1.6.0', 'V2 gameplay systems script include should be cache-busted.');
requireText('v2 harness', harness, 'BEST_SCORE_KEY', 'V2 personal-best storage is missing.');
requireText('v2 harness', harness, 'bindPauseControls', 'V2 pause controls are missing.');
requireText('v2 harness', harness, 'visibilitychange', 'V2 should pause when the tab is hidden.');
requireText('v2 harness', harness, 'Systems.updatePlayer(game', 'V2 harness should call the extracted player system.');
requireText('v2 harness', harness, 'Systems.spawnNextEncounter(game', 'V2 harness should call the extracted encounter spawner.');
requireText('v2 world', worldSource, 'salmonSpawnSeconds: 1.12', 'V2 salmon spawn tuning is missing.');
requireText('v2 world', worldSource, 'walkSpeed: 360', 'V2 player walk tuning is missing.');
requireText('v2 world', worldSource, 'slideSpeed: 575', 'V2 player slide tuning is missing.');
requireText('v2 world', worldSource, 'playerBoostMultiplier: 1.18', 'V2 player speed boost tuning is missing.');
requireText('v2 world', worldSource, 'perfectCatchWindowSeconds: 0.34', 'V2 perfect catch tuning is missing.');
requireText('v2 world', worldSource, 'salmonFallVelocity: 235', 'V2 salmon fall velocity tuning is missing.');
requireText('v2 world', worldSource, 'salmonFallVelocityRange: 45', 'V2 salmon fall range tuning is missing.');
requireText('v2 world', worldSource, 'salmonFallGravity: 275', 'V2 salmon fall tuning is missing.');
requireText('v2 world', worldSource, 'createEnvironment', 'V2 environment state is missing.');
requireText('v2 world', worldSource, 'createCastState', 'V2 cast appearance state is missing.');
requireText('v2 world', worldSource, 'momSpawned: false', 'V2 Mom appearance state is missing.');
requireText('v2 world', worldSource, 'maxHealth: 100', 'V2 player max health is missing.');
requireText('v2 world', worldSource, 'health: 100', 'V2 player starting health is missing.');
requireText('v2 world', worldSource, 'createDebugState', 'V2 world debug state factory is missing.');
requireText('v2 world', worldSource, 'lastCollision', 'V2 debug collision readout is missing.');
requireText('v2 world', worldSource, 'createDifficulty', 'V2 world difficulty state factory is missing.');
requireText('v2 world', worldSource, 'updateDifficulty', 'V2 world centralized difficulty updater is missing.');
requireText('v2 world', worldSource, 'maxActiveWildlife: 1', 'V2 difficulty should cap active wildlife at 1.');
requireText('v2 world', worldSource, 'maxActiveThreats: 1', 'V2 difficulty should start with 1 active threat.');
requireText('v2 world', worldSource, 'salmonPostGateSpawnMin: 1.3', 'V2 post-gate salmon difficulty tuning is missing.');
requireText('v2 world', worldSource, 'groundAcceleration: 4200', 'V2 player movement acceleration tuning is missing.');
requireText('v2 world', worldSource, 'jumpBufferSeconds: 0.11', 'V2 jump buffer tuning is missing.');
requireText('v2 world', worldSource, 'coyoteTimeSeconds: 0.09', 'V2 coyote-time tuning is missing.');
requireText('v2 world', worldSource, 'airJumps: 1', 'V2 double-jump tuning is missing.');
requireText('v2 world', worldSource, 'const height = 132', 'Proportional Mom height is missing.');
requireText('v2 world', worldSource, 'const width = 49', 'Proportional Mom width is missing.');
requireText('v2 world', worldSource, 'daniel-hockey-idle.webp', 'V2 Daniel sprite name is not descriptive.');
forbidText('v2 world', worldSource, 'player-run-headless-sheet.webp', 'Hockey Smash player should stay a hockey/dance sprite.');
forbidText('v2 world', worldSource, 'dad-run-sheet.webp', 'Hockey Smash Dad should keep the Hockey Smash cameo art.');
forbidText('v2 world', worldSource, 'mom-run-sheet.webp', 'Hockey Smash Mom should keep the Hockey Smash cameo art.');
requireText('v2 world', worldSource, 'bear-walk-sheet.webp', 'V2 bear walk sheet asset is missing.');
requireText('v2 world', worldSource, 'moose-walk-sheet.webp', 'V2 moose walk sheet asset is missing.');
requireText('v2 world', worldSource, 'eagle-fly-sheet.webp', 'V2 eagle fly sheet asset is missing.');
requireText('v2 world', worldSource, 'salmon-swim-sheet.webp', 'V2 salmon swim sheet asset is missing.');
requireText('v2 world', worldSource, 'projectile-hockey-puck.webp', 'V2 hockey puck projectile asset is missing.');
requireText('v2 world', worldSource, 'projectile-dancer-shoe.webp', 'V2 dancer shoe projectile asset is missing.');
requireText('v2 world', worldSource, 'bear-walk-01.webp', 'V2 bear sprite should use descriptive walk-frame art.');
requireText('v2 world', worldSource, 'bear-walk-06.webp', 'V2 bear animation frames are missing.');
requireText('v2 world', worldSource, 'moose-walk-01.webp', 'V2 moose sprite should use descriptive walk-frame art.');
requireText('v2 world', worldSource, 'moose-walk-03.webp', 'V2 moose animation frames are missing.');
requireText('v2 world', worldSource, 'Hi, you\\\'re cute', 'V2 Alaska kid cameo line is stale.');
requireText('v2 world', worldSource, 'boostGiven: false', 'V2 Alaska kid boost state is missing.');
requireText('v2 world', worldSource, 'ttl: 5', 'V2 Alaska kid cameos should be five-second pop-in moments.');
requireText('v2 harness', harness, 'This mower is cutting edge.', 'V2 Dad jokes should be complete jokes.');
requireText('v2 systems', systemsSource, "spawnPerson(game, 'dad', DAD_JOKES[Math.floor(Math.random() * DAD_JOKES.length)], 2, 10, false)", 'V2 Dad mower should have contact damage.');
requireText('v2 systems', systemsSource, "countActiveType(game, 'mom')", 'V2 Mom spawns should be capped to one active Mom.');
requireText('v2 systems', systemsSource, 'world.cast?.momSpawned', 'V2 paced Mom cameo should not repeat in a run.');
requireText('v2 systems', systemsSource, "countActiveType(game, 'dad')", 'V2 Dad spawns should be capped to one active Dad.');
requireText('v2 harness', harness, 'spawnPacedEncounter', 'V2 paced encounter test hook is missing.');
requireText('v2 renderer', rendererSource, 'renderWorld', 'V2 renderer API is missing.');
requireText('v2 renderer', rendererSource, 'renderParallaxBackground', 'V2 parallax renderer is missing.');
requireText('v2 renderer', rendererSource, 'renderNightFilter', 'V2 night sky filter is missing.');
requireText('v2 renderer', rendererSource, 'renderSunMoon', 'V2 sun/moon renderer is missing.');
requireText('v2 renderer', rendererSource, 'drawOrb(ctx, sun, sunX, sunY, 96', 'V2 midnight sun should be visible during early gameplay.');
requireText('v2 renderer', rendererSource, 'environment.midnightSun', 'V2 renderer should support midnight sun mode.');
requireText('v2 renderer', rendererSource, 'getEntitySpriteKey', 'V2 animated entity sprite selector is missing.');
forbidText('v2 renderer', rendererSource, 'eagleTop', 'V2 should not reintroduce the old eagle top overlay path.');
forbidText('v2 renderer', rendererSource, 'playerRunSheet', 'Hockey Smash player should not render from the imported body sheet.');
forbidText('v2 renderer', rendererSource, 'dadRunSheet', 'Hockey Smash Dad should keep the Hockey Smash cameo art.');
forbidText('v2 renderer', rendererSource, 'momRunSheet', 'Hockey Smash Mom should keep the Hockey Smash cameo art.');
requireText('v2 renderer', rendererSource, 'SPRITE_SHEETS', 'V2 sprite sheet metadata is missing.');
requireText('v2 renderer', rendererSource, 'drawAnimatedSheetSprite', 'V2 sprite sheet renderer is missing.');
forbidText('v2 renderer', rendererSource, 'renderPlayerHead', 'Hockey Smash should not compose an imported body with a Hockey Smash head.');
requireText('v2 renderer', rendererSource, 'getEntitySheetOptions', 'V2 entity sprite sheet motion options are missing.');
requireText('v2 renderer', rendererSource, 'eagleFlySheet', 'V2 eagle flight sheet renderer is missing.');
requireText('v2 renderer', rendererSource, 'salmonSwimSheet', 'V2 salmon swim sheet renderer is missing.');
requireText('v2 renderer', rendererSource, 'bear6', 'V2 bear walk-frame renderer is missing.');
requireText('v2 renderer', rendererSource, 'moose3', 'V2 moose walk-frame renderer is missing.');
requireText('v2 renderer', rendererSource, 'renderSalmonMarker', 'V2 salmon landing marker renderer is missing.');
requireText('v2 renderer', rendererSource, 'ripple', 'V2 animated salmon marker ripple is missing.');
requireText('v2 renderer', rendererSource, 'renderHitboxes', 'V2 debug hitbox renderer is missing.');
requireText('v2 renderer', rendererSource, 'renderShadow', 'V2 readable entity shadow renderer is missing.');
requireText('v2 renderer', rendererSource, 'renderEntityHealth', 'V2 target health pip renderer is missing.');
requireText('v2 architecture docs', architecture, 'width: 49', 'V2 architecture Mom dimensions are stale.');
requireText('v2 architecture docs', architecture, 'player.health', 'V2 architecture docs are missing player health ownership.');
requireText('v2 architecture docs', architecture, 'V2 is now the active Hockey Smash path', 'V2 architecture docs still describe the old isolated-only plan.');
requireText('sprite sheet port docs', spriteSheetPort, 'dual matte expression', 'Sprite sheet port docs should document matte cleanup.');
requireText('sprite sheet port docs', spriteSheetPort, 'SPRITE_SHEETS', 'Sprite sheet port docs should document renderer metadata.');
requireText('parallax placeholders', parallaxPlaceholders, 'hockey-smash-parallax-skyline-far-1536x576.svg', 'Far parallax placeholder spec is missing.');
requireText('parallax placeholders', parallaxPlaceholders, 'hockey-smash-parallax-kenai-mountains-bg-1536x576.svg', 'Editable mountain parallax spec is missing.');
requireText('parallax placeholders', parallaxPlaceholders, 'hockey-smash-parallax-soldotna-city-nelson-engineering-mid-1536x320.svg', 'Editable Soldotna city parallax spec is missing.');
requireText('parallax placeholders', parallaxPlaceholders, 'hockey-smash-parallax-soldotna-city-nelson-engineering-mid-1536x320.webp', 'Runtime Soldotna city parallax spec is missing.');
requireText('parallax placeholders', parallaxPlaceholders, 'hockey-smash-parallax-sidewalk-soldotna-front-1536x170.svg', 'Editable sidewalk parallax spec is missing.');
requireText('parallax placeholders', parallaxPlaceholders, 'asphalt edge detail', 'Editable sidewalk parallax spec should mention the street edge detail.');
requireText('parallax placeholders', parallaxPlaceholders, 'hockey-smash-parallax-nelson-engineering-sign-1536x320.svg', 'Nelson Engineering parallax sign spec is missing.');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(worldSource, context);
const World = context.window.HOCKEY_SMASH_WORLD_V2;
if (!World) {
  errors.push('World v2 global was not created.');
} else {
  const world = World.createWorld({ character: 'sofie', name: 'Jamie' });
  const mom = World.createMom(world);
  const salmon = World.createSalmon(world);
  const cameo = World.createCameo(world, 'alaskanBoy');
  if (world.phase !== World.PHASES.COUNTDOWN) errors.push('V2 world should start in countdown.');
  if (world.player.name !== 'Jamie') errors.push('V2 world should preserve player name.');
  if (world.player.character !== 'sofie') errors.push('V2 world should preserve selected character.');
  if (world.player.health !== 100 || world.player.maxHealth !== 100) errors.push('V2 player health should start at 100/100.');
  if (!world.cast || world.cast.cameoSpawned !== false) errors.push('V2 cast appearance state should start clean.');
  if (!world.cast || world.cast.momSpawned !== false) errors.push('V2 Mom appearance state should start clean.');
  if (world.salmonTarget !== 20) errors.push('V2 salmon target should be 20.');
  if (!world.difficulty || world.difficulty.level !== 1) errors.push('V2 difficulty state should start at level 1.');
  if (world.difficulty.maxActiveWildlife !== 1) errors.push('V2 active wildlife should start capped at 1.');
  World.advancePhase(world, World.PHASES.ENCOUNTERS);
  World.updateDifficulty(world, 46);
  if (world.difficulty.level < 2) errors.push('V2 difficulty level should ramp during encounters.');
  if (!world.environment || world.environment.cycleSeconds !== 240) errors.push('V2 environment cycle state is missing.');
  if (!world.environment || world.environment.midnightSun !== true) errors.push('V2 midnight sun environment state is missing.');
  if (mom.width !== 49 || mom.height !== 132) errors.push('V2 Mom dimensions are not proportional.');
  if (!mom.nonContact) errors.push('V2 Mom should be non-contact.');
  if (!cameo.nonContact || !cameo.dismissOnProjectile) errors.push('V2 Alaska kid cameos should be non-contact and dismissible.');
  if (cameo.boostGiven !== false || cameo.boostRadius < 80) errors.push('V2 Alaska kid cameos should start boost-ready.');
  if (cameo.ttl !== 5) errors.push('V2 Alaska kid cameos should last exactly 5 seconds.');
  if (!salmon.collectible || salmon.perfectWindow !== world.tuning.perfectCatchWindowSeconds) errors.push('V2 salmon perfect catch state is missing.');
  if (salmon.width !== 54 || salmon.height !== 31) errors.push('V2 salmon dimensions changed unexpectedly.');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Hockey Smash v2 verification passed.');
