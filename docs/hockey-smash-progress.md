# Hockey Smash Build Progress

This file tracks implementation progress so work can continue safely across sessions.

## Current Checkpoint: Hockey Smash v0.13.4

Visible build badge:

```text
Hockey Smash v0.13.4 · Build 2026-06-29.50
```

Current cache key:

```text
0.13.4-20260629.50
```

Current public preview:

```text
https://jtripppiie.github.io/hockey-smash/?fresh=0134
```

## 2026-06-29 Checkpoint: Start Countdown And Right-Side Salmon

Implemented:

- Added a 10-second practice countdown after Start Game.
- Gameplay appears during the countdown so players can see and practice the D-pad, jump, slide, and action buttons.
- Hazards are held back during the countdown.
- Salmon/fish are forced to enter from the right side only.
- Computer Mode skips the countdown so automated testing still starts quickly.
- Added beginner-friendly comments in `js/games/hockey-smash-v0109.js` explaining the final safety layer, countdown logic, spawn holds, and salmon direction guard.
- Updated README, changelog, workflow docs, QA docs, dev checklist, beginner handoff guide, package version, cache keys, and static verifier checks.

Key files changed or added:

- `index.html`
- `hockey-smash.css`
- `package.json`
- `README.md`
- `CHANGELOG.md`
- `js/games/hockey-smash-v0109.js`
- `scripts/verify-hockey-smash.js`
- `docs/hockey-smash-workflow.md`
- `docs/hockey-smash-dev-checklist.md`
- `docs/hockey-smash-qa.md`
- `docs/hockey-smash-kid-handoff.md`
- `docs/hockey-smash-progress.md`

Verify:

- Open `https://jtripppiie.github.io/hockey-smash/?fresh=0134`.
- Confirm the visible badge says `Hockey Smash v0.13.4 · Build 2026-06-29.50`.
- Click Start Game.
- Confirm the 10-second countdown appears on the gameplay screen.
- Confirm the controls work during the countdown.
- Confirm hazards do not attack during the countdown.
- Confirm salmon/fish come from the right side only after the countdown.
- Open `?computerMode=1` and confirm Computer Mode starts quickly without waiting through the countdown.
- Run `npm run verify` from a local checkout.

## 2026-06-29 Checkpoint: v0.13.3 Normal Splash And Dev-Only Tools

Implemented:

- Normal splash now shows Start Game only.
- Watch Computer Play is hidden from normal players.
- Debug boot log is hidden from normal players.
- Triple-tap/click the splash image within about 1.5 seconds to unlock dev mode.
- `?debug=1`, `?dev=1`, and `?computerMode=1` still auto-enable dev mode.
- Added final guards to keep Sofie labels normalized and accidental canvas shake cleared.

## 2026-06-29 Checkpoint: v0.13.2 Dance Smash / Sofie Mode

Implemented:

- Daniel keeps Hockey Smash title, hockey stick action, and puck behavior.
- Sofie gets Dance Smash title, Dance Smash transition copy, and pointe-shoe action language.
- Sofie throws pointe shoes instead of pucks.
- Hit feedback supports pointe-shoe text.

## 2026-06-29 Checkpoint: CSS Manifest And Hidden-Screen Repair

Implemented:

- `index.html` loads one CSS entry point: `hockey-smash.css`.
- Individual CSS layers are imported by the manifest.
- Strong `[hidden]` CSS rules ensure hidden screens cannot remain visible or clickable.
- This fixed the earlier situation where gameplay buttons could be clicked while the game was still in splash mode.

## Stable Gameplay Systems Already In Place

- Static GitHub Pages game.
- No backend.
- No accounts.
- Local WebP assets.
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

- Browser QA still matters because canvas, pointer controls, localStorage, sessionStorage, and animation-frame loops can behave differently in real browsers than in static checks.
- The game is still layered through multiple JavaScript patch files. That is workable, but future larger systems should get clearly named files and updated docs.
- Eagle integration was planned earlier but is not wired in this checkpoint.
- The countdown badge is currently created with inline styles from `js/games/hockey-smash-v0109.js`; if it needs visual polish later, move the styling into a CSS file and document that move.

## Next Recommended Work

1. Manually QA v0.13.4 on the live GitHub Pages URL.
2. Run `npm run verify` locally.
3. Run Playwright browser tests if the local checkout has dependencies installed.
4. Consider moving countdown badge styling into CSS if the design needs more polish.
5. Add eagle hazard only after the eagle image assets are confirmed in the repo.
6. Keep future gameplay changes documented in README, CHANGELOG, QA, workflow, checklist, and the beginner handoff guide.

## Older History

Older v0.5.x through v0.12.x checkpoint details are summarized in `CHANGELOG.md`. The important active handoff docs are now:

- `README.md`
- `CHANGELOG.md`
- `docs/hockey-smash-workflow.md`
- `docs/hockey-smash-dev-checklist.md`
- `docs/hockey-smash-qa.md`
- `docs/hockey-smash-kid-handoff.md`
