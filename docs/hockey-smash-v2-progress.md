# Hockey Smash v2 Progress Log

This file records the architectural cleanup steps so work can continue in small, reversible chunks.

## Ground Rule

The current live game remains the current live game until a specific integration step is reviewed.

V2 work is currently isolated. It should not be loaded by `index.html` yet.

## Completed

### Step 1: Isolated v2 world scaffold

Added:

```text
js/games/hockey-smash-world-v2.js
```

Purpose:

- define the future world shape
- define phase names
- define sprite keys
- define player/entity factories
- document Mom, salmon, and cameo shapes in code

Status:

```text
complete, not loaded by index.html
```

### Step 2: Isolated v2 renderer scaffold

Added:

```text
js/games/hockey-smash-renderer-v2.js
```

Purpose:

- render a v2 world object to a canvas context
- draw background, entities, player, effects, and simple bubbles
- keep rendering based on explicit world state instead of DOM overlays

Important safety notes:

- does not start its own animation loop
- does not register input listeners
- does not append DOM nodes
- does not patch `window.RTA_HOCKEY_SMASH`
- is not loaded by `index.html`

Status:

```text
complete, not loaded by index.html
```

## Current Live Game Impact

None intended.

The v2 files are passive files. They only expose future helper objects on `window` if a page explicitly loads them. The real game page does not currently load them.

## Next Step

### Step 3: Add an isolated v2 dev harness

Recommended file:

```text
dev/hockey-smash-v2.html
```

Purpose:

- load only v2 world + v2 renderer
- create a separate canvas
- show the v2 world without touching the real game page
- allow testing Daniel/Sofie, salmon, Mom, and cameos in isolation

Rules for Step 3:

- do not modify `index.html`
- do not replace the real game
- do not load current-game patch layers
- keep it clearly marked as development-only

## Later Steps

1. Add v2 dev harness.
2. Add basic v2 input adapter inside the dev harness only.
3. Add v2 salmon update loop inside the isolated harness.
4. Prove Daniel and Sofie render as canvas player sprites in v2.
5. Prove 20-salmon gate in v2.
6. Only then discuss wiring a v2 piece into the real game.

## Do Not Do Yet

Do not migrate these into the current game yet:

- player rendering
- salmon-run controller
- current countdown
- current Sofie overlay
- current Alaska cameo overlay
- current projectile system
- current stage-flow file

Those changes should wait until the v2 harness proves the isolated model works.
