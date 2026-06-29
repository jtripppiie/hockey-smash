# Hockey Smash Kid Handoff Guide

This guide explains the game in plain language so a beginner can safely help later.

## Big Idea

Hockey Smash is a browser game.

It uses:

- `HTML` for the page and buttons.
- `CSS` for layout, colors, size, and mobile controls.
- `JavaScript` for movement, enemies, score, countdowns, and game rules.
- `Canvas` for drawing the game scene.

There is no server. There are no accounts. There is no build step to play the game locally.

## How To Open The Game Locally

From the repo folder, run:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

## The Most Important Rule

Do not change five files at once unless you understand why.

Safer pattern:

1. Change one small thing.
2. Save.
3. Refresh the browser.
4. Test it.
5. Run `npm run verify`.
6. Update docs if behavior changed.

## How The Files Load

Open `index.html` and scroll to the bottom.

You will see many script tags like:

```html
<script src="js/games/hockey-smash.js?v=..."></script>
<script src="js/games/hockey-smash-v096.js?v=..."></script>
<script src="js/games/hockey-smash-v0109.js?v=..."></script>
```

These load from top to bottom.

Think of the files like clear plastic sheets:

1. `js/games/hockey-smash.js` is the first drawing.
2. Later files add more details on top.
3. The last file can make final repairs.

That is why `js/games/hockey-smash-v0109.js` is important. It loads last and handles final safety rules.

## Main Files And What They Do

### `index.html`

This is the page.

Change this when you need to edit:

- Build badge text.
- Script load order.
- CSS load path.
- Splash screen text.
- Buttons.
- Canvas markup.
- HUD markup.

Be careful: changing script order can break the game.

### `hockey-smash.css`

This is the CSS manifest.

It imports the other CSS files.

Change this when you need to:

- Update CSS cache keys.
- Add a new CSS file to the page.
- Keep hidden screens truly hidden.

### `style.css`

This has the main layout.

Change this when you need to adjust:

- Fullscreen layout.
- Splash screen layout.
- Canvas size behavior.
- HUD layout.
- Controls layout.

### `hockey-smash-touch.css`

This helps phone/tablet controls.

Change this when:

- Buttons feel hard to tap.
- Touches cause scrolling.
- Pressed-button feedback looks wrong.

### `hockey-smash-custom.css`

This styles the player name input and character buttons.

Change this when:

- Daniel/Sofie selector looks wrong.
- The player name field needs layout changes.

### `js/games/hockey-smash.js`

This is the original game brain.

It has:

- Game states: splash, transition, playing, boss intro, boss fight, try again.
- Player setup.
- Original movement.
- Original enemy spawning.
- Collision detection.
- Drawing the canvas.
- Health and damage.

Be careful in this file. Many later files depend on it.

### `js/games/hockey-smash-v096.js`

This owns smooth movement.

Look here for:

- Run acceleration.
- Jump buffer.
- Coyote time.
- Slide timing.
- Touch input tracking.
- Computer Mode input bridge.

### `js/games/hockey-smash-v0102.js`

This owns moving encounter behavior.

Look here for:

- Bear movement.
- Moose movement.
- Mom/Sister movement.
- Difficulty ramp.
- Encounter variants.

### `js/games/hockey-smash-v0103.js`

This owns projectiles.

Look here for:

- Daniel's puck.
- Sofie's pointe shoe.
- Projectile speed.
- Projectile damage.
- Fish dodge rules.

### `js/games/hockey-smash-v0104.js`

This owns score and feedback.

Look here for:

- Distance.
- Score.
- Combo.
- High score.
- Floating text.
- Try Again summary.
- Impact feedback.

### `js/games/hockey-smash-v0106.js`

This owns character customization.

Look here for:

- Daniel settings.
- Sofie settings.
- Hockey Smash vs Dance Smash labels.
- Player name.
- HUD name.
- Try Again name.
- Character sprites.

### `js/games/hockey-smash-v0109.js`

This is the final safety/release layer.

It currently owns:

- Final visible version text.
- Hidden dev mode.
- Triple-tap splash image unlock.
- Watch Computer Play visibility.
- Debug button logging.
- Accidental camera-shake lock.
- 10-second practice countdown.
- Right-side-only salmon/fish guard.

This file has extra comments because it is the newest gameplay safety layer.

## Where To Change Common Things

### Change the countdown length

Open:

```text
js/games/hockey-smash-v0109.js
```

Find:

```js
const START_COUNTDOWN_SECONDS = 10;
```

Change `10` to another number.

Then update:

- `README.md`
- `CHANGELOG.md`
- `docs/hockey-smash-qa.md`
- `docs/hockey-smash-dev-checklist.md`
- `scripts/verify-hockey-smash.js` if it checks the exact number.

### Make fish come from both sides again

Open:

```text
js/games/hockey-smash-v0109.js
```

Find:

```js
forceSalmonFromRight()
```

That function moves any accidental left-spawned salmon back to the right.

To allow both sides, you would remove or disable that function call inside:

```js
gameplaySafetyLoop()
```

Then update docs and QA, because right-side-only would no longer be true.

### Change Daniel's action

Open:

```text
js/games/hockey-smash-v0106.js
js/games/hockey-smash-v0103.js
```

Use `v0106` for the button label and character text.

Use `v0103` for the actual projectile behavior.

### Change Sofie's action

Open:

```text
js/games/hockey-smash-v0106.js
js/games/hockey-smash-v0103.js
js/games/hockey-smash-v0104.js
```

Use `v0106` for labels.

Use `v0103` for projectile behavior.

Use `v0104` for hit text and scoring feedback.

### Change movement speed

Open:

```text
js/games/hockey-smash-v096.js
```

Look for movement constants near the top.

Do not change old movement in `hockey-smash.js` first, because the newer movement layer may override it.

### Change bear or moose behavior

Open:

```text
js/games/hockey-smash-v0102.js
```

Also check the original spawn helper in:

```text
js/games/hockey-smash.js
```

### Change the build number

Update all of these together:

- `index.html`
- `hockey-smash.css`
- `package.json`
- `scripts/verify-hockey-smash.js`
- `README.md`
- `CHANGELOG.md`
- `docs/hockey-smash-qa.md`
- `docs/hockey-smash-dev-checklist.md`
- `docs/hockey-smash-workflow.md`
- `docs/hockey-smash-progress.md`

## What To Test After Any Change

Always test these basics:

1. Splash screen loads.
2. Start Game works.
3. Countdown appears in normal play.
4. Controls work during countdown.
5. Hazards start after countdown.
6. Salmon/fish come from the right side only.
7. Left/right movement works.
8. Jump works.
9. Slide works.
10. Action works.
11. Try Again works when health reaches zero.
12. Computer Mode still starts with `?computerMode=1`.
13. `npm run verify` passes.

## Debug Mode

Normal players should not see debug tools.

To unlock debug tools:

- Triple-tap/click the splash image quickly, or
- Open with `?debug=1`, or
- Open with `?computerMode=1`.

Debug tools can help answer:

- Is the game in splash, transition, or playing mode?
- Did the button receive the tap?
- Where is the player?
- Is Computer Mode active?
- Is the countdown active?

## How To Comment Code Clearly

Good comments explain **why**, not just **what**.

Less helpful:

```js
state.time = 0;
```

Better:

```js
// Keep progression at the start line so the salmon run cannot begin while
// the player is only practicing controls.
state.time = 0;
```

Use comments when:

- A line prevents a bug.
- A line looks strange but is intentional.
- A function protects normal players from dev tools.
- A function is patching older layered behavior.
- A kid or beginner might ask, "Why did we do that?"

## How To Add A New Feature Safely

Use this pattern:

1. Name the feature in plain English.
2. Decide which file should own it.
3. Add the smallest version that works.
4. Add comments near tricky parts.
5. Test normal play.
6. Test Computer Mode.
7. Update README and changelog.
8. Add QA checklist items.
9. Run `npm run verify`.
10. Push only when the game still starts.

## Current v0.13.4 Behavior To Preserve

- Normal splash is clean.
- Watch Computer Play is hidden unless dev mode is active.
- Dev mode unlocks by triple-tapping the splash image.
- Start Game leads to gameplay.
- Gameplay starts with a 10-second safe countdown.
- Controls work during the countdown.
- Hazards do not attack during the countdown.
- Salmon/fish enter from the right side only.
- Daniel uses Hockey Smash / puck behavior.
- Sofie uses Dance Smash / pointe-shoe behavior.
- Computer Mode still starts quickly and uses the same gameplay systems.
