# Changelog

## 0.7.0 - Game Loop Verification Pass

- Hardened the input/render loop so missing or stale DOM targets cannot freeze the playable view.
- Made the visible first-person viewport update with map, coordinates, facing, step count, and scene signature.
- Added local-only Computer Mode with `?computerMode=1` and fast mode with `?computerMode=1&speed=fast`.
- Added a visible auto-play verification overlay that checks launch, movement, turning, item pickup, inspect feedback, map transitions, ending trigger, and runtime errors.
- Added runtime error capture for browser errors and unhandled promise rejections.
- Updated version badges, README, QA notes, and progress documentation.

## 0.3.0 - WarClass-Inspired Visual Overhaul

- Added a DOM/CSS first-person viewport with layered floor, ceiling, side walls, far wall, doors, objects, enemy silhouettes, grain, vignette, and location caption.
- Added a denser RPG interface with party strip, room scanner, gear deck, inventory, log, status meters, and development Help overlay.
- Kept the existing canvas renderer as a fallback while making the new DOM viewport the primary presentation.
- Added state-driven visual classes for walls, gates, items, monsters, exits, the mansion, the underpass, the conservatory, and Soldotna Creek Wayside.
- Updated README, QA notes, and progress documentation.
- WarClass was used for visual/interface inspiration only; no WarClass assets were copied.

## 0.2.8 - Soldotna Creek Wayside And Help Overlay

- Added the optional Soldotna Creek Wayside route.
- Added Spruce Signling and River Current Sprite encounters.
- Added Midnight Sun Snack and Kenai River Charm.
- Added the development cheatsheet overlay.

## 0.2.7 - Asset Safety Pass

- Added runtime chroma-key cleanup for local generated sprite sheets.
- Documented WarClass as inspiration only.
