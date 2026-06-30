# Hockey Smash QA Routes

## Current Preview

- Public game: `Hockey Smash v0.14.4`
- Visible build badge: `Hockey Smash v0.14.4 · Build 2026-06-29.60`
- Package version: `0.14.4`
- GitHub Pages URL: `https://jtripppiie.github.io/hockey-smash/`
- Fresh cache-bust URL: `https://jtripppiie.github.io/hockey-smash/?fresh=0144`
- Computer Play URL: `https://jtripppiie.github.io/hockey-smash/?computerMode=1`

## v0.14.4 Gameplay QA

### Launch / Layout

1. Open `https://jtripppiie.github.io/hockey-smash/?fresh=0144`.
2. Confirm the top-right badge says `Hockey Smash v0.14.4 · Build 2026-06-29.60`.
3. Confirm the compact splash still fits without obvious scrolling.
4. Click Start Game.
5. Confirm the 10-second countdown appears before hazards begin.

### Staged Flow

1. Confirm Level 1 is focused on falling fish.
2. Confirm Level 2 starts after 5 fish dodges or about 28 seconds.
3. Confirm Level 2 introduces moose and bears as the main ground threats.
4. Confirm teacher/dance instructor/mom/dad do not chase the player.
5. Confirm Alaskan boy/girl cameo is visual only and does not damage, block, or collide.

### Charged Projectiles

1. Tap the action button/key quickly and confirm a fast shot fires.
2. Hold the action button/key and release to fire a charged shot.
3. Confirm charged shots look bigger/brighter.
4. Confirm charged shots arc through the air.
5. Confirm charged shots hit bear/moose harder.
6. Confirm Daniel still fires pucks.
7. Confirm Sofie still throws pointe shoes.
8. Confirm hit feedback and score feedback still appear.

### Falling Fish

1. Confirm salmon/fish rain down from the top of the screen.
2. Confirm falling fish can be dodged by moving out from under them.
3. Confirm `heavyRain` fish fall faster.
4. Confirm `fastRain` fish add quick dodge pressure.
5. Confirm `schoolRain` fish appear wider and hit harder if missed.
6. Confirm missed salmon reduce health.
7. Confirm successful salmon dodges show feedback.

### Power-Ups

1. Defeat bear/moose with projectiles.
2. Confirm a puck-speed power-up can drop sometimes.
3. Skate through the power-up and confirm it is collected.
4. Confirm collecting the power-up does not damage the player.
5. Confirm later shots are boosted/glow while the boost is active.

### Parallax Starter

1. Confirm parallax is not active yet.
2. Confirm parallax preload hooks remain commented until assets exist.
3. Confirm `js/games/hockey-smash-v0115-parallax-starter.js` is documented but not loaded.

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
- The visible badge, package version, cache key, final release layer, README, changelog, workflow docs, QA docs, checklist, progress docs, and beginner handoff guide should all agree on v0.14.4.
- Browser QA still matters because the game uses canvas, DOM overlays, pointer controls, localStorage, sessionStorage, media queries, and requestAnimationFrame loops.
