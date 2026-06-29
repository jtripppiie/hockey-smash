# Changelog

## 0.13.5 - Compact No-Scroll Splash

- Shipped **Hockey Smash v0.13.5** with visible build badge `Build 2026-06-29.51`.
- Reduced the splash screen size so people should not need to scroll before starting the game.
- Shrunk the splash hero image, title, tagline, copy, button height, and spacing.
- Shrunk the Daniel/Sofie character buttons and player name input.
- Added short-screen and portrait overrides in `style.css` and `hockey-smash-custom.css`.
- Kept all splash content visible: image, title, copy, character selector, player name input, Start Game button, and note.
- Updated cache keys, package version, README, workflow docs, QA docs, dev checklist, progress notes, beginner handoff guide, and static verifier checks for `0.13.5`.

## 0.13.4 - Start Countdown And Right-Side Salmon Guard

- Shipped **Hockey Smash v0.13.4** with visible build badge `Build 2026-06-29.50`.
- Added a 10-second safe practice countdown after Start Game.
- Shows the gameplay screen and controls during the countdown so players can learn left, right, jump, slide, and action before hazards begin.
- Holds back salmon, wildlife, family interruptions, Dad jokes, and boss progression during the countdown.
- Skips the countdown in `?computerMode=1` so Computer Play and automated diagnostics still start quickly.
- Forces salmon/fish to enter from the right side only and move left toward the player.
- Added extra beginner-friendly comments in `js/games/hockey-smash-v0109.js` explaining dev mode, the countdown, spawn holds, and the salmon direction guard.
- Updated cache keys, package version, README, workflow docs, QA docs, dev checklist, progress notes, beginner handoff guide, and static verifier checks for `0.13.4`.

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

## 0.13.1 - Splash And Title Cleanup

- Fixed the public title language so the splash says **Hockey Smash**.
- Kept Fullscreen inside gameplay instead of showing it as a splash-screen action.
- Continued cache-key cleanup so deployed GitHub Pages checkpoints are easier to verify.

## 0.13.0 - CSS Manifest And Hidden Screen Repair

- Switched `index.html` to load one CSS entry point: `hockey-smash.css`.
- Moved individual CSS layer imports into the CSS manifest.
- Added hard `[hidden]` overrides so hidden splash/gameplay/transition/try-again screens cannot remain clickable.
- Preserved debug tools while keeping them out of normal player flow.

## Earlier History

See prior repository history for v0.9.x through v0.12.x gameplay, control, score, projectile, character, and layout checkpoints.
