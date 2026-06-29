# Hockey Smash QA Routes

Hockey Smash is the primary public game in this repo. This QA file tracks the current public preview first, then the manual checks that matter before calling a checkpoint stable.

## Current Preview

- Public game: `Hockey Smash v0.11.8`
- Visible build badge: `Hockey Smash v0.11.8 · Build 2026-06-29.33`
- Package version: `0.11.8`
- Preview branch: `main`
- GitHub Pages URL: `https://jtripppiie.github.io/hockey-smash/`
- Computer Play URL: `https://jtripppiie.github.io/hockey-smash/?computerMode=1`

## v0.11.8 Launch QA

### Launch Flow

1. Open `https://jtripppiie.github.io/hockey-smash/`.
2. Confirm the top-right badge says `Hockey Smash v0.11.8 · Build 2026-06-29.33`.
3. Confirm the splash screen says `Hockey Slash 2`.
4. Click **Play Hockey Smash**.
5. Confirm the transition screen says `Entering Hockey Smash...`.
6. Confirm gameplay opens in a full browser-viewport screen.
7. Confirm the page does not anchor-jump or scroll during gameplay.

### Normal Gameplay Controls

1. Use `A` / `ArrowLeft` and confirm Daniel moves left smoothly.
2. Use `D` / `ArrowRight` and confirm Daniel moves right smoothly.
3. Press `W`, `ArrowUp`, or `Space` and confirm Daniel jumps.
4. Press or hold `Shift` / `S` and confirm Daniel slides/ducks.
5. Press `F` or `Enter` and confirm the stick/puck action triggers.
6. Confirm the mobile D-pad left/right works.
7. Confirm the mobile `J`, `S`, and hockey stick buttons work.
8. Confirm keyboard arrows and touch controls do not scroll the page.

### Moving Gameplay Encounters

1. Confirm fish/salmon fly across the screen.
2. Confirm jumping over fish counts as a dodge.
3. Confirm sliding/ducking under fish counts as a dodge.
4. Confirm missing a fish dodge damages Daniel.
5. Confirm bears move toward Daniel.
6. Confirm moose move toward Daniel.
7. Confirm stick/puck action can clear bear/moose obstacles.
8. Confirm Mom can enter as a moving interruption with a speech bubble.
9. Confirm Sister can enter as a moving interruption with a speech bubble/spin moment.
10. Confirm Daniel's health meter updates when damage happens.
11. Confirm **Try Again?** appears when health reaches zero.

### Computer Play / Watch Mode Parity

1. Open `https://jtripppiie.github.io/hockey-smash/?computerMode=1`.
2. Confirm the game starts automatically after the splash.
3. Confirm Daniel moves through right, left, jump, slide, and stick phases.
4. Confirm Computer Mode uses the smooth movement behavior, not only the older core movement.
5. Confirm fish/salmon, bear, moose, Mom, and Sister can appear under Computer Mode.
6. Confirm puck action can appear under Computer Mode stick phases.
7. Confirm Computer Mode looks close to normal play except that the computer is choosing the actions.

### Debug Overlay

Use diagnostics only when needed:

```text
https://jtripppiie.github.io/hockey-smash/?computerMode=1&debug=1
```

Checks:

1. Confirm the debug overlay appears only when `debug=1` is present.
2. Confirm it reports useful player/entity information.
3. Confirm no runtime error text appears during the basic Computer Play route.

### Mobile

1. Test portrait on a phone-sized viewport.
2. Confirm `Rotate for the best gaming experience.` appears briefly.
3. Rotate to landscape and confirm the overlay disappears.
4. Confirm the D-pad stays bottom-left.
5. Confirm action buttons stay bottom-right.
6. Confirm dragging/tapping controls does not move the page.

### Local Verification Commands

Run before pushing a release-quality checkpoint:

```bash
npm run verify
```

Optional browser automation:

```bash
npm install
npm run test:browser:install
npm run test:browser
```

## Known QA Notes

- The current architecture is layered: the core runtime loads first, then later scripts patch or extend movement, HUD, encounters, Try Again, and puck behavior.
- The visible badge, package version, latest movement layer, encounter layer, and puck layer are the release-facing v0.11.8 markers.
- Browser QA still matters because the game uses canvas, DOM overlays, pointer controls, and requestAnimationFrame loops.
