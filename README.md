# Hockey Smash

Current playable version: **Hockey Smash v0.13.5**

Live GitHub Pages preview:

```text
https://jtripppiie.github.io/hockey-smash/?fresh=0135
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

Hockey Smash is the primary public playable mode in this repo. It is a static GitHub Pages canvas game with local WebP assets, fullscreen support, mobile controls, player name customization, Daniel/Sofie character selection, compact splash layout, smooth side-scroller movement, moving wildlife/family/fish encounters, puck and pointe-shoe projectile gameplay, score, distance, combo streaks, high-score persistence, floating feedback, end-of-run summaries, health, Try Again flow, dev-only Computer Play, and a hidden debug unlock.

## Latest Visible Build

The top-right badge should read:

```text
Hockey Smash v0.13.5 · Build 2026-06-29.51
```

Use that badge to confirm GitHub Pages is serving the latest checkpoint. The package version is also `0.13.5`.

Current cache key:

```text
0.13.5-20260629.51
```

## What v0.13.5 Includes

- Adds a **compact splash** pass so players should not need to scroll to see the image, title, copy, character selector, player name input, Start Game button, and note.
- Shrinks the splash hero image, title, tagline, copy, button height, and spacing.
- Shrinks the Daniel/Sofie character buttons and player name input.
- Adds short-screen and portrait overrides for smaller screens.
- Keeps all splash content visible instead of removing controls or text.
- Updates the visible badge, package version, cache keys, verifier, README, changelog, QA docs, workflow docs, checklist, progress notes, and beginner handoff guide.

## What v0.13.4 Includes

- Adds a **10-second safe practice countdown** after Start Game.
- Shows the gameplay screen and controls during the countdown so a player can learn the buttons before hazards move.
- Holds back salmon, wildlife, family interruptions, Dad jokes, and boss progression during the countdown.
- Shows a centered countdown message: `Practice the buttons before the salmon run starts`.
- Skips the countdown in `?computerMode=1` so automated Computer Play starts quickly.
- Forces salmon/fish to enter from the **right side only** and move left toward the player.
- Adds extra beginner-friendly comments in `js/games/hockey-smash-v0109.js` around the countdown, dev mode, and salmon direction guard.

## Recent v0.13.x Stabilization

- **v0.13.5:** compact no-scroll splash layout.
- **v0.13.4:** 10-second practice countdown and right-side-only fish/salmon guard.
- **v0.13.3:** Normal players see only Start Game; Watch Computer Play and debug log are dev-only; triple-tap the splash image to unlock dev mode.
- **v0.13.2:** Sofie mode became Dance Smash with pointe-shoe projectile behavior.
- **v0.13.1 / v0.13.0:** Hockey Smash title cleanup, character mode labeling, CSS manifest cleanup, hidden-screen repair, and cache-busting stabilization.

## Core Gameplay Already Included

- Compact splash screen that should fit without scrolling on common desktop/mobile browser sizes.
- Smooth left/right movement through `js/games/hockey-smash-v096.js`.
- Jump buffer, coyote-time forgiveness, early-release jump cut-off, and timed slide/crouch state.
- Computer Mode feeds its autoplay phases into the same smooth movement controller instead of skipping it.
- Moving encounter pass in `js/games/hockey-smash-v0102.js` runs in normal play and Computer Mode.
- Fish/salmon fly in from the right side only as of v0.13.4.
- Bears and moose move toward the player and can be cleared with stick/projectile gameplay.
- Mom and Sister can enter as moving interruptions with speech bubbles that use the chosen player name.
- Daniel uses Hockey Smash labels, hockey stick action, and puck behavior.
- Sofie uses Dance Smash labels, pointe-shoe action text, and pointe-shoe projectile behavior.
- `js/games/hockey-smash-v0104.js` handles distance, score, combo, high score, floating text, and run summary.
- Try Again flow appears when the player's health reaches zero.

## Controls

Keyboard:

- Move left: `ArrowLeft` or `A`
- Move right: `ArrowRight` or `D`
- Jump: `ArrowUp`, `W`, or `Space`
- Slide / duck: `Shift` or `S`
- Action: `F` or `Enter`
  - Daniel: hockey stick / puck action
  - Sofie: pointe-shoe action

Touch:

- Bottom-left D-pad: hold left/right movement.
- Bottom-right buttons: `J` for jump, `S` for slide/duck, and the character action button.
- Fullscreen button: requests fullscreen for the game shell when supported by the browser.

## Normal Play Start Flow

1. Pick Daniel or Sofie.
2. Enter a player name if desired.
3. Click **Start Game**.
4. The transition screen appears briefly.
5. The gameplay screen opens.
6. A 10-second countdown starts.
7. During the countdown, use the controls to practice moving, jumping, sliding, and attacking.
8. When the countdown finishes, hazards begin.
9. Salmon/fish should enter from the right side only.

## Computer Play / Watch Mode

Computer Play is now a dev tool, not a normal splash button.

To open it directly:

```text
https://jtripppiie.github.io/hockey-smash/?computerMode=1
```

Local version:

```text
http://localhost:8080/?computerMode=1
```

Computer Play starts the game automatically and cycles through right, left, jump, slide, and action phases. It uses the same movement, moving encounter, projectile, score, distance, combo, high-score, floating-feedback, run-summary, customization, and difficulty-ramp layers as normal play. The difference should be the driver: a human controls normal mode, and the computer controls Watch Mode.

For diagnostics:

```text
https://jtripppiie.github.io/hockey-smash/?computerMode=1&debug=1
```

## Hidden Dev Mode

Normal players should not see **Watch Computer Play** or the debug log.

To unlock dev mode from the splash screen:

1. Tap/click the splash character image 3 times quickly.
2. The Watch Computer Play button appears.
3. The debug log becomes available.

Dev mode also auto-enables with:

```text
?debug=1
?dev=1
?computerMode=1
```

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

- `index.html`: public shell, visible build badge, splash customization controls, HUD, canvas, and script/css loading order.
- `hockey-smash.css`: single CSS manifest loaded by `index.html`; imports all CSS layers with the current cache key.
- `style.css`: full-screen layout, compact splash layout, HUD, canvas scaling, and mobile controls.
- `hockey-smash-polish.css`: presentation polish, player overlay, debug hiding, portrait mobile layout, and victory overlay styles.
- `hockey-smash-touch.css`: touch-control reliability and pressed-button visual feedback.
- `hockey-smash-custom.css`: compact player name and character selector styling.
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
- `js/games/hockey-smash-v0103.js`: Daniel puck layer and Sofie pointe-shoe projectile layer.
- `js/games/hockey-smash-v0104.js`: distance, score, combo, high score, difficulty state, screen-shake control, floating text, and run summary layer.
- `js/games/hockey-smash-v0105.js`: touch-control release marker from the prior checkpoint.
- `js/games/hockey-smash-v0106.js`: player customization layer, Daniel/Sofie mode labels, and final character text updates.
- `js/games/hockey-smash-v0107.js`: gameplay repair marker.
- `js/games/hockey-smash-v0108.js`: later gameplay/presentation repair layer.
- `js/games/hockey-smash-v0109.js`: final safety/release layer; owns dev unlock, debug button logs, accidental shake lock, 10-second countdown, and right-side-only salmon guard.
- `assets/hockey-smash/`: expected Hockey Smash sprite/background files.
- `scripts/verify-hockey-smash.js`: static verification for versions, cache keys, docs, files, and key feature markers.
- `scripts/verify-hockey-smash-actions.js`: non-browser movement/action smoke verifier.
- `docs/hockey-smash-kid-handoff.md`: beginner guide explaining how the code is organized and where to safely change things.

## How The Layered JavaScript Works

The game is not bundled. Files load in the order listed at the bottom of `index.html`.

Think of each JavaScript file as a clear sheet placed on top of the first game:

1. `js/games/hockey-smash.js` creates the original game.
2. Later files patch or extend movement, UI, scoring, projectiles, or polish.
3. The last loaded file can override labels and add final safety rules.
4. When a new behavior is added, document which file owns it.

Kid-friendly rule: small final safety fixes can go in the last layer, but big new systems should get their own clearly named file and their own README/changelog entry.

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

- Open `/` and confirm the visible badge says `Hockey Smash v0.13.5 · Build 2026-06-29.51`.
- Confirm the splash screen shows Start Game, character selector, and name input without requiring scrolling on common screen sizes.
- Confirm Watch Computer Play is hidden for normal players.
- Triple-tap the splash image and confirm dev mode reveals Watch Computer Play.
- Select Daniel, enter a custom name, and confirm the HUD/overlay/status text uses that name.
- Select Sofie and confirm Dance Smash labels and pointe-shoe action text appear.
- Start normal Play and confirm the 10-second countdown appears before hazards begin.
- During the countdown, confirm movement, jump, slide, and action buttons work.
- After the countdown, confirm salmon/fish come from the right side only.
- Confirm bears and moose move toward the player.
- Confirm projectiles, score, floating feedback, Try Again summary, and high score still work.
- Open `?computerMode=1` and confirm autoplay still runs through movement, encounters, projectile, score, and customization systems.
