# Hockey Smash QA Routes

Hockey Smash is the primary public game in this repo. This QA file tracks the current public preview first, then the manual checks that matter before calling a checkpoint stable.

## Current Preview

- Public game: `Hockey Smash v0.13.5`
- Visible build badge: `Hockey Smash v0.13.5 · Build 2026-06-29.51`
- Package version: `0.13.5`
- Preview branch: `main`
- GitHub Pages URL: `https://jtripppiie.github.io/hockey-smash/`
- Fresh cache-bust URL: `https://jtripppiie.github.io/hockey-smash/?fresh=0135`
- Computer Play URL: `https://jtripppiie.github.io/hockey-smash/?computerMode=1`

## v0.13.5 Layout QA

### Compact Splash

1. Open `https://jtripppiie.github.io/hockey-smash/?fresh=0135`.
2. Confirm the top-right badge says `Hockey Smash v0.13.5 · Build 2026-06-29.51`.
3. Confirm the splash screen says `Hockey Smash`.
4. Confirm the splash hero image is smaller than the older oversized version.
5. Confirm the title, tagline, copy, character selector, player name input, Start Game button, and note fit without obvious scrolling on a normal browser window.
6. Test a shorter browser height and confirm the compact splash still tries to keep Start Game visible.
7. Test a phone-sized portrait viewport and confirm the splash content is smaller and more compact than before.
8. Confirm nothing important was hidden just to save space.

### Launch Flow

1. Confirm normal players see **Start Game** only, not Watch Computer Play.
2. Click **Start Game**.
3. Confirm the transition screen says `Entering Hockey Smash...` or `Entering Dance Smash...` depending on the selected character.
4. Confirm gameplay opens in a full browser-viewport screen.
5. Confirm the page does not anchor-jump or scroll during gameplay.

### 10-Second Start Countdown

1. Start normal play from the splash screen.
2. Confirm the gameplay screen appears.
3. Confirm a countdown appears near the middle of the game screen.
4. Confirm the countdown says `Practice the buttons before the salmon run starts`.
5. During the countdown, hold left and confirm the player moves left.
6. During the countdown, hold right and confirm the player moves right.
7. During the countdown, press Jump and confirm the player jumps.
8. During the countdown, press Slide and confirm the player slides/ducks.
9. During the countdown, press the character action button and confirm the action responds.
10. Confirm no salmon, bear, moose, Mom, Sister, Dad joke, or Dad boss reaches the player during the countdown.
11. Confirm hazards begin after the countdown finishes.

### Daniel / Sofie Character QA

1. Select Daniel.
2. Confirm the splash title says `Hockey Smash`.
3. Confirm Daniel uses hockey-stick/puck language and behavior.
4. Select Sofie.
5. Confirm the splash title changes to `Dance Smash`.
6. Confirm the transition says `Entering Dance Smash...`.
7. Confirm Sofie's action button uses pointe-shoe language/visuals.
8. Confirm player name text appears in the HUD, overlay, status messages, Try Again text, and Mom/Sister bubbles.

### Moving Gameplay Encounters

1. Confirm fish/salmon fly in from the **right side only**.
2. Confirm jumping over fish counts as a dodge.
3. Confirm sliding/ducking under fish counts as a dodge.
4. Confirm missing a fish dodge damages the player.
5. Confirm bears move toward the player.
6. Confirm moose move toward the player.
7. Confirm stick/projectile action can clear bear/moose obstacles.
8. Confirm Mom can enter as a moving interruption with a speech bubble.
9. Confirm Sister can enter as a moving interruption with a speech bubble/spin moment.
10. Confirm the player's health meter updates when damage happens.
11. Confirm **Try Again?** appears when health reaches zero.

### Hidden Dev Mode

1. Open normal play at `https://jtripppiie.github.io/hockey-smash/?fresh=0135`.
2. Confirm Watch Computer Play is hidden.
3. Confirm the debug boot log is hidden.
4. Tap/click the splash image 3 times quickly.
5. Confirm Watch Computer Play appears.
6. Confirm the debug boot log appears.
7. Refresh without dev/debug parameters and confirm normal splash remains clean unless the same browser session still has dev mode unlocked.

### Computer Play / Watch Mode Parity

1. Open `https://jtripppiie.github.io/hockey-smash/?computerMode=1`.
2. Confirm the game starts automatically after the splash.
3. Confirm Computer Mode does **not** wait through the 10-second normal-play countdown.
4. Confirm the player moves through right, left, jump, slide, and action phases.
5. Confirm Computer Mode uses the smooth movement behavior, not only the older core movement.
6. Confirm fish/salmon, bear, moose, Mom, and Sister can appear under Computer Mode.
7. Confirm projectile action can appear under Computer Mode action phases.
8. Confirm Computer Mode looks close to normal play except that the computer is choosing the actions.

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

- The current architecture is layered: the core runtime loads first, then later scripts patch or extend movement, HUD, encounters, Try Again, projectiles, character mode, dev tools, layout, and final safety rules.
- The visible badge, package version, cache key, latest final safety layer, README, changelog, workflow docs, QA docs, checklist, progress docs, and beginner handoff guide should all agree on v0.13.5.
- Browser QA still matters because the game uses canvas, DOM overlays, pointer controls, localStorage, sessionStorage, media queries, and requestAnimationFrame loops.
