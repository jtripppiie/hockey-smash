# Hockey Smash QA Routes

## Current Preview

- Public game: `Hockey Smash v0.13.6`
- Visible build badge: `Hockey Smash v0.13.6 · Build 2026-06-29.52`
- Package version: `0.13.6`
- GitHub Pages URL: `https://jtripppiie.github.io/hockey-smash/`
- Fresh cache-bust URL: `https://jtripppiie.github.io/hockey-smash/?fresh=0136`
- Computer Play URL: `https://jtripppiie.github.io/hockey-smash/?computerMode=1`

## v0.13.6 Gameplay QA

### Launch / Layout

1. Open `https://jtripppiie.github.io/hockey-smash/?fresh=0136`.
2. Confirm the top-right badge says `Hockey Smash v0.13.6 · Build 2026-06-29.52`.
3. Confirm the compact splash still fits without obvious scrolling.
4. Click Start Game.
5. Confirm the 10-second countdown appears before hazards begin.

### Charged Projectiles

1. Tap the action button/key quickly and confirm a fast shot fires.
2. Hold the action button/key and release to fire a charged shot.
3. Confirm charged shots look bigger/brighter.
4. Confirm charged shots arc through the air.
5. Confirm charged shots hit bear/moose harder.
6. Confirm Daniel still fires pucks.
7. Confirm Sofie still throws pointe shoes.
8. Confirm hit feedback and score feedback still appear.

### Salmon Patterns

1. Confirm all salmon enter from the right side only.
2. Confirm normal salmon can be dodged by jump or slide.
3. Confirm `highArc` salmon require a higher jump.
4. Confirm `low` salmon require sliding.
5. Confirm `school` salmon appear wider and hit harder if missed.
6. Confirm missed salmon reduce health.
7. Confirm successful salmon dodges show feedback.

### Power-Ups

1. Defeat bear/moose with projectiles.
2. Confirm a puck-speed power-up can drop sometimes.
3. Skate through the power-up and confirm it is collected.
4. Confirm collecting the power-up does not damage the player.
5. Confirm later shots are boosted/glow while the boost is active.

### Computer Play / Watch Mode

1. Open `https://jtripppiie.github.io/hockey-smash/?computerMode=1`.
2. Confirm the game starts automatically after the splash.
3. Confirm Computer Mode does not wait through the countdown.
4. Confirm movement, encounters, projectiles, score, and customization still work.

## Local Verification Commands

Run before pushing a release-quality checkpoint:

```bash
npm run verify
```

Optional browser automation:

```bash
npm install
npm run test:browser:install
npm run test:browser
```

## Known QA Notes

- The current architecture is layered: the core runtime loads first, then later scripts patch or extend movement, HUD, encounters, Try Again, projectiles, character mode, dev tools, layout, and final safety rules.
- The visible badge, package version, cache key, final release marker, README, changelog, workflow docs, QA docs, checklist, progress docs, and beginner handoff guide should all agree on v0.13.6.
- Browser QA still matters because the game uses canvas, DOM overlays, pointer controls, localStorage, sessionStorage, media queries, and requestAnimationFrame loops.
