# Hockey Smash

Current playable version: **Hockey Smash v0.9.1**

Live GitHub Pages preview:

```text
https://jtripppiie.github.io/hockey-smash/
```

## Current Status

Hockey Smash is now the primary public playable mode in this repo. The project uses static GitHub Pages infrastructure, a canvas runtime, local assets, mobile controls, fullscreen support, continuous road progression, and verification scripts centered on Hockey Smash.

## Latest Visible Build

The top-right badge should read:

```text
Hockey Smash v0.9.1 · Build 2026-06-29.12
```

Use that badge to confirm GitHub Pages is serving the latest checkpoint.

## What v0.9.1 Includes

- v0.9.0 character overlay, fullscreen, jump, and mobile-scale milestone.
- Computer Play duplicate-player guard: Computer Play hides the DOM Daniel overlay so the canvas-controlled Daniel is not doubled.
- Continuous road progression: when Daniel reaches the right edge, he advances to the next road section/background and re-enters from the left.
- Five road sections mapped to the existing Soldotna background progression.
- Left-edge backtracking between road sections.
- Final road looping so the player is no longer hard-stopped at the first screen.

## Core v0.9 Features

- Play button, Watch Computer Play button, and Fullscreen button.
- Fullscreen support for mobile so browser bars can be hidden where the browser allows it.
- Daniel as a visible DOM overlay synced to the live player state.
- Smaller Daniel scaling on compact phone layouts.
- Visible jump impulse for the mobile `J` button.
- Direct D-pad movement fallback for touch/click controls.
- DOM character overlays synced to the live game state for salmon/fish, bears, moose, Mom, Sister, Dad, and Dad jokes.
- Bears and moose as stick-clearable obstacles.
- Salmon hazards and major salmon run sequence.
- Mom/Sister interruption bubbles.
- Dad boss and Dad joke attacks.
- Mobile portrait layout compaction.
- Mobile landscape-phone layout overrides through `hockey-smash-v09.css`.
- Debug overlay hidden by default and available through `?computerMode=1&debug=1`.

## How To Run Locally

No build step is required.

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

## Controls

Keyboard:

- Move left: `ArrowLeft` or `A`
- Move right: `ArrowRight` or `D`
- Jump: `ArrowUp`, `W`, or `Space`
- Slide/speed boost: `Shift` or `S`
- Hockey stick: `F` or `Enter`

Touch:

- Bottom-left D-pad: left/right movement.
- Bottom-right buttons: `J` for jump, `S` for slide, hockey stick for attack.
- Fullscreen button: requests fullscreen for the game shell when supported by the mobile browser.

## Computer Play / Watch Mode

Open the game with:

```text
http://localhost:8080/?computerMode=1
```

Computer Play is treated as a player-facing watch/autoplay mode. It starts the game and cycles through movement, jump, slide, and stick actions so the game can be watched without manual input. In v0.9.1, the DOM Daniel overlay is hidden during Computer Play to avoid duplicate player sprites.

For diagnostics, use:

```text
http://localhost:8080/?computerMode=1&debug=1
```

## Main Files

- `index.html`: Hockey Smash public shell.
- `style.css`: full-screen layout, splash, HUD, canvas scaling, and mobile controls.
- `hockey-smash-polish.css`: normal-mode presentation polish, player overlay, debug hiding, portrait mobile layout, and victory overlay styles.
- `hockey-smash-v09.css`: v0.9 fullscreen, entity overlay, and landscape-phone layout overrides.
- `script.js`: app bootstrap.
- `js/games/hockey-smash.js`: Hockey Smash runtime, state machine, player movement, hazards, Dad boss, rendering, and asset fallbacks.
- `js/games/hockey-smash-polish.js`: player-facing polish layer, fullscreen handling, D-pad fallback, jump fallback, visible player overlay, and entity overlays.
- `js/games/hockey-smash-v091.js`: v0.9.1 road-section progression and Computer Play duplicate-player guard.
- `assets/`: expected Hockey Smash sprite/background files.

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
