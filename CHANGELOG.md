# Changelog

## 0.9.2 - Hidden Startup Overlay And Visible Stage Backgrounds

- Shipped **Hockey Smash v0.9.2** with visible build badge `Build 2026-06-29.13`.
- Hid the Daniel DOM overlay until the player has been synced to the real canvas position so he no longer flashes below the game area at load.
- Removed the default `Ready.` status text from the HUD.
- Added CSS to hide the status overlay when it is empty.
- Added a visible stage-background layer so road-section changes show the next Soldotna background immediately.
- Updated static verification so the Ready text and missing stage-background layer cannot regress.

## 0.9.1 - Continuous Road Progression And Computer Player Cleanup

- Shipped **Hockey Smash v0.9.1** with visible build badge `Build 2026-06-29.12`.
- Added `js/games/hockey-smash-v091.js` as a focused gameplay override.
- Hid the DOM Daniel overlay during Computer Play so the canvas-controlled computer player is not duplicated.
- Added continuous road-section progression: when Daniel reaches the right edge, the game advances to the next Soldotna background section and places Daniel back on the left.
- Added backtracking support from the left edge to the previous road section.
- Added final-section looping so Daniel is no longer hard-stopped at the first background.
- Updated package metadata, README, static verification, and browser tests.

## 0.9.0 - Character Overlays, Fullscreen, And Mobile Playability

- Shipped **Hockey Smash v0.9.0** with visible build badge `Build 2026-06-29.11`.
- Added fullscreen controls on the splash screen and during gameplay.
- Added a dedicated `hockey-smash-v09.css` stylesheet for v0.9 fullscreen, entity overlay, and landscape-phone layout work.
- Added visible DOM overlays synced to live game state for salmon/fish, bears, moose, Mom, Sister, Dad, and Dad jokes.
- Kept Daniel visible through the existing player overlay and scaled him down on compact mobile layouts.
- Added a visible jump impulse so the mobile `J` button clearly moves Daniel upward.
- Preserved D-pad fallback movement and Watch Computer Play mode.
- Updated README, static verification, and browser tests for the v0.9 milestone.

## 0.5.11 - Portrait Mobile Layout Fix

- Shipped **Hockey Smash v0.5.11** with visible build badge `Build 2026-06-29.8`.
- Added portrait-specific gameplay layout so the HUD, canvas, Daniel, and controls no longer stack into each other on phones.
- Compacted the mobile HUD and hid the oversized Ready/status panel in portrait play.
- Positioned the canvas near the top of the portrait viewport and kept controls separated below it.
- Relaxed D-pad movement state checks so the buttons can move Daniel even if the game still reports a Ready/transition state.
- Added portrait browser test coverage for canvas/control separation and D-pad movement.

## 0.5.10 - Document-Level D-pad Hit Testing

- Shipped **Hockey Smash v0.5.10** with visible build badge `Build 2026-06-29.7`.
