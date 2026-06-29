# Hockey Smash Workflow

## Project Overview

Hockey Smash is a static browser canvas game served through GitHub Pages. The current public checkpoint is **Hockey Smash v0.13.5 · Build 2026-06-29.51**.

The game is intentionally static:

- No backend.
- No accounts.
- No build step required to play locally.
- Vanilla HTML, CSS, and JavaScript.
- Local sprite/background assets.

## Current Public URLs

Normal play:

```text
https://jtripppiie.github.io/hockey-smash/
```

Fresh cache-bust preview:

```text
https://jtripppiie.github.io/hockey-smash/?fresh=0135
```

Computer Play / Watch Mode:

```text
https://jtripppiie.github.io/hockey-smash/?computerMode=1
```

Debug Computer Play:

```text
https://jtripppiie.github.io/hockey-smash/?computerMode=1&debug=1
```

## File Map

- `index.html`: public Hockey Smash shell, visible build badge, splash customization controls, controls, HUD, canvas, and script/css loading order.
- `hockey-smash.css`: single CSS manifest loaded by `index.html`; imports all CSS layers with the current cache key.
- `style.css`: compact splash layout, full-screen layout, HUD, canvas scaling, and mobile controls.
- `hockey-smash-custom.css`: compact character selector and player-name input styling.
- `hockey-smash-touch.css`: touch-control reliability and pressed-button visual feedback.
- `js/games/hockey-smash.js`: original core runtime, state machine, input set, base movement, spawns, collision, rendering, and asset fallbacks.
- `js/games/hockey-smash-v096.js`: smooth movement controller for normal play and Computer Mode.
- `js/games/hockey-smash-v0102.js`: moving gameplay encounter pass.
- `js/games/hockey-smash-v0103.js`: Daniel puck and Sofie pointe-shoe projectile layer.
- `js/games/hockey-smash-v0104.js`: distance, score, combo, high score, difficulty, floating text, and run summary layer.
- `js/games/hockey-smash-v0106.js`: player customization, Daniel/Sofie mode labels, and character-specific action labels.
- `js/games/hockey-smash-v0109.js`: final safety/release layer; owns dev unlock, debug button logs, accidental shake lock, 10-second countdown, and right-side-only salmon guard.
- `scripts/verify-hockey-smash.js`: static launch/docs/file verifier.
- `scripts/verify-hockey-smash-actions.js`: non-browser action verifier for core movement and stick behavior.
- `docs/hockey-smash-qa.md`: manual QA routes.
- `docs/hockey-smash-dev-checklist.md`: short checkpoint checklist.
- `docs/hockey-smash-kid-handoff.md`: beginner handoff guide.

## Local Run Command

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080/
```

Computer Play locally:

```text
http://localhost:8080/?computerMode=1
```

## Version Update Checklist

When changing visible behavior:

1. Update the visible badge in `index.html`.
2. Update cache keys in `index.html`.
3. Update `hockey-smash.css` cache imports.
4. Update the latest overlay script version/build labels, especially the file loaded last.
5. Update `package.json` if the project package version changes.
6. Update `scripts/verify-hockey-smash.js` so stale versions fail verification.
7. Update `README.md`.
8. Update `CHANGELOG.md`.
9. Update `docs/hockey-smash-qa.md`.
10. Update `docs/hockey-smash-dev-checklist.md`.
11. Update `docs/hockey-smash-kid-handoff.md` if file responsibilities or safe-edit guidance changed.
12. Update this workflow file if file responsibilities or QA expectations changed.
13. Update `docs/hockey-smash-progress.md` when the change is a major checkpoint or needs long-term history.

## Current v0.13.5 Behavior Notes

- The splash screen uses a compact splash layout so players should not need to scroll to see the image, title, text, customization controls, Start Game button, and note.
- `style.css` owns the main compact splash sizing: smaller hero image, title, copy, gaps, button height, and short-screen/portrait rules.
- `hockey-smash-custom.css` owns compact character button and player-name input sizing.
- Normal play starts with splash customization, then a transition screen, then gameplay.
- After gameplay appears, a 10-second countdown gives the player time to practice controls.
- During the countdown, the player can move, jump, slide, and attack, but hazards are removed or held back.
- After the countdown, normal hazards begin.
- Salmon/fish should come from the right side only.
- Daniel mode is **Hockey Smash** and uses hockey puck/stick language.
- Sofie mode is **Dance Smash** and uses pointe-shoe language/projectiles.
- Normal players should not see Watch Computer Play or the debug log.
- Triple-tapping the splash image unlocks dev mode.
- `?debug=1`, `?dev=1`, and `?computerMode=1` auto-enable dev mode.
- Computer Mode skips the 10-second practice countdown so testing starts quickly.

## Splash Layout Tuning Locations

Use these files for splash-size changes:

- `style.css`: `.hockey-splash`, `.hockey-splash__content`, `.hockey-splash__hero`, `.hockey-splash h1`, `.hockey-splash__tagline`, `.hockey-splash__copy`, `.hockey-button`, and short-screen/portrait media queries.
- `hockey-smash-custom.css`: `.hockey-character-select`, `.hockey-name-input-group`, `.hockey-character-button`, and `#player-name`.

## Computer Mode Rule

Computer Mode is useful only if it exercises the same gameplay systems as normal play. Do not add future gameplay only to Computer Mode or only to normal play unless the difference is intentional and documented.

Before calling Computer Mode good, check:

1. Smooth movement is active.
2. Moving encounters are active.
3. Fish dodge rules are active.
4. Puck/pointe-shoe action is active.
5. Try Again still appears when health reaches zero.
6. Computer Mode starts quickly and does not wait through the 10-second normal-play countdown.

## Updating Docs

Update these when behavior changes:

- `README.md`
- `CHANGELOG.md`
- `docs/hockey-smash-qa.md`
- `docs/hockey-smash-dev-checklist.md`
- `docs/hockey-smash-workflow.md`
- `docs/hockey-smash-kid-handoff.md`
- `docs/hockey-smash-progress.md` when the change is a major checkpoint or needs long-term history.
