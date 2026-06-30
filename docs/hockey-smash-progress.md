# Hockey Smash Build Progress

This file tracks implementation progress so work can continue safely across sessions.

## Current Checkpoint: Hockey Smash v0.14.3

Visible build badge:

```text
Hockey Smash v0.14.3 · Build 2026-06-29.59
```

Current cache key:

```text
0.14.3-20260629.59
```

Current public preview:

```text
https://jtripppiie.github.io/hockey-smash/?fresh=0137
```

## 2026-06-29 Checkpoint: Falling Fish Hazards

Implemented:

- Added hold/release charged shooting for Daniel pucks and Sofie pointe shoes.
- Added faster 180ms tap-shot cooldown.
- Added 720ms max charge window, stronger charged damage, larger projectile visuals, stronger hit feedback, and arcing projectile physics.
- Changed salmon/fish hazards to rain down from the top of the screen.
- Added rain, heavyRain, fastRain, and schoolRain falling-fish patterns.
- Improved dodge rules so falling fish reward moving out from under the drop.
- Added combo encounter spawns as difficulty rises.
- Added safe puck-speed power-ups from defeated bears/moose. These live in the projectile layer instead of `state.entities` so the old core collision loop cannot damage the player for collecting a reward.
- Added `js/games/hockey-smash-v0114.js` as the final v0.14.3 release layer.
- Updated package version, cache keys, verifier, README, changelog, workflow, QA, checklist, progress notes, and beginner handoff docs.

Verify:

- Open `https://jtripppiie.github.io/hockey-smash/?fresh=0137`.
- Confirm the visible badge says `Hockey Smash v0.14.3 · Build 2026-06-29.59`.
- Confirm quick tap shots still fire.
- Confirm hold/release charged shots arc and hit harder.
- Confirm rain, heavyRain, fastRain, and schoolRain fish fall from the top.
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
- Rain/heavyRain/fastRain/schoolRain falling-fish patterns.
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

1. Manually QA v0.14.3 on the live GitHub Pages URL.
2. Run `npm run verify` locally.
3. Run Playwright browser tests if the local checkout has dependencies installed.
4. Tune charged-shot timing/damage after playing a few runs.
5. Tune falling-fish frequency if rain patterns feel too hard.
