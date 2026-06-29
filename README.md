# Hockey Smash

Current playable version: **Hockey Smash v0.13.6**

Live GitHub Pages preview:

```text
https://jtripppiie.github.io/hockey-smash/?fresh=0136
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

Hockey Smash is the primary public playable mode in this repo. It is a static GitHub Pages canvas game with local WebP assets, fullscreen support, mobile controls, player name customization, Daniel/Sofie character selection, compact splash layout, 10-second practice countdown, right-side-only salmon, charged puck/pointe-shoe shooting, high/low/school salmon patterns, combo encounter spawns, safe puck-speed power-ups, score, distance, combo streaks, high-score persistence, floating feedback, Try Again flow, dev-only Computer Play, and a hidden debug unlock.

## Latest Visible Build

The top-right badge should read:

```text
Hockey Smash v0.13.6 · Build 2026-06-29.52
```

Current cache key:

```text
0.13.6-20260629.52
```

## What v0.13.6 Includes

- Adds charged shooting for Daniel's puck and Sofie's pointe shoe.
- Action key/button now charges on hold and fires on release.
- Faster 180ms projectile cooldown for more responsive tap shooting.
- Stronger charged shots with a longer 720ms charge window, bigger projectile visuals, stronger hit text, more damage, and arcing physics.
- Adds explicit salmon patterns: normal, highArc, low, school, and fast variants.
- HighArc salmon require a higher jump; low salmon require sliding; school salmon are wider and hit harder if missed.
- Adds combo encounter spawns so a second object can follow shortly after the first one as difficulty rises.
- Adds safe puck-speed power-ups that drop from defeated bears/moose without entering the core hazard collision system.
- Adds `js/games/hockey-smash-v0110.js` as a tiny final release marker so the newest visible badge wins after older layers boot.

## Recent v0.13.x Stabilization

- **v0.13.6:** charged shots, stronger projectile physics, salmon patterns, combo spawns, and safe power-ups.
- **v0.13.5:** compact no-scroll splash layout.
- **v0.13.4:** 10-second practice countdown and right-side-only fish/salmon guard.
- **v0.13.3:** Normal players see only Start Game; Watch Computer Play and debug log are dev-only; triple-tap the splash image to unlock dev mode.
- **v0.13.2:** Sofie mode became Dance Smash with pointe-shoe projectile behavior.

## Controls

Keyboard:

- Move left: `ArrowLeft` or `A`
- Move right: `ArrowRight` or `D`
- Jump: `ArrowUp`, `W`, or `Space`
- Slide / duck: `Shift` or `S`
- Action: hold/release `F` or `Enter`
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
9. Salmon/fish should enter from the right side only.

## Main Files

- `index.html`: public shell, visible build badge, splash customization controls, HUD, canvas, and script/css loading order.
- `hockey-smash.css`: single CSS manifest loaded by `index.html`; imports all CSS layers with the current cache key.
- `style.css`: full-screen layout, compact splash layout, HUD, canvas scaling, and mobile controls.
- `hockey-smash-custom.css`: compact player name and character selector styling.
- `js/games/hockey-smash.js`: original core runtime, state machine, spawns, collision, rendering, and asset fallbacks.
- `js/games/hockey-smash-v096.js`: smooth movement controller, keyboard controls, touch controls, and Computer Mode input bridge.
- `js/games/hockey-smash-v0102.js`: moving encounter layer; owns highArc/low/school salmon and combo encounter spawns.
- `js/games/hockey-smash-v0103.js`: charged projectile layer; owns puck/pointe-shoe charge, arcs, dodge rules, and safe puck-speed power-ups.
- `js/games/hockey-smash-v0104.js`: distance, score, combo, high score, difficulty state, floating text, and run summary layer.
- `js/games/hockey-smash-v0106.js`: player customization layer, Daniel/Sofie mode labels, and final character text updates.
- `js/games/hockey-smash-v0109.js`: final safety/release layer; owns dev unlock, debug button logs, accidental shake lock, 10-second countdown, and right-side-only salmon guard.
- `js/games/hockey-smash-v0110.js`: final v0.13.6 release marker so the current badge/version wins after older layers load.
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

- Open `/` and confirm the visible badge says `Hockey Smash v0.13.6 · Build 2026-06-29.52`.
- Confirm the compact splash still fits without obvious scrolling.
- Confirm Start Game enters gameplay and shows the 10-second countdown.
- Hold/release action and confirm charged shots fire.
- Confirm charged shots arc, glow, hit harder, and show stronger feedback.
- Confirm highArc, low, and school salmon appear.
- Confirm highArc salmon require a higher jump and low salmon require sliding.
- Confirm salmon/fish come from the right side only.
- Confirm power-ups can drop from defeated bears/moose and can be collected without damaging the player.
- Open `?computerMode=1` and confirm autoplay still runs through movement, encounters, projectile, score, and customization systems.
