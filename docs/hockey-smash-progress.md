# Hockey Smash Build Progress

This file tracks implementation progress so work can continue safely across sessions.

## Current Checkpoint: Hockey Smash v0.13.5

Visible build badge:

```text
Hockey Smash v0.13.5 · Build 2026-06-29.51
```

Current cache key:

```text
0.13.5-20260629.51
```

Current public preview:

```text
https://jtripppiie.github.io/hockey-smash/?fresh=0135
```

## 2026-06-29 Checkpoint: Compact No-Scroll Splash

Implemented:

- Reduced the splash screen size so people should not need to scroll just to see the image, text, character controls, name input, Start Game button, and note.
- Shrunk the splash hero image, title, tagline, copy, vertical gaps, and Start Game button sizing in `style.css`.
- Shrunk the Daniel/Sofie buttons and player name input in `hockey-smash-custom.css`.
- Added short-screen and portrait media-query overrides for tighter screens.
- Kept all splash content visible instead of removing pieces from the screen.
- Bumped visible build, package version, cache keys, docs, and verification checks to v0.13.5.

Verify:

- Open `https://jtripppiie.github.io/hockey-smash/?fresh=0135`.
- Confirm the visible badge says `Hockey Smash v0.13.5 · Build 2026-06-29.51`.
- Confirm the splash content is compact and should not require scrolling on common screen sizes.
- Confirm Start Game remains visible.
- Confirm the character buttons and player-name input are still usable.
- Run `npm run verify` from a local checkout.

## 2026-06-29 Checkpoint: Start Countdown And Right-Side Salmon

Implemented:

- Added a 10-second practice countdown after Start Game.
- Gameplay appears during the countdown so players can see and practice the D-pad, jump, slide, and action buttons.
- Hazards are held back during the countdown.
- Salmon/fish are forced to enter from the right side only.
- Computer Mode skips the countdown so automated testing still starts quickly.
- Added beginner-friendly comments in `js/games/hockey-smash-v0109.js` explaining the final safety layer, countdown logic, spawn holds, and salmon direction guard.
- Updated README, changelog, workflow docs, QA docs, dev checklist, beginner handoff guide, package version, cache keys, and static verifier checks.

## Stable Gameplay Systems Already In Place

- Static GitHub Pages game.
- No backend.
- No accounts.
- Local WebP assets.
- Compact splash screen.
- Splash customization.
- Daniel/Sofie character selection.
- Player-name persistence through `localStorage`.
- Fullscreen gameplay chip.
- Smooth keyboard and touch movement.
- Jump buffer and coyote-time forgiveness.
- Slide/duck behavior.
- Daniel puck projectiles.
- Sofie pointe-shoe projectiles.
- Moving salmon, bear, moose, Mom, and Sister encounters.
- Score, distance, combo, high score, floating feedback, and Try Again summary.
- Dev-only Computer Play.
- Hidden debug unlock.
- Static verification scripts.

## Current Known Limitations

- Browser QA still matters because canvas, pointer controls, localStorage, sessionStorage, CSS media queries, and animation-frame loops can behave differently in real browsers than in static checks.
- The game is still layered through multiple JavaScript patch files. That is workable, but future larger systems should get clearly named files and updated docs.
- Eagle integration was planned earlier but is not wired in this checkpoint.
- The countdown badge is currently created with inline styles from `js/games/hockey-smash-v0109.js`; if it needs visual polish later, move the styling into a CSS file and document that move.

## Next Recommended Work

1. Manually QA v0.13.5 on the live GitHub Pages URL.
2. Run `npm run verify` locally.
3. Run Playwright browser tests if the local checkout has dependencies installed.
4. Fine-tune compact splash sizing if a specific phone/browser still scrolls.
5. Consider moving countdown badge styling into CSS if the design needs more polish.
6. Add eagle hazard only after the eagle image assets are confirmed in the repo.
7. Keep future gameplay/layout changes documented in README, CHANGELOG, QA, workflow, checklist, and the beginner handoff guide.

## Older History

Older checkpoint details are summarized in `CHANGELOG.md`. The important active handoff docs are now:

- `README.md`
- `CHANGELOG.md`
- `docs/hockey-smash-workflow.md`
- `docs/hockey-smash-dev-checklist.md`
- `docs/hockey-smash-qa.md`
- `docs/hockey-smash-kid-handoff.md`
