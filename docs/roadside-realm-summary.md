# Roadside Realm Summary

This file is the maintained quick summary for **Roadside Realm V1.0**. The full game plan lives in [roadside-realm-game-plan.md](roadside-realm-game-plan.md).

Update this summary whenever the full spec changes in a way that affects scope, architecture, flow, controls, saves, QA, or launch instructions.

If exported image assets are needed, use [roadside-realm-image-spec.md](roadside-realm-image-spec.md) for exact dimensions, DPI/source settings, filenames, sprite sheets, and image QA.

## High Concept

Roadside Realm is a complete first-person, grid-based dungeon crawler mini-game inside the Road Trip Adventures app.

The player discovers a strange roadside map kiosk, enters a tiny pocket dungeon, defeats the Signpost Ogre, recovers the Mapstone, and restores the route. A hidden room leads to the optional Forgotten Underpass and a true ending.

The full game plan also includes an optional deeper add-on zone: **The Never-Finished Mansion**, a fictional mansion-inspired road-trip detour with maze-like architecture, impossible doors, architectural puzzles, the Star Map Fragment, and an upgraded secret ending path.

Tone:

- retro
- playful
- cozy
- family-friendly
- road-trip themed
- lightly mysterious

Do not copy QuestLord content, maps, UI, art, names, story, or assets. Use only broad genre ideas such as first-person grid movement, monsters, keys, locked doors, secrets, and endings.

## V1.0 Must Include

- One focused production pass that ships the complete main quest, hidden route, normal ending, true ending, save system, controls, accessibility, and QA together.
- First-person canvas dungeon view.
- Grid movement with four-direction facing.
- Turn left, turn right, move forward, optional move backward.
- Inspect, attack, use item, map toggle, save, continue, and reset.
- HP, attack, defense, level/XP, inventory, gold or score.
- At least one key, locked door, treasure, healing item or healing tile, and boss.
- At least three normal encounters.
- Main quest item: Mapstone.
- Normal ending and summary screen.
- Hidden room with meaningful reward.
- Optional hidden second layer: Forgotten Underpass.
- Secret/true ending gated by the Moon Toll Token and true-ending state.
- Optional deeper mansion chapter gated by the Moon Toll Token if the Never-Finished Mansion add-on is implemented.
- Keyboard and mobile controls.
- Mobile directional pad with large arrow controls.
- Distinct canvas sprite graphics for monsters, items, doors, hidden walls, exits, and underpass spaces.
- Accessible status/log outside the canvas.
- High contrast, large text, and reduced motion support.
- Static files only: no backend, accounts, analytics, tracking, GPS, remote APIs, package installs, or build step.

## One-Pass V1.0 Target

"One-pass perfect" means the first shipped V1.0 should feel complete at its chosen size. It does not mean the game is huge. It means the main route, optional secret route, UI, copy, saves, accessibility, and QA are all finished together.

Player-facing promise:

```text
A compact first-person road-fantasy dungeon crawler with a complete main quest,
a hidden optional route, a boss with a readable special move, a normal ending,
a true ending, saves, touch controls, keyboard controls, and accessible text output.
```

The player should be able to complete the true ending in one run if they notice and follow the secret clues before choosing the final exit.

## Recommended Files

Create:

- `js/games/roadside-realm-data.js`
- `js/games/roadside-realm.js`
- `docs/roadside-realm-qa.md`

Create later only if needed:

- `js/games/roadside-realm-art.js`

Optional docs:

- `docs/roadside-realm-image-spec.md` if raster/vector image assets are created.

Modify:

- `index.html`
- `script.js`
- `style.css`
- `sw.js`
- `scripts/audit-game-quality.js`

## Architecture

Use a Realm-specific namespace so existing app modes are not disturbed.

Recommended split:

- Data file owns maps, items, monsters, event tables, dialogue, balance constants, and validation.
- Game file owns runtime state, input, movement, combat, interactions, save/load, DOM rendering, and canvas rendering.
- Optional art file owns larger canvas drawing helpers if the game file gets too large.
- CSS owns layout, controls, responsive behavior, and accessibility variants.
- Service worker owns cache version and manifest updates.

All mutable game progress should live in one state object, then flow through:

```text
input -> action resolver -> state mutation -> autosave -> canvas render -> DOM render -> aria-live update
```

## Main Path

Expected play time: 5-12 minutes.

Core flow:

1. Start at the Map Kiosk Dungeon.
2. Learn movement and inspect controls.
3. Find the Rusty Road Key.
4. Unlock the Toll Gate.
5. Fight normal enemies.
6. Find a healing item or healing fountain.
7. Reach and defeat the Signpost Ogre.
8. Claim the Mapstone.
9. Return to the exit.
10. Trigger the normal ending.

Primary room beats:

- Map Kiosk Entry teaches movement and establishes the exit.
- Route Marker Hall introduces exploration.
- Key Nook rewards inspection and movement.
- Toll Gate proves items change the world.
- Snack Shrine gives recovery before danger.
- Detour Gallery adds optional treasure and moon-route clues.
- Signpost Court delivers the boss.
- Mapstone Niche resolves the main quest.

Normal ending condition:

```text
player reaches exit
AND has Mapstone
AND true ending is not unlocked
```

## Secret Path

Expected extra play time: 3-8 minutes.

Secret flow:

1. Notice moon-scratch clues.
2. Find and activate the secret switch.
3. Open the hidden wall.
4. Enter the Moon Toll Booth hidden room.
5. Descend into the Forgotten Underpass.
6. Defeat or bypass optional secret challenges.
7. Recover the Moon Toll Token.
8. Return to the main map.
9. Exit with both Mapstone and Moon Toll Token.
10. Trigger the true ending and Secret Star badge.

True ending condition:

```text
player reaches exit
AND has Mapstone
AND has Moon Toll Token
AND flags.trueEndingUnlocked is true
```

The hidden layer must be optional. The main game must remain beatable without finding it.

Secret design rule:

- clue 1 hints that moon marks matter
- clue 2 hints that a route marker or switch can move
- clue 3 confirms the hidden wall after the switch is pressed

## Never-Finished Mansion Add-On

This is an optional deeper layer in the full game plan. It should be fictionalized and should not copy real mansion layouts, tour material, tragedies, exact branding, or copyrighted content.

Progression layers if implemented:

```text
Layer 1: Main Dungeon
Layer 2: Forgotten Underpass
Layer 3: Never-Finished Mansion
Layer 4: Hidden Conservatory
```

Unlock:

```text
player has Moon Toll Token
AND inspects the painted door / impossible wall in the Forgotten Underpass
```

Required mansion chain:

1. Enter the Never-Finished Mansion.
2. Inspect the Door-to-Nowhere.
3. Learn that fake doors point toward real passages.
4. Inspect the Staircase That Forgot.
5. Press the hidden stair button.
6. Solve the Repeating Hall.
7. Reach the Number Thirteen Room.
8. Find the Blueprint Key.
9. Defeat the Blueprint Warden.
10. Open the Blueprint Study.
11. Claim the Star Map Fragment.
12. Return to the Forgotten Underpass or main exit.

Optional deepest secret:

```text
Star Map Fragment
AND Hidden Conservatory discovered
AND Glass Rose found
```

Ending tiers:

- Normal Ending: Mapstone + exit.
- Secret Star Ending: Mapstone + Moon Toll Token + exit.
- Impossible Route Ending: Mapstone + Moon Toll Token + Star Map Fragment + exit.
- Impossible Route plus Conservatory line: Mapstone + Moon Toll Token + Star Map Fragment + Glass Rose + exit.

Mansion anti-soft-lock rules:

- Always preserve a return path to the Forgotten Underpass.
- Never consume or lose the Moon Toll Token incorrectly.
- Never let the Blueprint Key or Star Map Fragment become unreachable.
- Repeating Hall must have a bounded loop and clear escape behavior.
- Hidden Conservatory must be optional.
- Save/load must preserve mansion flags and recover invalid mansion positions safely.

## Core Systems

Movement:

- Turning changes facing only.
- Walls, unopened hidden walls, locked doors, and live monsters block movement.
- Soft-gated items and exits can allow standing on the tile while refusing the event.
- Moving backward is allowed in exploration and as a boss-dodge action.

Combat:

- Attack targets only the live monster directly ahead.
- Damage formula should remain simple and predictable.
- Basic enemies use shared combat logic.
- Signpost Ogre has a telegraphed Big Spin that can be dodged by retreating.
- Defeat applies a penalty and respawns safely; it must not create a dead saved state.

Save:

- Use localStorage key `rtaRoadsideRealmSave`.
- Save position, facing, map, stats, inventory, flags, counters, defeated monsters, collected items, opened doors, discovered tiles, recent log, completion, and badges.
- Validate saves before loading.
- Ignore corrupt saves without crashing.
- Debounce writes during rapid movement.
- Reset clears only the Realm save.
- If the mansion add-on is implemented, save mansion flags, mansion item state, mansion enemy defeats, and invalid-tile recovery state.

Target starting stats:

```text
HP 18
Attack 4
Defense 1
Level 1
Gold 0
```

Target enemy roles:

- Dust Goblin: first readable fight.
- Map Bat: low-damage evasive enemy.
- Toll Troll: gate-area toughness check.
- Cone Imp: mid-map pressure.
- Snack Mimic: optional treasure surprise.
- Signpost Ogre: main boss with Big Spin.
- Moonlit Warden: optional secret guardian.

## UI And Accessibility

Required UI regions:

- title/start/continue panel
- first-person canvas
- status row
- inventory area
- scrolling text log
- touch controls
- optional minimap
- ending summary

Directional pad:

- Up moves forward.
- Left turns left.
- Right turns right.
- Down moves backward or retreats during boss combat.
- Inspect, Attack, Item, Map, and Save sit near the D-pad as separate action controls.
- Touch targets should be at least 48px by 48px.
- D-pad, keyboard, and debug actions must call the same game action handlers.

Visual target:

- chunky handmade roadside-fantasy arcade panel
- first-person canvas with layered ceiling, floor, corridor walls, side hints, items, monsters, doors, compass, and optional minimap
- no external assets required; use canvas primitives and optional inline SVG only
- high contrast palette must keep walls, floors, monsters, items, and doors distinct

Accessibility requirements:

- Canvas has a useful `aria-label`.
- Important events are written outside the canvas.
- Current status uses `aria-live="polite"`.
- All controls are keyboard reachable.
- Keyboard shortcuts only apply while Roadside Realm is active.
- High contrast changes DOM and canvas visuals.
- Reduced motion disables slide/bob animation.
- Large text and 200% zoom remain usable.
- No information is conveyed by color alone.

Sprite direction:

- Dust Goblin: squat dusty figure with map-scrap shield.
- Map Bat: folded paper-map wings.
- Toll Troll: toll-post body with striped barrier club.
- Cone Imp: traffic-cone body with sign-pole spear.
- Snack Mimic: crinkled snack-bag treasure monster.
- Signpost Ogre: stacked road signs with rotating arrow arms.
- Moonlit Warden: crescent underpass guardian with moon-blue glow.

Item glyph direction:

- Rusty Road Key: motel key tag.
- Mapstone: glowing folded map tile.
- Moon Toll Token: crescent coin.
- Apple Juice Potion: small bottle with apple label.
- Snack Charm: wrapped snack charm.
- Postcard Shield: postcard-shaped shield.
- Compass Sticker: round direction sticker.
- Lucky Toll Coin: coin with toll booth icon.

## Build Order

1. Integration shell.
2. Data model and validator.
3. Movement and collision.
4. Canvas first-person view.
5. Inspect, items, doors, healing, switch, and hidden wall.
6. Combat and boss behavior.
7. Normal ending, hidden layer, and true ending.
8. Save/load/reset, accessibility polish, service worker update, and QA doc.

Each phase should end with a playable checkpoint.

## QA Before Release

Verify:

- Roadside Realm card appears and launches.
- Existing app modes still launch.
- Canvas renders with no console errors.
- Touch and keyboard controls work.
- Movement, collision, inspect, item pickup, locked door, healing, and treasure work.
- Normal enemies, boss, defeat, rewards, and level-up work.
- Mapstone gates normal ending.
- Hidden room and Forgotten Underpass are discoverable through clues.
- Moon Toll Token gates true ending.
- Save, continue, reset, corrupt-save handling, and offline reload work.
- Service worker cache list and version are updated.
- Accessibility, high contrast, large text, reduced motion, mobile portrait, and mobile landscape pass.

One-pass release checks:

- Normal ending can be completed without secrets.
- True ending can be completed in the same run if the player finds the secret before final exit.
- The boss cannot be bypassed for the Mapstone.
- Player defeat cannot soft-lock the game.
- Every required mechanic has finished copy, UI feedback, and an edge-case behavior.
- No placeholder screens, stub controls, or TODO-only mechanics remain.

## Known Decisions To Confirm During Build

- Whether to use the app's global summary screen or a Realm-owned summary.
- Whether `roadside-realm-art.js` is needed immediately.
- Whether quest keys stay in inventory after use.
- Whether a completed normal-ending save can continue for secrets or requires reset.
- Where the visible app version should be bumped.
