# Hockey Smash Dev Checklist

## Current Checkpoint

- [ ] Confirm visible version says `Hockey Smash v0.14.3 · Build 2026-06-29.59`.
- [ ] Confirm `package.json` version is `0.14.3`.
- [ ] Confirm `index.html` cache keys use `0.14.3-20260629.59`.
- [ ] Confirm `hockey-smash.css` imports CSS layers with `0.14.3-20260629.59`.
- [ ] Confirm `js/games/hockey-smash-v0110.js` is loaded last.
- [ ] Confirm README, CHANGELOG, QA, workflow, checklist, progress, and beginner handoff docs mention v0.14.3.
- [ ] Run `npm run verify`.

## Compact Splash

- [ ] Confirm the splash screen fits without scrolling on a normal desktop browser height.
- [ ] Confirm the splash screen fits without scrolling in a phone-sized portrait viewport when possible.
- [ ] Confirm Start Game is visible without scrolling.

## Start Countdown

- [ ] Click Start Game in normal play.
- [ ] Confirm a 10-second countdown appears.
- [ ] Confirm controls work during the countdown.
- [ ] Confirm hazards begin after the countdown finishes.
- [ ] Confirm `?computerMode=1` skips the normal-play countdown.

## Charged Shooting

- [ ] Tap action quickly and confirm a fast puck/pointe-shoe shot fires.
- [ ] Hold action briefly and release to fire a charged shot.
- [ ] Confirm charged shots are larger/brighter than tap shots.
- [ ] Confirm charged shots arc through the air.
- [ ] Confirm charged shots hit harder than tap shots.
- [ ] Confirm Daniel still fires pucks.
- [ ] Confirm Sofie still throws pointe shoes.
- [ ] Confirm the score/floating feedback still records projectile hits.

## Falling Fish

- [ ] Confirm fish/salmon rain down from the **top**.
- [ ] Confirm `heavyRain` fish fall faster.
- [ ] Confirm `fastRain` fish add quick dodge pressure.
- [ ] Confirm `schoolRain` fish appear wider and show bigger dodge pressure.
- [ ] Confirm missed salmon lowers health.
- [ ] Confirm successful dodges show feedback.

## Power-Ups

- [ ] Defeat bears/moose with projectiles.
- [ ] Confirm a puck-speed power-up can drop sometimes.
- [ ] Confirm skating through the power-up collects it.
- [ ] Confirm the power-up does **not** damage the player.
- [ ] Confirm shots get boosted after collection.

## Computer Play / Watch Mode

- [ ] Open `http://localhost:8080/?computerMode=1`.
- [ ] Confirm Computer Mode starts automatically.
- [ ] Confirm Computer Mode uses movement, encounters, projectile, score, and customization layers.
- [ ] Confirm Computer Mode does not wait through the countdown.

## Documentation / Kid Handoff

- [ ] Confirm code comments explain why charged shots and safe power-ups work the way they do.
- [ ] Confirm the beginner handoff guide explains where to adjust shot/falling-fish/power-up behavior.
- [ ] Confirm the changelog has a v0.14.3 entry.
