# Hockey Smash Next Polish Plan

Date: 2026-07-01

## Current Package Version

```text
0.14.53
```

## Current Repo Status

```text
branch: main
worktree: clean before this plan document
latest commit: f796e83 Add Alex and update eagle sprites
npm install: up to date
npm run verify: passed
```

Local server note: port `8000` was already in use during the audit and did not serve this repo through the sandboxed curl check. Use an alternate port for manual QA if needed.

## What Already Works

- `/` routes to `dev/hockey-smash-v2.html`.
- The v2 harness owns splash, character select, name input, fullscreen, touch controls, and readout in DOM.
- Gameplay entities are canvas/world-state objects: player, salmon, salmon landing markers, wildlife, family/cast, cameos, projectiles, and effects.
- The world starts in `countdown`, then enters `salmonRun`, then unlocks `encounters` after 20 salmon.
- Daniel and Sofie can be selected and rendered through the canvas renderer.
- Salmon fall with predicted landing markers and increment once per collected fish.
- Bear, moose, eagle, Dad, Mom, dance instructor, and Alaska kid cameos exist as v2 entities.
- Mom and cameos are non-contact; bear/moose speech bubbles are disabled.
- Projectiles are world entities and intentionally fire right.
- Current verification passes.

## What Feels Weak

- Debug mode is not gated by `?debug=1`; the renderer debug block is effectively tied to `gameStarted`.
- Debug readouts are split between a basic canvas overlay and the regular dev readout, with no hitbox or god-mode toggles.
- Difficulty and pacing are scattered across encounter timers, spawn functions, and hard-coded speeds.
- Encounter pacing can spawn a new threat without consulting active wildlife/threat limits.
- Parallax uses a two-layer generated/combined setup rather than the full Soldotna layer inventory requested for the final polish pass.
- Effects are text-only `world.effects`; there is not yet a reusable particle/effect system.
- Player feel is simple: no jump buffer, coyote time, landing dust, or explicit edge-triggered input.
- Salmon Run has the skeleton of a level but needs stronger completion feedback, spawn fairness, and missed/catch feedback.
- Warning markers for wildlife/eagle are not implemented yet.

## Planned Stages

### Stage 1: Stability Audit and Startup Fixes

Expected files changed:

- `docs/hockey-smash-next-polish-plan.md`
- `docs/hockey-smash-v2-progress.md`
- `docs/hockey-smash-v2-migration-checklist.md`
- Runtime files only if startup/manual QA exposes a bug.

Verification command:

```bash
npm run verify
```

Manual browser checklist:

- `/` redirects to v2.
- Start screen appears.
- Daniel renders.
- Sofie renders.
- Countdown appears.
- Salmon do not spawn during countdown.
- Salmon spawn after countdown.
- Salmon can be caught once each.
- Catching 20 salmon unlocks encounters.
- Bear, moose, eagle, Dad, Mom, dance instructor, and cameos appear according to rules.
- Projectiles spawn and damage damageable targets.
- Fullscreen and mobile controls work.
- No serious console errors.

### Stage 1.5: Debug Mode and Quality-of-Life

Expected files changed:

- `dev/hockey-smash-v2.html`
- `js/games/hockey-smash-world-v2.js`
- `js/games/hockey-smash-renderer-v2.js`
- `scripts/verify-hockey-smash.js`
- `README.md`
- `docs/hockey-smash-v2-progress.md`
- `docs/hockey-smash-v2-migration-checklist.md`

Verification command:

```bash
npm run verify
```

Manual browser checklist:

- Debug mode is off by default.
- `?debug=1` enables debug state.
- `~` toggles debug overlay.
- `H` toggles hitboxes only in debug mode.
- `G` toggles god mode only in debug mode.
- Debug panel shows FPS, phase, salmon count, entity counts, difficulty, player motion, projectile cooldown, and last collision.
- Gameplay entities remain canvas/world-state objects.

### Stage 2: Centralized Difficulty Controller

Expected files changed:

- `js/games/hockey-smash-world-v2.js`
- `dev/hockey-smash-v2.html`
- `scripts/verify-hockey-smash.js`
- `README.md`
- `docs/hockey-smash-v2-progress.md`
- `docs/hockey-smash-v2-migration-checklist.md`

Verification command:

```bash
npm run verify
```

Manual browser checklist:

- Salmon Run stays calm.
- Encounters start slowly after 20 salmon.
- Bear and moose do not flood the screen.
- Active wildlife is capped at 1.
- Active damageable threats start capped at 1.
- Speeds ramp gently over time.

### Stage 3: Soldotna Parallax Background

Expected files changed:

- `assets/hockey-smash/backgrounds/parallax/*`
- `assets/hockey-smash/backgrounds/parallax/PLACEHOLDER_ASSETS.md`
- `docs/hockey-smash-asset-inventory.md`
- `dev/hockey-smash-v2.html`
- `js/games/hockey-smash-renderer-v2.js`
- `scripts/verify-hockey-smash.js`
- `README.md`
- `docs/hockey-smash-v2-progress.md`
- `docs/hockey-smash-v2-migration-checklist.md`

Verification command:

```bash
npm run verify
```

Manual browser checklist:

- Background reads as Soldotna, Alaska.
- Welcome sign reads exactly `WELCOME TO SOLDOTNA` and `POPULATION 4,342`.
- Running lane remains readable.
- Layers tile without obvious jumps.
- Images load without broken paths.

### Stage 4: Player Feel

Expected files changed:

- `dev/hockey-smash-v2.html`
- `js/games/hockey-smash-world-v2.js`
- `js/games/hockey-smash-renderer-v2.js`
- `scripts/verify-hockey-smash.js`
- docs as required.

Verification command:

```bash
npm run verify
```

Manual browser checklist:

- Coyote time works without allowing infinite jumps.
- Jump buffer works when pressing just before landing.
- Landing dust appears as canvas/world effects.
- Slide/duck state remains readable.
- Projectile cooldown feedback is clear.
- Mobile buttons feel responsive.

### Stage 5: Salmon Run Polish

Expected files changed:

- `dev/hockey-smash-v2.html`
- `js/games/hockey-smash-world-v2.js`
- `js/games/hockey-smash-renderer-v2.js`
- docs as required.

Verification command:

```bash
npm run verify
```

Manual browser checklist:

- No encounter entity spawns during Salmon Run.
- Salmon paths and markers are readable.
- Salmon do not spawn in impossible clusters.
- Catch and miss feedback is visible but not noisy.
- `SALMON RUN COMPLETE!` appears after 20 salmon.
- Celebration particles appear, then encounters begin.

### Stage 6: Encounter Design

Expected files changed:

- `dev/hockey-smash-v2.html`
- `js/games/hockey-smash-world-v2.js`
- `js/games/hockey-smash-renderer-v2.js`
- docs as required.

Verification command:

```bash
npm run verify
```

Manual browser checklist:

- Bear/moose warning markers appear before entry.
- Eagle shadow/cue is readable.
- Bear and moose stay one at a time.
- People/cameos can show speech bubbles.
- Bear and moose speech bubbles stay disabled.
- Projectiles damage threats but do not collect salmon.
- Mom and cameos remain non-contact.

### Stage 7: Visual Polish and Particle System

Expected files changed:

- `js/games/hockey-smash-world-v2.js`
- `js/games/hockey-smash-renderer-v2.js`
- `dev/hockey-smash-v2.html`
- docs as required.

Verification command:

```bash
npm run verify
```

Manual browser checklist:

- Particles render from world state.
- Catch sparkle, landing dust, projectile trails, hit effects, celebration confetti, and snow are readable.
- Screen shake is subtle and only on big hits.
- Effects do not hide gameplay.

## Known Risks

- Browser automation may be unavailable or require Playwright browser installation.
- Port `8000` may remain occupied, so manual QA may need a different port.
- Existing verification has string-based guards; runtime refactors must update checks without removing safety coverage.
- Full parallax asset replacement could create large binary changes.
- Generated sign text may require manual correction if any image text is misspelled.
- Difficulty changes can accidentally make Salmon Run or early encounters frustrating if active entity caps are not enforced.
