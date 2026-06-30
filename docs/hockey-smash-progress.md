# Hockey Smash Build Progress

This file tracks implementation progress so work can continue safely across sessions.

## Current Checkpoint: Hockey Smash v0.14.4

Visible build badge:

```text
Hockey Smash v0.14.4 · Build 2026-06-29.60
```

Current cache key:

```text
0.14.4-20260629.60
```

Current public preview:

```text
https://jtripppiie.github.io/hockey-smash/?fresh=0144
```

## 2026-06-29 Checkpoint: Cast Cameo Cleanup

Implemented:

- Restored the intended staged flow: fish-dodge level first, then moose/bear wildlife level.
- Suppressed people/cast entities as hazards during Level 2 so the dance instructor and cast do not chase the player.
- Converted Alaskan boy/girl into harmless sideline cameo visuals in the final layer.
- Kept slow bear tuning from v0.14.3.
- Added verification coverage for `alaskan_boy.webp`, `alaskan_girl.webp`, `removeFinalCastEntities`, `hockey-sideline-cameo`, and the disabled parallax starter.
- Kept parallax disabled until exact `2048x576` transparent seamless WebP assets exist.
- Updated package version, cache keys, verifier, README, changelog, workflow, QA, checklist, progress notes, and beginner handoff docs.

Verify:

- Open `https://jtripppiie.github.io/hockey-smash/?fresh=0144`.
- Confirm the visible badge says `Hockey Smash v0.14.4 · Build 2026-06-29.60`.
- Confirm quick tap shots still fire.
- Confirm hold/release charged shots arc and hit harder.
- Confirm rain, heavyRain, fastRain, and schoolRain fish fall from the top.
- Confirm Level 2 is moose/bear-focused.
- Confirm Alaskan boy/girl cameo is visual only and does not damage/chase/collide.
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
- Fish-dodge Level 1.
- Moose/bear wildlife Level 2.
- Alaskan boy/girl sideline cameo visuals.
- Combo encounter spawns.
- Safe puck-speed power-ups.
- Score, distance, combo, high score, floating feedback, and Try Again summary.
- Dev-only Computer Play.
- Hidden debug unlock.
- Static verification scripts.
- Disabled parallax starter with explicit asset instructions.

## Current Known Limitations

- Browser QA still matters because canvas, pointer controls, localStorage, sessionStorage, CSS media queries, and animation-frame loops can behave differently in real browsers than in static checks.
- The game is still layered through multiple JavaScript patch files. That is workable, but future larger systems should get clearly named files and updated docs.
- Parallax assets are not active yet because the exact background-loop assets still need to be added.
- Eagle integration was planned earlier but is not wired in this checkpoint.

## Next Recommended Work

1. Manually QA v0.14.4 on the live GitHub Pages URL.
2. Run `npm run verify` locally.
3. Run Playwright browser tests if the local checkout has dependencies installed.
4. Generate exact parallax midground/foreground assets and activate the disabled starter.
5. Tune falling-fish frequency if rain patterns feel too hard.
