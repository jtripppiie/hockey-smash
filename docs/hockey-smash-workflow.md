# Hockey Smash Workflow

## Project Overview

Hockey Smash is a static browser canvas game. It lives in the existing repo and reuses the GitHub Pages deployment path.

## File Map

- `index.html`: public Hockey Smash shell and gameplay markup.
- `style.css`: splash, transition, gameplay viewport, HUD, controls, and no-scroll layout.
- `script.js`: starts the game on `DOMContentLoaded`.
- `js/games/hockey-smash.js`: all v0.5.0 runtime logic.
- `assets/`: Hockey Smash art files.
- `scripts/verify-hockey-smash.js`: launch/docs/static verifier.

## Local Run Command

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080/
```

## Asset Folder Rules

- Keep Hockey Smash PNGs directly under `assets/` for now.
- Use the exact names listed in `docs/hockey-smash-design.md`.
- Missing assets are okay during prototyping because `hockey-smash.js` draws labeled placeholders.
- Do not load external art or remote APIs.

## Version Update Checklist

When changing visible behavior:

1. Update the version text in `index.html`.
2. Update `VERSION` in `js/games/hockey-smash.js`.
3. Update `package.json` if the project package version changes.
4. Update `README.md`.
5. Update `CHANGELOG.md`.
6. Update progress and QA docs.

## Gameplay Tuning Locations

Open `js/games/hockey-smash.js`.

- `TUNING.walkSpeed`
- `TUNING.slideSpeed`
- `TUNING.jumpVelocity`
- `TUNING.gravity`
- `TUNING.groundRatio`
- spawn timers inside `createState`
- hazard damage inside spawn helpers
- Dad health inside `updateBoss`

## Control Mapping Locations

- Keyboard mapping: `keyToAction`.
- Touch/pointer buttons: `[data-action]` buttons in `index.html`.
- Shared action behavior: `jump`, `swingStick`, and the `keys` set in `updatePlayer`.

## Adding A New Enemy Or Hazard

1. Add a sprite path in `ASSETS`.
2. Add spawn data in a helper like `spawnWildlife`.
3. Add movement/damage behavior in `updateEntities`.
4. Add drawing support in `drawEntity`.
5. Add a clear message in `clearMessage`.
6. Update docs and QA.

## Adding A Family Interruption

1. Add sprite paths in `ASSETS`.
2. Spawn an entity with a `bubble` string.
3. Give the bubble HP.
4. Let `resolveStickHits` clear it.
5. Update tone and QA notes.

## Mobile Layout Test

1. Open the game in a phone-sized viewport.
2. Start gameplay.
3. Confirm the portrait rotate hint appears briefly.
4. Rotate to landscape.
5. Confirm the D-pad and action controls are fixed at the bottom corners.
6. Confirm Daniel is not covered by controls.

## Keyboard And D-Pad Test

Keyboard:

- `A` / `ArrowLeft`: move left.
- `D` / `ArrowRight`: move right.
- `W` / `ArrowUp` / `Space`: jump.
- `Shift` / `S`: slide boost.
- `F` / `Enter`: hockey stick.

D-pad/action buttons:

- Hold left/right and confirm Daniel moves.
- Hold Slide while moving and confirm speed increases.
- Tap Stick quickly three times and confirm combo messaging.

## Confirming No Page Scroll

During gameplay:

- Press arrow keys repeatedly.
- Hold touch controls.
- Drag on the controls.
- Drag on the canvas.

The browser page should not scroll. The game uses `body.hockey-playing`, fixed viewport layout, `touch-action: none`, and keyboard `preventDefault`.

## Updating Docs

Update these when behavior changes:

- `README.md`
- `CHANGELOG.md`
- `docs/roadside-realm-progress.md`
- `docs/roadside-realm-qa.md`
- `docs/hockey-smash-design.md`
- `docs/hockey-smash-workflow.md`
- `docs/hockey-smash-dev-checklist.md`
