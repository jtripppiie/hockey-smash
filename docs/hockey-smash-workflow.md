# Hockey Smash Workflow

## Project Overview

Hockey Smash is a static browser canvas game served through GitHub Pages. The current public checkpoint is **Hockey Smash v0.14.4 · Build 2026-06-30.60**.

Fresh cache-bust preview:

```text
https://jtripppiie.github.io/hockey-smash/?fresh=0137
```

Computer Play:

```text
https://jtripppiie.github.io/hockey-smash/?computerMode=1
```

## Current v0.14.4 Behavior Notes

- Splash screen stays compact from v0.13.5.
- Start Game still leads into a 10-second safe practice countdown.
- Salmon/fish now rain down from the top while bears and moose remain fightable ground threats.
- Daniel uses Hockey Smash puck behavior.
- Sofie uses Dance Smash pointe-shoe behavior.
- Holding/releasing action now charges and fires a stronger arcing projectile.
- Tap shooting is faster because projectile cooldown is 180ms.
- `js/games/hockey-smash-v0102.js` owns rain, heavyRain, fastRain, schoolRain fish patterns and combo encounter spawns.
- `js/games/hockey-smash-v0103.js` owns charged projectiles, stronger arc physics, falling-fish dodge rules, and safe power-ups.
- `js/games/hockey-smash-v0114.js` is the final release layer so the visible badge/version stays current after older layers load.

## File Map

- `index.html`: public shell, visible build badge, splash customization controls, HUD, canvas, and script/css loading order.
- `hockey-smash.css`: single CSS manifest loaded by `index.html`; imports all CSS layers with the current cache key.
- `style.css`: compact splash layout, full-screen layout, HUD, canvas scaling, and mobile controls.
- `hockey-smash-custom.css`: compact character selector and player-name input styling.
- `js/games/hockey-smash.js`: original core runtime, state machine, input set, base movement, spawns, collision, rendering, and asset fallbacks.
- `js/games/hockey-smash-v096.js`: smooth movement controller for normal play and Computer Mode.
- `js/games/hockey-smash-v0102.js`: moving encounter pass with falling-fish patterns and combo spawns.
- `js/games/hockey-smash-v0103.js`: charged puck/pointe-shoe projectile layer, salmon dodge rules, and safe power-ups.
- `js/games/hockey-smash-v0104.js`: distance, score, combo, high score, difficulty, floating text, and run summary layer.
- `js/games/hockey-smash-v0106.js`: player customization, Daniel/Sofie mode labels, and character-specific action labels.
- `js/games/hockey-smash-v0109.js`: dev unlock, debug logs, countdown, and legacy sideways-salmon guard.
- `js/games/hockey-smash-v0114.js`: v0.14.4 final release layer.
- `scripts/verify-hockey-smash.js`: static launch/docs/file verifier.
- `docs/hockey-smash-kid-handoff.md`: beginner handoff guide.

## Local Run Command

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080/
```

## Version Update Checklist

When changing visible behavior:

1. Update `index.html` badge and cache keys.
2. Update `hockey-smash.css` cache imports.
3. Update the latest overlay/release layer.
4. Update `package.json`.
5. Update `scripts/verify-hockey-smash.js`.
6. Update README, CHANGELOG, QA, checklist, progress, workflow, and kid handoff docs.
7. Run `npm run verify` and browser QA.

## QA Focus For v0.14.4

- Hold/release action for charged shooting.
- Confirm tap shooting still works quickly.
- Confirm charged shots arc and hit harder.
- Confirm fish rain down from the top.
- Confirm falling fish are dodged by moving out from under them.
- Confirm bears and moose still pressure the player on the ground.
- Confirm power-ups can be collected without damaging the player.
- Confirm Computer Mode still runs.
