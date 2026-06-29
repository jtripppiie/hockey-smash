# Hockey Smash Build Progress

This file tracks implementation progress so work can continue safely across sessions.

## Current Checkpoint: Hockey Smash v0.13.6

Visible build badge:

```text
Hockey Smash v0.13.6 · Build 2026-06-29.52
```

Current cache key:

```text
0.13.6-20260629.52
```

Current public preview:

```text
https://jtripppiie.github.io/hockey-smash/?fresh=0136
```

## 2026-06-29 Checkpoint: Charged Shots And Salmon Patterns

Implemented:

- Added hold/release charged shooting for Daniel pucks and Sofie pointe shoes.
- Added faster 180ms tap-shot cooldown.
- Added 720ms max charge window, stronger charged damage, larger projectile visuals, stronger hit feedback, and arcing projectile physics.
- Added highArc, low, and school salmon patterns.
- Improved dodge rules so highArc salmon need a high jump and low salmon need slide/duck.
- Added combo encounter spawns as difficulty rises.
- Added safe puck-speed power-ups from defeated bears/moose. These live in the projectile layer instead of `state.entities` so the old core collision loop cannot damage the player for collecting a reward.
- Added `js/games/hockey-smash-v0110.js` as the final v0.13.6 release marker.
- Updated package version, cache keys, verifier, README, changelog, workflow, QA, checklist, progress notes, and beginner handoff docs.

Verify:

- Open `https://jtripppiie.github.io/hockey-smash/?fresh=0136`.
- Confirm the visible badge says `Hockey Smash v0.13.6 · Build 2026-06-29.52`.
- Confirm quick tap shots still fire.
- Confirm hold/release charged shots arc and hit harder.
- Confirm highArc, low, and school salmon appear.
- Confirm power-ups can be collected without damage.
- Run `npm run verify` from a local checkout.

## Stable Gameplay Systems Already In Place

- Static GitHub Pages game.
- No backend.
- No accounts.
- Compact splash screen.
- 10-second safe start countdown.
- Daniel/Sofie character selection.
- Smooth keyboard and touch movement.
- Daniel puck projectiles.
- Sofie pointe-shoe projectiles.
- Charged projectile physics.
- HighArc/low/school salmon patterns.
- Moving bear, moose, Mom, and Sister encounters.
- Combo encounter spawns.
- Safe puck-speed power-ups.
- Score, distance, combo, high score, floating feedback, and Try Again summary.
- Dev-only Computer Play.
- Hidden debug unlock.
- Static verification scripts.

## Current Known Limitations

- Browser QA still matters because canvas, pointer controls, localStorage, sessionStorage, CSS media queries, and animation-frame loops can behave differently in real browsers than in static checks.
- The game is still layered through multiple JavaScript patch files. That is workable, but future larger systems should get clearly named files and updated docs.
- Eagle integration was planned earlier but is not wired in this checkpoint.

## Next Recommended Work

1. Manually QA v0.13.6 on the live GitHub Pages URL.
2. Run `npm run verify` locally.
3. Run Playwright browser tests if the local checkout has dependencies installed.
4. Tune charged-shot timing/damage after playing a few runs.
5. Tune salmon pattern frequency if highArc/low/school feels too hard.
