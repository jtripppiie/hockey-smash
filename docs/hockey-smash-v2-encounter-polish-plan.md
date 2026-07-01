# Hockey Smash v2 Encounter Polish Plan

This is the repo-native version of the salmon, wildlife, cameo, and family polish plan.

## Reviewer Take

The main v2 game has a strong foundation, but the game needs clearer skill rewards and sharper encounter identities. Salmon catches should feel scored, friendly cameos should help the player, Dad should be a joke-driven passerby, and bear/moose should not feel like the same obstacle at different sizes.

## Implemented First Pass

- Salmon catches now award points.
- Near-ground airborne catches produce a `PERFECT +25` pop instead of the regular `+10`, giving the salmon run a visible perfect catch bonus.
- Quick repeat catches build a short salmon combo streak for bonus points and HUD/readout feedback.
- Alaska kid cameos give a short player speed boost when the player gets close.
- Dad now spawns as a mower joke encounter with contact damage, a full one-line joke, and a subtle mower-style bob.
- Bear stays grounded and walks only; rise/charge behavior is saved for future development.
- Moose moves slower, has more health, and occasionally pauses to graze.
- Bear and moose render from available walk frames; eagle now uses one steady image so it does not flap.
- Incoming Dad, bear, moose, and eagle encounters now get short visual warning callouts.

## Architecture Direction

Keep the harness behavior measurable, then migrate reusable systems out of `/` into world/system helpers once the feel is approved.

Good candidates for the next extraction:

- `updateEncounterBehavior`
- `maybeApplyCameoBoost`
- salmon scoring/perfect-catch calculation
- encounter spawn table and Dad joke data

## Next Review Targets

- Add a real Dad lawn mower asset or placeholder with exact dimensions.
- Give Teacher a dedicated asset and separate role from Sofie's dance instructor.
- Add future bear rise/charge behavior only after the walk pass feels right.
- Add wildlife warning markers before future charge/graze beats.
- Add audio feedback for perfect catch, boost, future charge, and player damage.
