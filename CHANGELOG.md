# Changelog

## 0.9.9 - Computer Mode Entity Sizing

- Shipped **Hockey Smash v0.9.9** with visible build badge `Build 2026-06-29.20`.
- Added `js/games/hockey-smash-v099.js` as a Computer Mode sizing pass.
- Normalized salmon/fish, bear, moose, Mom, Sister, Dad, and Dad joke dimensions in `?computerMode=1`.
- Kept fish smaller and airborne.
- Kept bear medium-large and moose larger than bear while still fitting the road area.
- Added a continuous sizing loop so newly spawned Computer Mode entities are corrected as they appear.

## 0.9.8 - Normal Gameplay Encounters

- Shipped **Hockey Smash v0.9.8** with visible build badge `Build 2026-06-29.19`.
- Added `js/games/hockey-smash-v098.js` as a normal-mode gameplay encounter pass.
- Brought Computer Mode-style characters into normal play as staged road-section encounters.
- Added fish/salmon dodge hazards.
- Added bear and moose obstacle encounters that can be cleared with stick attacks or dodged where appropriate.
- Added Mom and Sister interruption moments with speech bubbles and small health/slowdown effects.
- Added a late Dad challenge plus Dad joke hazard.
- Kept this as a first gameplay integration pass, not final level tuning.

## 0.9.7 - Smooth Slide Dash

- Shipped **Hockey Smash v0.9.7** with visible build badge `Build 2026-06-29.18`.
- Added smooth slide behavior into the loaded movement override so the existing slide button is intercepted before the older handler fires.
- Changed slide from a jumpy impulse into a short eased dash.
- Added a slide cooldown so repeated desktop clicks do not stack into a burst.
- Added an inline crouch/slide visual on Daniel during the dash.
- Updated package metadata and static verification for the slide improvement.

## 0.9.6 - Smooth Left And Right Controls

- Shipped **Hockey Smash v0.9.6** with visible build badge `Build 2026-06-29.17`.
- Added `js/games/hockey-smash-v096.js` as a focused movement-smoothing override.
- Changed left/right to smooth hold movement with a smaller tap nudge.
- Added duplicate event suppression so repeated desktop clicks do not stack pointerdown and click impulses.
- Left jump, slide, and hockey-stick controls unchanged.
- Updated package metadata and static verification for the movement smoothing patch.

## 0.9.5 - Splash Start, Rotate Warning, And Faster Jump

- Shipped **Hockey Smash v0.9.5** with visible build badge `Build 2026-06-29.16`.
- Added a normal-mode splash start guard so the game returns to the splash screen first unless Computer Play is active or the player has tapped Play.
- Added a mobile portrait rotate prompt on the splash screen.
- Added a persistent portrait gameplay rotate warning.
- Disabled the Daniel overlay position transition so the jump button feels immediate instead of laggy.
- Kept the small Daniel-down alignment override so his feet sit closer to the sidewalk.
- Updated package metadata and static verification for the v0.9.5 startup/mobile feel fixes.

## 0.9.3 - Player Border Removal And Background Preload

- Shipped **Hockey Smash v0.9.3** with visible build badge `Build 2026-06-29.14`.
- Removed the debug border, glow, and background box from the Daniel DOM overlay.
- Added HTML preload links for all five Soldotna road backgrounds.
- Added runtime image preloading for all five road backgrounds with async decoding hints.
- Synced the stage background before resetting Daniel to the left side so transitions feel faster.
- Updated static verification so the player border and missing background preload cannot regress.

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
