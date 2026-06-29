# Hockey Smash Dev Checklist

## Current Checkpoint

- [ ] Confirm visible version says `Hockey Smash v0.13.4 · Build 2026-06-29.50`.
- [ ] Confirm `package.json` version is `0.13.4`.
- [ ] Confirm `index.html` cache keys use `0.13.4-20260629.50`.
- [ ] Confirm `hockey-smash.css` imports CSS layers with `0.13.4-20260629.50`.
- [ ] Confirm README, CHANGELOG, QA, workflow, checklist, progress, and beginner handoff docs are updated when behavior changes.
- [ ] Confirm `scripts/verify-hockey-smash.js` checks the new feature markers.

## Local Run

- [ ] Run the game locally with `python3 -m http.server 8080`.
- [ ] Open `http://localhost:8080/`.
- [ ] Confirm splash screen says `Hockey Smash` by default.
- [ ] Confirm the splash screen shows Start Game, Daniel/Sofie selection, and player name input.
- [ ] Confirm Start Game shows the transition screen.
- [ ] Confirm the game fills the browser viewport.
- [ ] Confirm the page does not scroll during gameplay.

## Splash Customization

- [ ] Confirm the splash screen shows a Daniel/Sofie character selector.
- [ ] Confirm the splash screen shows the player name input.
- [ ] Confirm selecting Daniel uses the normal Hockey Smash splash/player art.
- [ ] Confirm selecting Sofie uses the dancer-player art on the splash screen.
- [ ] Confirm entering a custom name updates the HUD label.
- [ ] Confirm the chosen name/character persist after refresh.
- [ ] Confirm the visible badge settles on `Hockey Smash v0.13.4 · Build 2026-06-29.50` after all scripts load.

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

## Normal Controls

- [ ] Confirm keyboard left/right movement still works smoothly.
- [ ] Confirm keyboard jump still works.
- [ ] Confirm keyboard slide/duck still works.
- [ ] Confirm the action button still works.
- [ ] Confirm Daniel fires/uses hockey puck behavior.
- [ ] Confirm Sofie fires/uses pointe-shoe behavior.
- [ ] Confirm the health bar updates with the chosen player name.
- [ ] Confirm mobile landscape layout works.
- [ ] Confirm the rotate overlay appears temporarily in portrait.

## Touch Control Reliability

- [ ] Confirm D-pad left works as a held touch control.
- [ ] Confirm D-pad right works as a held touch control.
- [ ] Confirm releasing left/right stops the player reliably.
- [ ] Confirm Jump responds from the on-screen `J` button.
- [ ] Confirm Slide responds from the on-screen `S` button.
- [ ] Confirm dragging off a touch button does not leave the player stuck moving.
- [ ] Confirm switching browser tabs or apps resets held input.
- [ ] Confirm `?debug=1` can show useful input/state details.

## Player Name Text

- [ ] Confirm the player overlay label uses the chosen name.
- [ ] Confirm status messages replace Daniel/Sofie with the chosen name.
- [ ] Confirm Mom/Sister bubbles use the chosen name.
- [ ] Confirm Try Again copy uses the chosen name.
- [ ] Confirm Computer Play copy uses the chosen name.

## Puck, Pointe Shoe, And Feedback Polish

- [ ] Confirm Daniel's normal stick action fires the standard puck.
- [ ] Confirm Daniel's slide stick action fires the low blue puck.
- [ ] Confirm Daniel's airborne stick action fires the stronger gold aerial puck.
- [ ] Confirm Sofie's action uses pointe-shoe language and visuals.
- [ ] Confirm projectile hits show floating text.
- [ ] Confirm fish dodges show floating text.
- [ ] Confirm damage shows floating text and resets combo.

## Score And Replay

- [ ] Confirm distance and score appear in the HUD.
- [ ] Confirm distance and score rise during play.
- [ ] Confirm combo feedback appears after skillful actions.
- [ ] Confirm combo resets when the player loses health.
- [ ] Confirm the high score persists after refresh.
- [ ] Confirm accidental canvas shake does not stay stuck after impact.
- [ ] Confirm the Try Again screen shows distance, score, best combo, projectile hits, and fish dodges.

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
