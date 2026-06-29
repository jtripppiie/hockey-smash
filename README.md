# Hockey Smash

Current playable version: **Hockey Smash v0.9.0**

Live GitHub Pages preview:

```text
https://jtripppiie.github.io/hockey-smash/
```

## Current Status

Hockey Smash is now the primary public playable mode in this repo. The project uses static GitHub Pages infrastructure, a canvas runtime, local assets, mobile controls, fullscreen support, and verification scripts centered on Hockey Smash.

## Latest Visible Build

The top-right badge should read:

```text
Hockey Smash v0.9.0 · Build 2026-06-29.11
```

Use that badge to confirm GitHub Pages is serving the latest checkpoint.

## What v0.9.0 Includes

- Hockey Smash splash screen with the visible version kept in the top-right build badge.
- Play button, Watch Computer Play button, and Fullscreen button.
- Fullscreen support for mobile so browser bars can be hidden where the browser allows it.
- Full browser-viewport gameplay screen.
- 1024x576 virtual canvas runtime.
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

Computer Play is treated as a player-facing watch/autoplay mode. It starts the game and cycles through movement, jump, slide, and stick actions so the game can be watched without manual input.

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
- `assets/`: expected Hockey Smash sprite/background files.

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

Optional browser automation:

```bash
npm install
npm run test:browser:install
npm run test:browser
```

## Known Limitations

- Daniel still uses one static sprite; walking animation is future work.
- Entity overlays are a v0.9 visibility layer while the canvas/mobile scaling stabilizes.
- The first level is fixed-screen only; there is no camera-following long level yet.
- Dad boss, salmon run, and interruption timing are tuned for a prototype, not final balance.
