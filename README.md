# Hockey Smash

Current playable version: **Hockey Smash v0.12.3**

Live GitHub Pages preview:

```text
https://jtripppiie.github.io/hockey-smash/
```

Computer Play / Watch Mode:

```text
https://jtripppiie.github.io/hockey-smash/?computerMode=1
```

## Current Status

Hockey Smash is the primary public playable mode in this repo. It is a static GitHub Pages canvas game with local WebP assets, fullscreen support, mobile controls, player name customization, Daniel/Sofie character selection, continuous road progression, smooth side-scroller movement, moving wildlife/family/fish encounters, puck gameplay, score, distance, combo streaks, high-score persistence, floating feedback, end-of-run summaries, health, and Try Again flow.

## Latest Visible Build

The top-right badge should read:

```text
Hockey Smash v0.12.3 · Build 2026-06-29.38
```

Use that badge to confirm GitHub Pages is serving the latest checkpoint. The package version is also `0.12.3`.

## What v0.12.3 Includes

- Adds splash-screen player customization.
- Adds a player name input with a 12-character limit.
- Adds a character selector for Daniel and Sofie the Dancer.
- Uses `dancer-player.webp` for Sofie and `sister-spinning.webp` for her slide/spin state.
- Adds `hockey-smash-custom.css` for the name and character controls.
- Adds `js/games/hockey-smash-v0106.js` as the loaded-last customization layer.
- Exposes `setPlayerConfig()` and `getPlayerConfig()` on `window.RTA_HOCKEY_SMASH`.
- Persists the chosen character/name in `localStorage`.
- Updates splash hero art, HUD name, player overlay label, overlay sprite, Try Again text, Computer Play copy, status messages, and text bubbles.
- Current cache key: `0.12.3-20260629.38`.

## Core Gameplay Already Included

- Smooth left/right movement through the newer movement controller in `js/games/hockey-smash-v096.js`.
- Jump buffer, coyote-time forgiveness, early-release jump cut-off, and timed slide/crouch state.
- Computer Mode feeds its autoplay phases into that same smooth movement controller instead of skipping it.
- Moving encounter pass in `js/games/hockey-smash-v0102.js` runs in normal play and Computer Mode.
- Fish/salmon fly across the road and require a duck/slide or jump dodge.
- Bears and moose move toward the player and can be cleared with the stick/puck gameplay.
- Mom and Sister can enter as moving interruptions with speech bubbles that use the chosen player name.
- Hockey puck layer in `js/games/hockey-smash-v0103.js` launches normal, slide, and aerial pucks from stick input.
- `js/games/hockey-smash-v0104.js` handles distance, score, combo, high score, difficulty state, screen shake, floating text, and run summary.
- Try Again flow appears when the player's health reaches zero.

## Controls

Keyboard:

- Move left: `ArrowLeft` or `A`
- Move right: `ArrowRight` or `D`
- Jump: `ArrowUp`, `W`, or `Space`
- Slide / duck: `Shift` or `S`
- Hockey stick and puck action: `F` or `Enter`

Touch:

- Bottom-left D-pad: hold left/right movement.
- Bottom-right buttons: `J` for jump, `S` for slide/duck, hockey stick for stick/puck action.
- Fullscreen button: requests fullscreen for the game shell when supported by the mobile browser.

## Computer Play / Watch Mode

Open the game with:

```text
http://localhost:8080/?computerMode=1
```

Computer Play starts the game automatically and cycles through right, left, jump, slide, and stick actions. As of v0.12.3, it uses the same movement, moving encounter, puck, score, distance, combo, high-score, floating-feedback, run-summary, customization, and difficulty-ramp layers as normal play. The difference should be the driver: a human controls normal mode, and the computer controls Watch Mode.

For diagnostics, use:

```text
http://localhost:8080/?computerMode=1&debug=1
```

The debug overlay can show movement input flags from the touch/keyboard controller.

## How To Run Locally

No build step is required.

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

## Main Files

- `index.html`: Hockey Smash public shell, visible build badge, splash customization controls, HUD, and script/css loading order.
- `style.css`: full-screen layout, splash, HUD, canvas scaling, and mobile controls.
- `hockey-smash-polish.css`: presentation polish, player overlay, debug hiding, portrait mobile layout, and victory overlay styles.
- `hockey-smash-touch.css`: touch-control reliability and pressed-button visual feedback.
- `hockey-smash-custom.css`: player name and character selector styling.
- `hockey-smash-v09.css`: fullscreen, entity overlay, and landscape-phone layout overrides.
- `hockey-smash-v094.css`, `hockey-smash-v095.css`, `hockey-smash-v0111.css`: later layout and HUD polish layers.
- `script.js`: app bootstrap.
- `js/games/hockey-smash.js`: original core runtime, state machine, spawns, collision, rendering, and asset fallbacks.
- `js/games/hockey-smash-polish.js`: polish layer, fullscreen handling, and legacy D-pad helper behavior.
- `js/games/hockey-smash-v091.js`: road-section progression and Computer Play duplicate-player guard.
- `js/games/hockey-smash-v096.js`: smooth movement controller, keyboard controls, touch controls, and Computer Mode input bridge.
- `js/games/hockey-smash-v099.js`: Computer Mode entity sizing pass.
- `js/games/hockey-smash-v0100.js`: Game Over / Try Again flow.
- `js/games/hockey-smash-v0102.js`: moving gameplay encounter pass with difficulty ramp and encounter variants.
- `js/games/hockey-smash-v0103.js`: puck action layer, powered puck variants, fish dodge rules, and score-event hooks.
- `js/games/hockey-smash-v0104.js`: distance, score, combo, high score, difficulty state, screen shake, floating text, and run summary layer.
- `js/games/hockey-smash-v0105.js`: touch-control release marker from the prior checkpoint.
- `js/games/hockey-smash-v0106.js`: player customization layer and final visible version setter.
- `assets/hockey-smash/`: expected Hockey Smash sprite/background files.

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

Manual smoke checks before calling a checkpoint good:

- Open `/` and confirm the visible badge says `Hockey Smash v0.12.3 · Build 2026-06-29.38`.
- Confirm the splash screen shows the character selector and name input.
- Select Daniel, enter a custom name, and confirm the HUD/overlay/status text uses that name.
- Select Sofie and confirm the splash hero and player overlay use the dancer art.
- Start normal Play and confirm keyboard and touch movement still work.
- Confirm Mom/Sister text bubbles use the chosen name.
- Confirm normal, slide, and aerial pucks still have different visuals/power.
- Confirm score, floating feedback, Try Again summary, and high score still work.
- Open `?computerMode=1` and confirm autoplay still runs through movement, encounters, puck, score, and customization systems.
