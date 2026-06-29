# Hockey Smash

Current playable version: **Hockey Smash v0.5.3**

Live GitHub Pages preview:

```text
https://jtripppiie.github.io/hockey-smash/
```

## Current Status

Hockey Smash is now the primary public playable mode in this repo. The project uses static GitHub Pages infrastructure, a canvas runtime, local assets, docs, and verification scripts centered on Hockey Smash.

## What This Prototype Includes

- Hockey Smash splash screen with the visible version kept only in the top-right build badge.
- Play button with a short "Entering Hockey Smash..." transition.
- Full browser-viewport gameplay screen.
- 1024x576 landscape-first canvas layout.
- Ground line at `canvasHeight * 0.82`, aligned to the visible sidewalk in the background art.
- Hockey player fixed-screen side-scroller movement with a visible debug marker while controls are being stabilized.
- Left/right movement, jump, slide, and stick swing coverage for v0.5.3.
- Responsive jump, hold-to-slide speed boost, and hockey stick combo attack.
- One health bar with brief invincibility after damage.
- Try Again screen when health reaches zero.
- Normal-mode victory overlay after the final challenge is cleared.
- Summer Soldotna-inspired backgrounds with an invisible collision ground line and no code-drawn gray sidewalk.
- Asset fallback placeholders when sprites/images are missing.
- Bears and moose as stick-clearable obstacles, plus salmon hazards, Mom/Sister interruption bubbles, a major salmon run, and Dad boss with dad joke attacks.
- Mobile landscape-first layout with temporary portrait rotate hint.
- D-pad and action controls that do not scroll the page during gameplay.
- Debug overlay hidden during normal player mode and preserved for `?computerMode=1`.

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

## Debug / Computer Mode

Open the game with:

```text
http://localhost:8080/?computerMode=1
```

Computer mode briefly shows the splash screen, starts the game, and cycles through right movement, left movement, jump, slide, stick swing, and obstacle clearing. The in-game debug overlay reports player `x/y`, velocity, facing, active keys, sprite load state, and pass markers for right/left/jump/slide/stick/obstacle.

## Main Files

- `index.html`: Hockey Smash public shell.
- `style.css`: full-screen layout, splash, HUD, canvas scaling, and mobile controls.
- `hockey-smash-polish.css`: normal-mode presentation polish, debug hiding, and victory overlay styles.
- `script.js`: app bootstrap.
- `js/games/hockey-smash.js`: Hockey Smash runtime, state machine, player movement, hazards, Dad boss, rendering, and asset fallbacks.
- `js/games/hockey-smash-polish.js`: normal-mode polish layer for top-level player experience.
- `assets/`: expected Hockey Smash sprite/background files.
- `docs/hockey-smash-design.md`: design target and scope.
- `docs/hockey-smash-workflow.md`: manual development workflow.
- `docs/hockey-smash-dev-checklist.md`: quick dev checklist.

## Asset Paths

Expected assets are `.png` files in `assets/`:

```text
assets/hockey-smash/backgrounds/soldotna_cityscape_background_01_1920x1080.png
assets/hockey-smash/backgrounds/soldotna_cityscape_background_02_1920x1080.png
assets/hockey-smash/backgrounds/soldotna_cityscape_background_03_1920x1080.png
assets/hockey-smash/backgrounds/soldotna_cityscape_background_04_1920x1080.png
assets/hockey-smash/backgrounds/soldotna_cityscape_background_05_1920x1080.png
assets/hockey-smash/sprites/hockey-player.png
assets/hockey-smash/sprites/splash.png
assets/hockey-smash/sprites/salmon.png
assets/hockey-smash/sprites/bear.png
assets/hockey-smash/sprites/moose.png
assets/hockey-smash/sprites/dad.png
assets/hockey-smash/sprites/mom.png
assets/hockey-smash/sprites/mom_text.png
assets/hockey-smash/sprites/sister.png
assets/hockey-smash/sprites/sister_text.png
```

Missing assets do not crash the game. The runtime draws labeled placeholders and logs missing paths to the developer console.

## Verification

Run:

```bash
npm run verify
```

This checks JavaScript syntax, validates the Hockey Smash launch shell/docs/assets, and runs a Node-based action simulation for right movement, left movement, jump, slide, stick swing, and bear obstacle clearing.

## Known Limitations

- The hockey player uses one static sprite; walking animation is future work.
- Placeholder drawings stand in for any missing final art.
- The first level is fixed-screen only; there is no camera-following long level yet.
- Dad boss, salmon run, and interruption timing are tuned for a first prototype, not final balance.
