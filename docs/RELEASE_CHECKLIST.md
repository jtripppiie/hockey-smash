# Hockey Smash Release Checklist

Use this checklist before every pushed version. A release is ready only when the automated gate passes and the player-facing checks have been completed for the changed area.

## Automated Gate

```bash
npm run verify
npm run test:browser
```

Both commands must exit successfully. `git diff --check` must report no whitespace errors, and `git status --short` should contain only intentional release changes.

## Start And Storage

- The root URL loads without console errors or missing assets.
- Daniel and Sofie can each start a run.
- Player names are cleaned and limited to 12 characters.
- Best score and mute preference work when storage is available.
- The game remains playable when browser storage or Web Audio is unavailable.

## Gameplay

- Countdown leads to Salmon Run; 20 catches lead to encounters.
- Salmon catch boxes, landing markers, scoring, misses, combos, and golden bonuses agree visually.
- Bear, eagle, moose, Dad, Mom, teacher, sister, and Alaska kid rules match their contact/non-contact design.
- Projectiles cross the playfield but only affect visible targets.
- Health reaching zero shows retry; surviving encounters shows victory.

## Controls And Accessibility

- Keyboard and circular-pad movement both work.
- Up jumps, down slides/ducks, and dragging between pad directions does not stick input.
- Pause, resume, mute, retry, and fullscreen remain keyboard accessible.
- Focus rings are visible.
- Large text does not enlarge the direction pad beyond 104px or collapse its arrow spacing.
- Reduced-motion mode preserves all information.

## Responsive Layout

- Check a narrow portrait phone, short landscape phone, and desktop viewport.
- HUD, canvas, controls, fullscreen, mute, and pause controls do not overlap.
- Portrait controls remain below the canvas; landscape controls stay inside the play frame.
- Safe-area insets work in fullscreen.

## Assets And Release Metadata

- Every runtime asset is listed in `ASSET_MANIFEST.md`.
- No retired fallback or unreferenced generated asset remains.
- `package.json`, `package-lock.json`, badge fallback, script cache keys, tests, README, and changelog use the same version.
- New behavior is documented in the README or the relevant file in `docs/`.
