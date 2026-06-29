# Hockey Smash Workflow

## Project Overview

Hockey Smash is a static browser canvas game served through GitHub Pages. The current public checkpoint is **Hockey Smash v0.11.8 · Build 2026-06-29.33**.

The game is intentionally static:

- No backend.
- No accounts.
- No build step required to play locally.
- Vanilla HTML, CSS, and JavaScript.
- Local sprite/background assets.

## Current Public URLs

Normal play:

```text
https://jtripppiie.github.io/hockey-smash/
```

Computer Play / Watch Mode:

```text
https://jtripppiie.github.io/hockey-smash/?computerMode=1
```

Debug Computer Play:

```text
https://jtripppiie.github.io/hockey-smash/?computerMode=1&debug=1
```

## File Map

- `index.html`: public Hockey Smash shell, visible build badge, splash, controls, HUD, canvas, and script/css loading order.
- `style.css`: splash, transition, gameplay viewport, HUD, controls, and no-scroll layout.
- `hockey-smash-polish.css`: player overlay, debug hiding, mobile polish, and victory overlay styling.
- `hockey-smash-v09.css`: fullscreen, entity overlay, and landscape-phone layout overrides.
- `hockey-smash-v094.css`, `hockey-smash-v095.css`, `hockey-smash-v0111.css`: later layout/HUD polish layers.
- `script.js`: starts the game on `DOMContentLoaded`.
- `js/games/hockey-smash.js`: original core runtime, state machine, input set, base movement, spawns, collision, rendering, and asset fallbacks.
- `js/games/hockey-smash-polish.js`: polish layer and legacy Computer Mode D-pad helper behavior.
- `js/games/hockey-smash-v091.js`: road-section progression and Computer Play duplicate-player guard.
- `js/games/hockey-smash-v095.js`: later gameplay/presentation patch layer.
- `js/games/hockey-smash-v096.js`: smooth movement controller for normal play and Computer Mode.
- `js/games/hockey-smash-v099.js`: Computer Mode entity sizing pass.
- `js/games/hockey-smash-v0100.js`: Game Over / Try Again flow.
- `js/games/hockey-smash-v0102.js`: moving gameplay encounter pass.
- `js/games/hockey-smash-v0103.js`: puck action and fish dodge layer.
- `assets/hockey-smash/`: Hockey Smash art files.
- `scripts/verify-hockey-smash.js`: static launch/docs/file verifier.
- `scripts/verify-hockey-smash-actions.js`: non-browser action verifier for core movement and stick behavior.
- `docs/hockey-smash-qa.md`: manual QA routes.
- `docs/hockey-smash-dev-checklist.md`: short checkpoint checklist.

## Local Run Command

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080/
```

Computer Play locally:

```text
http://localhost:8080/?computerMode=1
```

## Version Update Checklist

When changing visible behavior:

1. Update the visible badge in `index.html`.
2. Update cache keys in `index.html`.
3. Update the latest overlay script version/build labels, especially the file loaded last.
4. Update `package.json` if the project package version changes.
5. Update `scripts/verify-hockey-smash.js` so stale versions fail verification.
6. Update `README.md`.
7. Update `CHANGELOG.md`.
8. Update `docs/hockey-smash-qa.md`.
9. Update `docs/hockey-smash-dev-checklist.md`.
10. Update this workflow file if file responsibilities or QA expectations changed.

## Current v0.11.8 Behavior Notes

- Normal play and Computer Play should now use the same newer smooth movement controller.
- Normal play and Computer Play should now use the same moving encounter pass.
- Computer Play should differ mainly by who provides input: the computer phase driver instead of a person.
- The puck layer already runs in both normal play and Computer Play.
- Fish/salmon hazards are meant to be avoided by jumping or sliding/ducking.
- Bear/moose obstacles are meant to move toward Daniel and be clearable during play.

## Gameplay Tuning Locations

Core tuning begins in `js/games/hockey-smash.js`:

- `TUNING.walkSpeed`
- `TUNING.slideSpeed`
- `TUNING.jumpVelocity`
- `TUNING.gravity`
- `TUNING.groundRatio`
- spawn timers inside `createState`
- hazard damage inside spawn helpers
- Dad health inside `updateBoss`

Newer feel/tuning is layered in:

- `js/games/hockey-smash-v096.js`: smooth movement speed, acceleration, jump buffer, coyote time, slide timing.
- `js/games/hockey-smash-v0102.js`: moving encounter order, size, speed, health, damage, and speech bubble text.
- `js/games/hockey-smash-v0103.js`: puck speed, puck damage, cooldown, and fish dodge damage.

## Control Mapping Locations

Core controls:

- Keyboard mapping: `keyToAction` in `js/games/hockey-smash.js`.
- Touch/pointer buttons: `[data-action]` buttons in `index.html`.
- Shared action behavior: `jump`, `swingStick`, and the `keys` set in `js/games/hockey-smash.js`.

Newer controls:

- Smooth movement input ownership: `js/games/hockey-smash-v096.js`.
- Computer Mode smooth-input bridge: `syncComputerModeInput` in `js/games/hockey-smash-v096.js`.
- Puck action input: `bindStickLaunchers` in `js/games/hockey-smash-v0103.js`.

## Computer Mode Rule

Computer Mode is useful only if it exercises the same gameplay systems as normal play. Do not add future gameplay only to Computer Mode or only to normal play unless the difference is intentional and documented.

Before calling Computer Mode good, check:

1. Smooth movement is active.
2. Moving encounters are active.
3. Fish dodge rules are active.
4. Puck action is active.
5. Try Again still appears when health reaches zero.

## Mobile Layout Test

1. Open the game in a phone-sized viewport.
2. Start gameplay.
3. Confirm the portrait rotate hint appears briefly.
4. Rotate to landscape.
5. Confirm the D-pad and action controls are fixed at the bottom corners.
6. Confirm Daniel is not covered by controls.
7. Confirm the page does not scroll while using controls.

## Updating Docs

Update these when behavior changes:

- `README.md`
- `CHANGELOG.md`
- `docs/hockey-smash-qa.md`
- `docs/hockey-smash-dev-checklist.md`
- `docs/hockey-smash-workflow.md`
- `docs/hockey-smash-progress.md` when the change is a major checkpoint or needs long-term history.
