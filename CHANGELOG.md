# Changelog

## 1.5.0 - Learning Edition

- Added pause/resume with keyboard, touch-friendly buttons, and automatic tab-hide pausing.
- Added a personal best score saved in the browser and shown in the HUD and game-over panel.
- Initialized combo state explicitly so the player model documents all scoring memory.
- Added a beginner code tour, project map, experiments, and troubleshooting guide.
- Rewrote the contribution guide for the current playable architecture.
- Expanded automated verification for the new gameplay and documentation contracts.

## v2 Harness Promotion And Repo Cleanup

- Promoted Hockey Smash v2 as the current playable direction.
- Changed the public root page to serve the main Hockey Smash game directly.
- Removed the previous layered v1 runtime CSS and JavaScript files.
- Removed old dungeon-era docs, data, and legacy verification scripts.
- Replaced static and browser checks with v2-focused verification.
- Kept v2 gameplay in the world-state/canvas-renderer architecture.
- Removed bear/moose speech bubbles in v2 because wildlife callouts did not make sense.
- Added ground landing markers for falling salmon so players can start moving toward the catch point.
- Added parallax-ready background rendering, placeholder layer assets, sun/moon sky objects, and a night-sky filter.
- Added generated Soldotna parallax background layers with mountains, storefronts, sidewalk/street foreground, and a deterministic `Nelson Engineering` sign overlay.
- Preserved v2 mobile responsiveness, compact splash, fullscreen toggle, salmon tuning, faster player movement, and proportional Mom sizing.

## 0.14.4 - Cast QA And Controls

- Shipped **Hockey Smash v0.14.4** with visible build badge `Build 2026-06-30.60`.
- Kept the current shell, package version, CSS manifest, README, docs, and verifier aligned on `0.14.4-20260630.60`.
- Added a dev-only Spawn Cast shortcut and scriptable cast QA API.
- Changed desktop Space to fire the action shot; jump remains on ArrowUp, W, and J.
- Added browser coverage for Space firing and cast shortcut spawning.
- Removed unused local CSS/JS experiment layers that are not loaded by the current game.

## 0.13.7 - Falling Fish Hazards

- Shipped **Hockey Smash v0.13.7** with visible build badge `Build 2026-06-29.53`.
- Changed salmon/fish hazards so they rain down from the top of the screen instead of entering sideways.
- Added rain, heavyRain, fastRain, and schoolRain falling-fish variants.
- Updated fish dodge rules so falling fish resolve when they cross the player vertically and reward moving out from under them.
- Kept bears and moose as fightable ground threats while combo spawns can overlap them with falling fish.
- Updated cache keys, package version, README, docs, and verifier checks for v0.13.7.

## 0.13.6 - Charged Shots And Salmon Patterns

- Shipped **Hockey Smash v0.13.6** with visible build badge `Build 2026-06-29.52`.
- Added charged puck/pointe-shoe shooting with hold-to-charge and release-to-fire controls.
- Tightened projectile cooldown to 180ms for more responsive tap shooting.
- Extended the charge window to 720ms and strengthened charged shot damage, size, glow, feedback text, and arcing physics.
- Preserved Daniel puck behavior and Sofie Dance Smash pointe-shoe behavior instead of replacing the integrated character layer.
- Added explicit salmon patterns: `highArc`, `low`, and `school`.
- Improved salmon dodge rules so highArc salmon require a higher jump and low salmon require sliding.
- Added combo encounter spawns so difficulty can create a second encounter shortly after the first.
- Added safe puck-speed power-ups from defeated bears/moose. Power-ups live in the projectile layer instead of `state.entities`, so the old core collision loop cannot treat them as damage hazards.
- Added `js/games/hockey-smash-v0110.js` as the final v0.13.6 release marker and updated cache keys, package version, docs, and verifier checks.

## 0.13.5 - Compact No-Scroll Splash

- Shipped **Hockey Smash v0.13.5** with visible build badge `Build 2026-06-29.51`.
- Reduced the splash screen size so people should not need to scroll before starting the game.
- Shrunk the splash hero image, title, tagline, copy, button height, and spacing.
- Shrunk the Daniel/Sofie character buttons and player name input.
- Added short-screen and portrait overrides in `style.css` and `hockey-smash-custom.css`.
- Kept all splash content visible: image, title, copy, character selector, player name input, Start Game button, and note.

## 0.13.4 - Start Countdown And Right-Side Salmon Guard

- Shipped **Hockey Smash v0.13.4** with visible build badge `Build 2026-06-29.50`.
- Added a 10-second safe practice countdown after Start Game.
- Shows the gameplay screen and controls during the countdown so players can learn left, right, jump, slide, and action before hazards begin.
- Holds back salmon, wildlife, family interruptions, Dad jokes, and boss progression during the countdown.
- Skips the countdown in `?computerMode=1` so Computer Play and automated diagnostics still start quickly.
- Forces salmon/fish to enter from the right side only and move left toward the player.

## 0.13.3 - Normal Splash And Dev-Only Computer Play

- Shipped **Hockey Smash v0.13.3** with visible build badge `Build 2026-06-29.49`.
- Kept normal players focused on Start Game only.
- Hid Watch Computer Play and the debug boot log unless dev mode is active.
- Added splash-image triple-tap unlock for dev mode.
- Kept `?debug=1`, `?dev=1`, and `?computerMode=1` as automatic dev-mode triggers.

## 0.13.2 - Dance Smash And Pointe Shoe Projectiles

- Added Sofie/Dance Smash mode labels.
- Updated Sofie's action button to use a pointe-shoe action instead of hockey-stick language.
- Added pointe-shoe projectile behavior for Sofie while Daniel keeps puck behavior.
- Added shoe-specific hit feedback through the score/floating-text layer.

## Earlier History

See prior repository history for v0.9.x through v0.13.1 gameplay, control, score, projectile, character, and layout checkpoints.
