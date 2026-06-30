# Hockey Smash

Current playable version: **Hockey Smash v0.14.4**

Live GitHub Pages preview:

```text
https://jtripppiie.github.io/hockey-smash/?fresh=0144
```

Normal clean URL:

```text
https://jtripppiie.github.io/hockey-smash/
```

Computer Play / Watch Mode:

```text
https://jtripppiie.github.io/hockey-smash/?computerMode=1
```

## Current Status

Hockey Smash is the primary public playable mode in this repo. It is a static GitHub Pages canvas game with local WebP assets, fullscreen support, mobile controls, player name customization, Daniel/Sofie character selection, compact splash layout, 10-second practice countdown, raining fish hazards, charged puck/pointe-shoe shooting, bear/moose combat encounters, combo encounter spawns, safe power-ups, score, distance, combo streaks, high-score persistence, floating feedback, Try Again flow, dev-only Computer Play, and a hidden debug unlock.

## Latest Visible Build

The top-right badge should read:

```text
Hockey Smash v0.14.4 · Build 2026-06-30.60
```

Current cache key:

```text
0.14.4-20260630.60
```

## What v0.14.4 Includes

- Makes salmon/fish rain down from the top of the screen instead of entering sideways.
- Adds rain, heavyRain, fastRain, and schoolRain falling-fish variants.
- Starts normal runs with a fish-dodge level before ramping into the moose/bear wildlife level.
- Keeps bears and moose as fightable ground threats after the opening fish stage.
- Adds charged shooting for Daniel's puck and Sofie's pointe shoe.
- Action key/button now charges on hold and fires on release.
- Faster 180ms projectile cooldown for more responsive tap shooting.
- Stronger charged shots with a longer 720ms charge window, bigger projectile visuals, stronger hit text, more damage, and arcing physics.
- Adds safe power-ups that drop from defeated bears/moose without entering the core hazard collision system.
- Adds double jump, slower early pacing, Sofie dance cameo support, staged fish/wildlife progression, and final bear-speed tuning.
- Uses `js/games/hockey-smash-release.js` as the final visible release layer so the newest badge wins after older layers boot.
- Adds a dev-only Spawn Cast shortcut for quickly QAing Daniel/Sofie cast encounters.
- Makes Space fire the desktop action shot instead of jumping.

## Recent Stabilization

- **v0.14.4:** Space fires on desktop, dev cast-spawn shortcut, cast encounter QA support, cleanup of unused local layers, and final badge/cache-key alignment.
- **v0.14.2:** fish-dodge level first, then moose/bear wildlife level.
- **v0.14.1:** removed earthquake shake, slowed bears, and added Sofie dance cameo support.
- **v0.14.0:** progressive pacing for wildlife and people encounters.
- **v0.13.9:** fish warnings, family projectile hits, one-big-animal pressure, and double jump.
- **v0.13.7:** fish rain down from the top while bear/moose combat remains on the ground.
- **v0.13.6:** charged shots, stronger projectile physics, salmon patterns, combo spawns, and safe power-ups.
- **v0.13.5:** compact no-scroll splash layout.
- **v0.13.4:** 10-second practice countdown and right-side-only fish/salmon guard.
- **v0.13.3:** Normal players see only Start Game; Watch Computer Play and debug log are dev-only; triple-tap the splash image to unlock dev mode.
- **v0.13.2:** Sofie mode became Dance Smash with pointe-shoe projectile behavior.

## Controls

Keyboard:

- Move left: `ArrowLeft` or `A`
- Move right: `ArrowRight` or `D`
- Jump: `ArrowUp`, `W`, or `J`
- Slide / duck: `Shift` or `S`
- Action: hold/release `Space`, `F`, or `Enter`
  - Tap quickly for a fast shot.
  - Hold briefly to charge a stronger arcing shot.
  - Daniel fires pucks.
  - Sofie throws pointe shoes.

Touch:

- Bottom-left D-pad: hold left/right movement.
- Bottom-right buttons: `J` for jump, `S` for slide/duck, and the character action button.
- Hold/release the action button to charge and fire.
- Fullscreen button is available inside the gameplay screen.

## Normal Play Start Flow

1. Pick Daniel or Sofie.
2. Enter a player name if desired.
3. Click **Start Game**.
4. The transition screen appears briefly.
5. The gameplay screen opens.
6. A 10-second countdown starts.
7. During the countdown, practice moving, jumping, sliding, and charging/firing.
8. When the countdown finishes, hazards begin.
9. Salmon/fish should rain down from the top for the fish-dodge level.
10. After enough dodges or roughly 28 seconds, Level 2 introduces moose and bears.

## Main Files

- `index.html`: public shell, visible build badge, splash customization controls, HUD, canvas, and script/css loading order.
- `hockey-smash.css`: single CSS manifest loaded by `index.html`; imports all CSS layers with the current cache key.
- `style.css`: full-screen layout, compact splash layout, HUD, canvas scaling, and mobile controls.
- `hockey-smash-custom.css`: compact player name and character selector styling.
- `js/games/hockey-smash.js`: original core runtime, state machine, spawns, collision, rendering, and asset fallbacks.
- `js/games/hockey-smash-input.js`: smooth movement controller, keyboard controls, touch controls, and Computer Mode input bridge.
- `js/games/hockey-smash-encounters.js`: moving encounter layer; owns falling-fish patterns, wildlife threats, and combo encounter spawns.
- `js/games/hockey-smash-projectiles.js`: charged projectile layer; owns puck/pointe-shoe charge, arcs, falling-fish dodge rules, and safe power-ups.
- `js/games/hockey-smash-score.js`: distance, score, combo, high score, difficulty state, floating text, and run summary layer.
- `js/games/hockey-smash-characters.js`: player customization layer, Daniel/Sofie mode labels, and final character text updates.
- `js/games/hockey-smash-safety.js`: safety layer; owns dev unlock, debug button logs, accidental shake lock, 10-second countdown, and legacy sideways-salmon guard.
- `js/games/hockey-smash-family-combat.js`: double jump, fish warnings, projectile hits on family/dance encounters, and one-big-animal pressure.
- `js/games/hockey-smash-pacing.js`: progressive encounter pacing.
- `js/games/hockey-smash-spotlight.js`: no-shake spotlight boost, slower bears, and Sofie dance cameo support.
- `js/games/hockey-smash-stage-flow.js`: staged fish-dodge level followed by moose/bear wildlife level.
- `js/games/hockey-smash-release.js`: final v0.14.4 release layer and bear-speed tuning.
- `scripts/verify-hockey-smash.js`: static verification for versions, cache keys, docs, files, and key feature markers.
- `docs/hockey-smash-kid-handoff.md`: beginner guide explaining how the code is organized and where to safely change things.

## How To Run Locally

No build step is required.

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

Computer Mode:

```text
http://localhost:8080/?computerMode=1
```

## Verification

Run:

```bash
npm run verify
```

Optional browser automation:

```bash
npm install
npm run test:browser:install
npm run test:browser
```

Manual smoke checks before calling this checkpoint good:

- Open `/` and confirm the visible badge says `Hockey Smash v0.14.4 · Build 2026-06-30.60`.
- Confirm the compact splash still fits without obvious scrolling.
- Confirm Start Game enters gameplay and shows the 10-second countdown.
- Hold/release action and confirm charged shots fire.
- Confirm charged shots arc, glow, hit harder, and show stronger feedback.
- Confirm rain, heavyRain, fastRain, and schoolRain fish fall from the top.
- Confirm the first level focuses on falling-fish dodges.
- Confirm Level 2 introduces bears and moose as fightable ground threats.
- Confirm power-ups can drop from defeated bears/moose and can be collected without damaging the player.
- Open `?computerMode=1` and confirm autoplay still runs through movement, encounters, projectile, score, and customization systems.
