# Hockey Smash Dev Checklist

## Current Checkpoint

- [ ] Confirm visible version says `Hockey Smash v0.13.5 · Build 2026-06-29.51`.
- [ ] Confirm `package.json` version is `0.13.5`.
- [ ] Confirm `index.html` cache keys use `0.13.5-20260629.51`.
- [ ] Confirm `hockey-smash.css` imports CSS layers with `0.13.5-20260629.51`.
- [ ] Confirm README, CHANGELOG, QA, workflow, checklist, progress, and beginner handoff docs are updated when behavior changes.
- [ ] Confirm `scripts/verify-hockey-smash.js` checks the new feature markers.

## Compact Splash

- [ ] Confirm the splash screen fits without scrolling on a normal desktop browser height.
- [ ] Confirm the splash screen fits without scrolling in a phone-sized portrait viewport when possible.
- [ ] Confirm the hero image is smaller than the earlier oversized version.
- [ ] Confirm the Hockey Smash title is smaller but still readable.
- [ ] Confirm the tagline and copy are still visible.
- [ ] Confirm the Daniel/Sofie buttons are still visible and tappable.
- [ ] Confirm the player name input is still visible and usable.
- [ ] Confirm Start Game is visible without scrolling.
- [ ] Confirm the note below Start Game is still visible or at least does not push Start Game below the fold.

## Local Run

- [ ] Run the game locally with `python3 -m http.server 8080`.
- [ ] Open `http://localhost:8080/`.
- [ ] Confirm splash screen says `Hockey Smash` by default.
- [ ] Confirm the splash screen shows Start Game, Daniel/Sofie selection, and player name input.
- [ ] Confirm Start Game shows the transition screen.
- [ ] Confirm the game fills the browser viewport.
- [ ] Confirm the page does not scroll during gameplay.

## Start Countdown

- [ ] Click Start Game in normal play.
- [ ] Confirm the gameplay screen appears before hazards begin.
- [ ] Confirm a 10-second countdown appears.
- [ ] Confirm the countdown says players can practice the buttons.
- [ ] Confirm left/right movement works during the countdown.
- [ ] Confirm jump works during the countdown.
- [ ] Confirm slide/duck works during the countdown.
- [ ] Confirm the action button works during the countdown.
- [ ] Confirm salmon, bear, moose, Mom, Sister, Dad jokes, and Dad boss do not attack during the countdown.
- [ ] Confirm hazards begin after the countdown finishes.
- [ ] Confirm `?computerMode=1` skips the normal-play countdown.

## Gameplay Encounters

- [ ] Confirm fish/salmon fly in from the **right side only**.
- [ ] Confirm fish can be avoided by jumping.
- [ ] Confirm fish can be avoided by sliding/ducking.
- [ ] Confirm missed fish lowers health.
- [ ] Confirm bears move toward the player.
- [ ] Confirm moose move toward the player.
- [ ] Confirm bear/moose obstacles can be cleared during play.
- [ ] Confirm Mom can appear with a speech bubble.
- [ ] Confirm Sister can appear with a speech bubble/spin moment.
- [ ] Confirm Try Again appears when health runs out.
- [ ] Confirm encounter pace increases during a longer run.

## Hidden Dev Mode

- [ ] Confirm Watch Computer Play is hidden on the normal splash screen.
- [ ] Confirm the debug boot log is hidden for normal players.
- [ ] Triple-tap/click the splash image within about 1.5 seconds.
- [ ] Confirm Watch Computer Play appears.
- [ ] Confirm the debug boot log appears.
- [ ] Confirm `?debug=1`, `?dev=1`, and `?computerMode=1` auto-enable dev mode.

## Computer Play / Watch Mode

- [ ] Open `http://localhost:8080/?computerMode=1`.
- [ ] Confirm Computer Mode starts automatically.
- [ ] Confirm Computer Mode cycles through right, left, jump, slide, and action phases.
- [ ] Confirm Computer Mode uses the smooth movement controller.
- [ ] Confirm Computer Mode uses the moving encounter pass.
- [ ] Confirm Computer Mode uses the projectile, score, and customization layers.
- [ ] Confirm Computer Mode skips the 10-second normal-play countdown.
- [ ] Confirm the difference between normal mode and Computer Mode is the driver, not a separate gameplay path.

## Documentation / Kid Handoff

- [ ] Confirm new code has plain-English comments near the logic it explains.
- [ ] Confirm the README tells a new helper where the main files are.
- [ ] Confirm `docs/hockey-smash-kid-handoff.md` explains the layered JavaScript setup.
- [ ] Confirm new behavior has a changelog entry.
- [ ] Confirm QA docs include a manual check for the new behavior.

## Verification

- [ ] Run `npm run verify`.
- [ ] Run browser automation if Playwright is installed: `npm run test:browser`.
- [ ] Check the browser console for runtime errors.
