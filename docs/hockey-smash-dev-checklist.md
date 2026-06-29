# Hockey Smash Dev Checklist

## Current Checkpoint

- [ ] Confirm visible version says `Hockey Smash v0.12.3 · Build 2026-06-29.38`.
- [ ] Confirm `package.json` version is `0.12.3`.
- [ ] Confirm `index.html` cache keys use `0.12.3-20260629.38`.
- [ ] Confirm `hockey-smash-touch.css` and `hockey-smash-custom.css` are linked and cache-busted.
- [ ] Confirm README, CHANGELOG, QA, workflow, and checklist docs are updated when behavior changes.

## Local Run

- [ ] Run the game locally with `python3 -m http.server 8080`.
- [ ] Open `http://localhost:8080/`.
- [ ] Confirm splash screen says `Hockey Slash 2` by default.
- [ ] Confirm Play starts the transition screen.
- [ ] Confirm the game fills the browser viewport.
- [ ] Confirm the page does not scroll during gameplay.

## Splash Customization

- [ ] Confirm the splash screen shows a Daniel/Sofie character selector.
- [ ] Confirm the splash screen shows the player name input.
- [ ] Confirm selecting Daniel uses the normal Hockey Smash splash/player art.
- [ ] Confirm selecting Sofie uses the dancer-player art on the splash screen.
- [ ] Confirm entering a custom name updates the HUD label.
- [ ] Confirm the chosen name/character persist after refresh.
- [ ] Confirm the visible badge settles on `Hockey Smash v0.12.3 · Build 2026-06-29.38` after all scripts load.

## Normal Controls

- [ ] Confirm keyboard left/right movement still works smoothly.
- [ ] Confirm keyboard jump still works.
- [ ] Confirm keyboard slide/duck still works.
- [ ] Confirm the stick button still works.
- [ ] Confirm the puck visual appears from stick input.
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
- [ ] Confirm `?debug=1` can show `Input L/R/J/Axis/VX` details.

## Player Name Text

- [ ] Confirm the player overlay label uses the chosen name.
- [ ] Confirm status messages replace Daniel/Sofie with the chosen name.
- [ ] Confirm Mom/Sister bubbles use the chosen name.
- [ ] Confirm Try Again copy uses the chosen name.
- [ ] Confirm Computer Play copy uses the chosen name.

## Puck And Feedback Polish

- [ ] Confirm a normal stick action fires the standard puck.
- [ ] Confirm a slide stick action fires the low blue puck.
- [ ] Confirm an airborne stick action fires the stronger gold aerial puck.
- [ ] Confirm puck hits show floating text.
- [ ] Confirm fish dodges show floating text.
- [ ] Confirm damage shows floating text and resets combo.

## Score And Replay

- [ ] Confirm distance and score appear in the HUD.
- [ ] Confirm distance and score rise during play.
- [ ] Confirm combo feedback appears after skillful actions.
- [ ] Confirm combo resets when the player loses health.
- [ ] Confirm the high score persists after refresh.
- [ ] Confirm the canvas briefly shakes during impact feedback.
- [ ] Confirm the Try Again screen shows distance, score, best combo, puck hits, and fish dodges.

## Gameplay Encounters

- [ ] Confirm fish/salmon fly across the screen.
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

## Computer Play / Watch Mode

- [ ] Open `http://localhost:8080/?computerMode=1`.
- [ ] Confirm Computer Mode starts automatically.
- [ ] Confirm Computer Mode cycles through right, left, jump, slide, and stick phases.
- [ ] Confirm Computer Mode uses the smooth movement controller.
- [ ] Confirm Computer Mode uses the moving encounter pass.
- [ ] Confirm Computer Mode uses the puck, score, and customization layers.
- [ ] Confirm the difference between normal mode and Computer Mode is the driver, not a separate gameplay path.

## Verification

- [ ] Run `npm run verify`.
- [ ] Run browser automation if Playwright is installed: `npm run test:browser`.
- [ ] Check the browser console for runtime errors.
