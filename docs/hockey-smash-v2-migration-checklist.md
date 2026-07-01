# Hockey Smash v2 Migration Checklist

This checklist exists so the game can be cleaned up without breaking the current working version.

## Current Status

The current game is still the live game. The new v2 files are foundation only.

Live files still loaded by `index.html` include the existing canvas game and its support layers. The new v2 files are not loaded by the live page and should not affect gameplay.

Current isolated v2 files:

```text
js/games/hockey-smash-world-v2.js
js/games/hockey-smash-renderer-v2.js
dev/hockey-smash-v2.html
```

## Hard Rule

Do not wire v2 into `index.html` until a specific migration step is reviewed.

A safe v2 commit may add:

- docs
- isolated v2 modules
- inactive test helpers
- dev-only harness pages
- notes/checklists

A safe v2 commit should not change:

- current script order
- current countdown
- current salmon run
- current character picker
- current controls
- current scoring
- current version-lock behavior
- current loaded gameplay files

## Completed Foundation Steps

### 1. Document the current direction

Done in:

```text
docs/hockey-smash-v2-architecture.md
docs/hockey-smash-v2-migration-checklist.md
docs/hockey-smash-v2-progress.md
```

### 2. Keep the v2 world isolated

Done in:

```text
js/games/hockey-smash-world-v2.js
```

The v2 world file defines:

- phase names
- tuning constants
- sprite paths
- entity factory helpers
- player shape
- Mom shape
- cameo shape
- salmon-run target

It does not:

- start a game loop
- register input listeners
- create DOM nodes
- append elements to the page
- draw on the real canvas
- mutate `window.RTA_HOCKEY_SMASH`

### 3. Add a v2 renderer separately

Done in:

```text
js/games/hockey-smash-renderer-v2.js
```

The renderer takes a world object and a canvas context:

```js
renderWorld(ctx, world, imageCache)
```

It renders from explicit world state. It does not start a loop, read the current live game, or append DOM overlays.

### 4. Add a v2 dev harness with basic input adapter

Done in:

```text
dev/hockey-smash-v2.html
```

The dev harness:

- loads only the v2 world and renderer
- creates its own separate canvas
- previews Daniel and Sofie as canvas-rendered player sprites
- maps keyboard and pointer controls to a local v2 input object
- moves the v2 player in the harness only
- does not touch the real game page

Controls:

```text
A / Left Arrow  -> left
D / Right Arrow -> right
W / Up / Space  -> jump
S / Shift       -> slide
```

## Recommended Migration Order From Here

### 5. Add v2 salmon loop inside the dev harness

Goal:

```text
salmon spawn, fall, collection, and scoring are owned by one v2 path.
```

Acceptance criteria:

- salmon spawn in the v2 harness only
- salmon fall in canvas world units
- player overlaps salmon to collect it
- collected count increments once per salmon
- readout shows salmon count
- no current live-game file is touched

### 6. Prove 20-salmon gate in v2

Goal:

```text
countdown -> salmonRun -> catch 20 -> encounters unlocked
```

Acceptance criteria:

- countdown happens first
- no v2 game-world entities spawn during countdown
- salmon-only run starts after countdown
- encounters unlock only after 20 salmon
- dev harness readout shows the phase transition

### 7. Add v2 family/cast entity previews

Goal:

```text
Mom, Dad, Daniel/brother, and dance instructor are entities, not overlays.
```

Rules:

- Mom is stationary
- Mom appears briefly
- Mom only says `[Name], clean your room!`
- Mom is non-contact
- Dad can have his own rule later
- dance instructor appears only in Sofie mode unless intentionally changed
- Daniel/brother helper appears only when explicitly designed

### 8. Add v2 wildlife previews

Goal:

```text
bear and moose movement, rendering, and contact all come from entities.
```

Acceptance criteria:

- bear enters screen visibly
- moose enters screen visibly
- speeds are tuned in one place
- only one big animal at a time if that remains the rule
- no DOM collision bridge is involved

### 9. Add v2 cameos as world entities

Goal:

```text
Alaska boy/girl cameos are optional world entities, not DOM overlays.
```

Decision needed before final integration:

- Are cameos allowed during salmon run?
- Are cameos purely background flavor?
- Should Daniel mode show Alaskan girl and Sofie mode show Alaskan boy, or should that mapping be reversed?

Until answered, keep cameos outside the salmon-run requirement or clearly mark them as non-gameplay background flavor.

### 10. Migrate projectiles later

Projectiles are higher risk because they affect interaction rules. Do not migrate them first.

Goal:

```text
projectiles are entities in the same coordinate system as every target.
```

Acceptance criteria:

- no `getBoundingClientRect()` collision bridge for gameplay projectiles
- projectile position is in canvas world units
- projectile target checks use world hitboxes
- collision results are deterministic

## DOM Overlay Audit Categories

Use this classification when deciding what to keep or move.

### Keep as DOM

- splash screen
- buttons
- text input
- HUD text
- countdown panel
- debug panel
- fullscreen toggle
- accessibility status text

### Move to canvas/world state

- Sofie gameplay sprite
- Alaska cameo
- speech bubbles attached to characters
- Mom/Dad/dance-instructor visuals
- projectiles
- any object that can move, expire, collide, or affect gameplay

## Versioning Rule

Only one file should own the visible build label.

Current version owner:

```text
js/games/hockey-smash-version-lock.js
```

No other gameplay file should write:

- `badge.textContent`
- `getVersion`
- `DISPLAY_VERSION`
- `DISPLAY_BUILD`

## Branch/Commit Guidance

The user currently prefers direct work on `main`, but this v2 refactor is architectural. Keep commits very small and reversible.

Recommended commit style:

```text
Add isolated v2 world scaffold
Document v2 migration checklist
Add inactive v2 renderer scaffold
Add v2 smoke harness, not loaded by game
```

Avoid commits like:

```text
Rewrite game
Replace all gameplay
Fix everything
```

## First Real Integration Gate

Before any v2 code is loaded by the real page, verify:

- current game still starts
- countdown appears
- salmon fall after countdown
- 20 salmon unlocks encounters
- Sofie appears if selected
- Daniel appears if selected
- version badge is correct
- no lawnmower Dad appears during salmon run

## Success Definition

The cleanup is successful when gameplay objects are no longer split between DOM and canvas.

The final architecture should feel boring:

```text
input changes state
systems update state
renderer draws state
DOM shows UI
```

Boring is good here. Boring means fewer surprise bugs.
