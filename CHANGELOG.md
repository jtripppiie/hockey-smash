# Changelog

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
- Added document-level D-pad hit testing so movement can trigger even if the button's own listener is not receiving the event.
- Added a global `window.HOCKEY_SMASH_DPAD` fallback API for direct movement calls.
- Increased the D-pad tap movement step so a press should be visibly obvious.
- Updated browser tests and static verification for the global D-pad fallback.

## 0.5.9 - Direct D-pad Movement Fallback

- Shipped **Hockey Smash v0.5.9** with visible build badge `Build 2026-06-29.6`.
- Added a direct D-pad movement fallback that mutates the live game state when the left/right buttons are pressed.
- Added pointer capture and hold-to-move behavior for the on-screen directional buttons.
- Kept the visible Daniel overlay synced after direct D-pad movement.
- Updated browser tests and static verification so D-pad clicks must change Daniel's x-position.

## 0.5.8 - Normal Movement And Road Anchoring

- Shipped **Hockey Smash v0.5.8** with visible build badge `Build 2026-06-29.5`.
- Lowered Daniel's normal-mode overlay so his feet anchor to the visible road/sidewalk area instead of floating near the sign.
- Centered the overlay on the real player state and preserved jump lift.
- Added tap-to-move impulse handling so quick D-pad taps visibly move Daniel instead of requiring a long press.
- Softened the emergency yellow marker styling so it reads more like a gameplay marker while the sprite presentation stabilizes.
- Updated browser tests and static verification for normal movement and player-overlay position syncing.

## 0.5.7 - Player-Facing Computer Play Mode

- Shipped **Hockey Smash v0.5.7** with visible build badge `Build 2026-06-29.4`.
- Added a splash-screen **Watch Computer Play** entry point that launches `?computerMode=1`.
- Reframed Computer Mode as a watch/autoplay play mode instead of only a debug route.
- Hid the diagnostic overlay by default unless `&debug=1` is present.
- Added a player-facing Computer Play panel during autoplay.
- Updated verification and browser tests so the watch mode is treated as a supported game path.

## 0.5.4 - Normal Mode Player Visibility

- Shipped **Hockey Smash v0.5.4** with visible build badge `Build 2026-06-29.1`.
- Added a normal-mode player overlay using `assets/hockey-smash/sprites/hockey-player.png` so Daniel is visible outside `?computerMode=1`.
- Kept the overlay synced to the real game-state player position and facing.
- Updated the runtime visible badge and `getVersion()` reporting to match the latest visible checkpoint.
- Updated browser and static verification to fail if the latest badge or player overlay is missing.

## 0.5.3 - Normal Mode Polish Follow-up

- Kept visible versioning only in the top-right build badge.
- Removed the duplicate splash/footer version label and the duplicate HUD version label.
- Added a normal-mode polish layer that hides the debug overlay unless `?computerMode=1` is active.
- Added a normal-mode victory overlay after the final challenge is cleared.
- Added verification coverage for the new polish CSS/script and top-right-only versioning.

## 0.5.3 - Sidewalk Ground Alignment

- Shipped **Hockey Smash v0.5.3** with visible build badge `Build 2026-06-28.8`.
- Moved the shared invisible ground line from `0.60` to `0.82` of canvas height so Daniel, bears, moose, family characters, and Dad stand on the visible sidewalk instead of floating over the storefronts.
- Replaced the old sister insult interruption with `Daniel, heads up!`.

## 0.5.2 - Player Visibility Marker

- Shipped **Hockey Smash v0.5.2** with visible build badge `Build 2026-06-28.7`.
- Moved the player debug marker after sprite drawing so the art cannot cover it.
- Enlarged the marker into a bright box with `PLAYER HERE` text for unmistakable visibility while testing.

## 0.5.1 - Player Sprite, Debug, And Obstacle Stabilization

- Shipped **Hockey Smash v0.5.1** with visible build badge `Build 2026-06-28.6`.
- Added the new `hockey-player.png` as the moving player sprite.
- Fixed processed player sprite rendering so the player is visible on canvas.
- Enlarged the player and added a temporary `PLAYER` marker/ring for movement debugging.
- Added in-game debug readout for position, velocity, facing, active keys, sprite load state, and computer test results.
- Added `?computerMode=1` to automatically test right, left, jump, slide, stick swing, and obstacle clearing.
- Changed touch action buttons to compact `J`, `S`, and hockey stick labels.
- Removed code-drawn gray sidewalk/ground, fallback green mountains, and fallback sun.
- Made bear and moose obstacles larger, earlier, labeled, and clearable with the hockey stick.

## 0.5.0 - Hockey Smash Prototype Pivot

- Pivoted the public launch experience to **Hockey Smash v0.5.0** inside the existing repo.
- Reused the existing static GitHub Pages workflow instead of creating a new repository.
- Added Hockey Smash splash screen, Play button, and short "Entering Hockey Smash..." transition.
- Added full browser-viewport gameplay screen with a 1024x576 landscape-first canvas layout.
- Added fixed-screen side-scroller gameplay with Daniel as the player.
- Added left/right movement, jump, hold-to-slide speed boost, and hockey stick combo attack.
- Added Daniel health bar, invincibility after damage, and Try Again flow.
- Added summer Soldotna-inspired background rendering and sidewalk/ground tile layer.
- Added asset fallback placeholders for missing sprites and scenery.
- Added salmon hazards, a major salmon run sequence, bears, moose, Mom/Sister interruption bubbles, a major salmon run, and Dad boss concept with dad-joke attacks.
- Added temporary mobile portrait rotate hint and no-scroll gameplay controls.
- Added Hockey Smash design, workflow, and dev checklist documentation.
