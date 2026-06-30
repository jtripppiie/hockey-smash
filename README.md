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
Hockey Smash v0.14.4 · Build 2026-06-29.60
```

Current cache key:

```text
0.14.4-20260629.60
```

## What v0.14.4 Includes

- Keeps the staged flow: fish-dodge level first, then the moose/bear wildlife level.
- Keeps bears slow with final bear-speed tuning.
- Restores Level 2 focus to wildlife by suppressing people/cast entities as hazards.
- Converts Alaskan boy/girl into a harmless sideline cameo instead of spawning them as chasing/damaging entities.
- Keeps the new Alaskan boy/girl sprite assets wired and verified.
- Keeps charged shooting for Daniel's puck and Sofie's pointe shoe.
- Keeps double jump, fish warnings, safe power-ups, score, high score, and Try Again flow.
- Keeps the parallax starter file disabled until exact parallax background-loop assets are added.
- Uses `js/games/hockey-smash-v0114.js` as the final visible release layer so the newest badge wins after older layers boot.

## Recent Stabilization

- **v0.14.4:** cast cleanup; Alaskan boy/girl are harmless sideline cameo visuals, not chase/collision enemies.
- **v0.14.3:** staged fish-dodge opening, slower bear tuning, and final badge/cache-key alignment.
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
9. Salmon/fish should rain down from the top for the fish-dodge level.
10. After enough dodges or roughly 28 seconds, Level 2 introduces moose and bears.
11. The Alaskan boy/girl sideline cameo may appear visually, but it should not chase, collide, damage, or block the player.

## Main Files

- `index.html`: public shell, visible build badge, splash customization controls, HUD, canvas, preload hints, and script/css loading order.
- `hockey-smash.css`: single CSS manifest loaded by `index.html`; imports all CSS layers with the current cache key.
- `style.css`: full-screen layout, compact splash layout, HUD, canvas scaling, and mobile controls.
- `hockey-smash-custom.css`: compact player name and character selector styling.
- `js/games/hockey-smash.js`: original core runtime, state machine, spawns, collision, rendering, and asset fallbacks.
- `js/games/hockey-smash-v096.js`: smooth movement controller, keyboard controls, touch controls, and Computer Mode input bridge.
- `js/games/hockey-smash-v0102.js`: moving encounter layer; owns falling-fish patterns, wildlife threats, and combo encounter spawns.
- `js/games/hockey-smash-v0103.js`: charged projectile layer; owns puck/pointe-shoe charge, arcs, falling-fish dodge rules, and safe power-ups.
- `js/games/hockey-smash-v0104.js`: distance, score, combo, high score, difficulty state, floating text, and run summary layer.
- `js/games/hockey-smash-v0106.js`: player customization layer, Daniel/Sofie mode labels, and final character text updates.
- `js/games/hockey-smash-v0109.js`: safety layer; owns dev unlock, debug button logs, accidental shake lock, 10-second countdown, and legacy sideways-salmon guard.
- `js/games/hockey-smash-v0110.js`: double jump, fish warnings, projectile hits on family/dance encounters, and one-big-animal pressure.
- `js/games/hockey-smash-v0111.js`: progressive encounter pacing.
- `js/games/hockey-smash-v0112.js`: no-shake spotlight boost, slower bears, and Sofie dance cameo support.
- `js/games/hockey-smash-v0113.js`: staged fish-dodge level followed by moose/bear wildlife level; suppresses people/cast entities as hazards.
- `js/games/hockey-smash-v0114.js`: final v0.14.4 release layer, bear-speed tuning, and harmless sideline cameo behavior.
- `js/games/hockey-smash-v0115-parallax-starter.js`: disabled/commented parallax starter and asset instructions.
- `scripts/verify-hockey-smash.js`: static verification for versions, cache keys, docs, files, and key feature markers.
- `docs/hockey-smash-kid-handoff.md`: beginner guide explaining how the code is organized and where to safely change things.

## Parallax Starter Status

Parallax is intentionally **not active** yet. The starter file documents the required assets:

```text
assets/hockey-smash/backgrounds/parallax-midground-loop.webp
assets/hockey-smash/backgrounds/parallax-foreground-loop.webp
```

Both must be `2048x576`, transparent, WebP, and horizontally seamless before the commented preload/script hooks are enabled.

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

- Open `/` and confirm the visible badge says `Hockey Smash v0.14.4 · Build 2026-06-29.60`.
- Confirm the compact splash still fits without obvious scrolling.
- Confirm Start Game enters gameplay and shows the 10-second countdown.
- Hold/release action and confirm charged shots fire.
- Confirm charged shots arc, glow, hit harder, and show stronger feedback.
- Confirm rain, heavyRain, fastRain, and schoolRain fish fall from the top.
- Confirm the first level focuses on falling-fish dodges.
- Confirm Level 2 introduces bears and moose as fightable ground threats.
- Confirm Alaskan boy/girl cameo is visual only and does not chase or damage the player.
- Confirm power-ups can drop from defeated bears/moose and can be collected without damaging the player.
- Open `?computerMode=1` and confirm autoplay still runs through movement, encounters, projectile, score, and customization systems.
