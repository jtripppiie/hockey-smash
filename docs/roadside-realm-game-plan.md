# Roadside Realm V1.0 Game Plan

This document is the organized source of truth for building **Roadside Realm**, a complete first-person grid-based dungeon crawler mini-game inside the Road Trip Adventures app.

Use the sections in this order:

1. **Implementation Brief** — the build assignment, requirements, architecture, controls, QA, and definition of done.
2. **Expanded Game Content** — richer room, enemy, item, puzzle, objective, UI, and replay ideas to pull from while polishing V1.0.
3. **Exact Build Detail** — concrete maps, event tables, item catalogue, monster behavior, balancing, scoring, and ending copy.
4. **Technical Appendix** — state machine, render pseudocode, save schema, optional rooms, dialogue banks, art specs, and exhaustive QA scripts.
5. **Production Expansion Notes** — deeper implementation detail for player experience, systems, data contracts, polish, and maintainer handoff.
6. **One-Pass Perfect V1.0 Target** — final-level detail for shipping a complete, cohesive game without leaving "later polish" as hidden work.
7. **Never-Finished Mansion Add-On** — optional deeper mansion-inspired chapter, puzzle chain, items, enemies, endings, and QA.

## Organization Notes

- Removed repeated copies of **Roadside Realm — Full Technical & Content Expansion (Part 2)** and kept the most complete copy once as the Technical Appendix.
- Promoted **AI Agent Prompt: Build Roadside Realm V1.0** to the front because it is the clearest implementation brief.
- Kept the expanded content add-on and exact build detail sections because they contain useful non-duplicate content for scope, polish, maps, balancing, and flavor.
- The older draft prompt was superseded by the V1.0 prompt and removed from the main flow to keep this file build-ready.
- Maintain the companion summary at `docs/roadside-realm-summary.md` whenever this spec changes in a way that affects scope, architecture, flow, controls, QA, or launch instructions.
- If exported images are needed, use `docs/roadside-realm-image-spec.md` for exact asset sizes, DPI/source guidance, filenames, sprite sheets, and export rules.

---

## Table of Contents

- [1. Implementation Brief](#1-implementation-brief)
- [2. Expanded Game Content](#2-expanded-game-content)
- [3. Exact Build Detail](#3-exact-build-detail)
- [4. Technical Appendix](#4-technical-appendix)
- [5. Production Expansion Notes](#5-production-expansion-notes)
- [6. One-Pass Perfect V1.0 Target](#6-one-pass-perfect-v10-target)
- [7. Never-Finished Mansion Add-On](#7-never-finished-mansion-add-on)
- [8. Source Cleanup Log](#8-source-cleanup-log)

---


## 1. Implementation Brief

### AI Agent Prompt: Build Roadside Realm V1.0

#### One-Sentence Assignment

Build **Roadside Realm**, a complete original V1.0 first-person grid-based dungeon crawler mini-game inside the existing **Road Trip Adventures** repo.

This must be a real playable mini-game, not a demo.

---

### 0. Read This First

You are an AI coding agent working inside an existing static web app.

The user wants a complete V1.0 game similar in broad genre feel to old-school first-person dungeon crawlers and mobile grid-based RPGs, but it must be original.

Do **not** copy QuestLord’s protected content, name, story, exact UI, artwork, characters, maps, sounds, or assets.

Use only broad genre ideas:

```text
first-person dungeon view
grid movement
turning left/right
simple RPG stats
monsters
items
keys
locked doors
secrets
hidden room
optional hidden layer
boss
ending
```

The final product should feel like:

```text
A tiny retro fantasy dungeon crawler hidden inside a privacy-first road-trip activity app.
```

---

### 1. Absolute Requirements

The build must include all of these.

#### Core Game

- First-person dungeon view.
- Grid-based movement.
- Four-direction facing.
- Turn left.
- Turn right.
- Move forward.
- Optional move backward.
- Inspect action.
- Attack action.
- Use item action.
- Map toggle.
- Basic inventory.
- HP.
- Attack stat.
- Defense stat.
- Gold or score.
- At least one key.
- At least one locked door.
- At least one treasure.
- At least one healing item or healing tile.
- At least three normal encounters.
- At least one boss.
- Main quest item.
- Win condition.
- Normal ending.
- Summary screen.

#### Required Hidden Content

- At least one hidden room.
- Hidden room must contain meaningful reward.
- At least one hidden second layer / secret map / secret route.
- Hidden layer must be optional.
- Hidden layer must support a true/secret ending.
- The main game must be beatable without finding the hidden layer.
- The hidden layer must be discoverable with clues, not random guessing only.

#### Technical Requirements

- Static files only.
- Vanilla JavaScript only.
- No build step.
- No npm dependency.
- No backend.
- No accounts.
- No analytics.
- No tracking.
- No GPS.
- No geolocation.
- No remote API.
- No external asset loading.
- Must run on GitHub Pages.
- Must work with existing app structure.
- Must not break existing games.
- Must update service worker cache if the repo uses cached asset lists.
- Must update visible app version.

#### Accessibility Requirements

- Keyboard controls.
- Mobile touch controls.
- Large tap targets.
- Canvas has aria-label.
- Important game events appear in text outside the canvas.
- Status updates use aria-live.
- High contrast mode support.
- Large text mode support.
- Reduced motion support.
- No information conveyed by color alone.
- No required reaction timer.

---

### 2. Project Context

The existing app is **Road Trip Adventures**.

It is a passenger-focused road-trip game collection. It values:

```text
noticing the journey
laughing together
family-friendly fun
privacy
no accounts
no tracking
static website simplicity
accessibility
```

Roadside Realm must fit this identity.

Even though this is a dungeon crawler, it should not feel like a totally unrelated dark fantasy game. It should feel like a tiny fantasy adventure discovered during a road trip.

---

### 3. Creative Direction

#### Title

Use:

```text
Roadside Realm
```

#### Premise

During a road trip, passengers find an old roadside map kiosk with a strange glowing route marker. The kiosk opens into a tiny pocket dungeon called the Roadside Realm. The route home has been scrambled by the Signpost Ogre. The player must recover the Mapstone, restore the route, and escape.

#### Tone

Use this tone:

```text
retro
playful
slightly mysterious
cozy
family-friendly
road-trip themed
light fantasy
not scary
not grim
not violent
```

#### Visual Flavor

Use motifs like:

```text
old motel keys
route signs
road maps
map pins
toll gates
snack charms
dashboard compasses
postcards
moonlit underpasses
tiny roadside shrines
orange cones
travel stickers
faded billboards
```

#### Avoid

Do not use:

```text
blood
gore
horror
religious rituals
adult themes
real-world political content
copyrighted QuestLord content
online leaderboards
addictive daily streaks
loot boxes
ads
```

---

### 4. Two-Pass Design Requirement

This is the user’s major requirement.

The game must support at least **two meaningful passes/layers**.

#### Pass 1: Main Adventure

The first pass is the main goal path.

The player should be able to complete it in one normal playthrough without finding obscure secrets.

Required flow:

```text
start at map kiosk
learn controls
find Rusty Road Key
unlock Toll Gate
fight basic enemies
find healing item
reach boss area
defeat Signpost Ogre
claim Mapstone
return to exit
normal ending
```

This should take roughly:

```text
5 to 12 minutes
```

#### Pass 2: Secret Layer

The second pass/layer is hidden.

It can be found during the first playthrough or after getting the Mapstone.

It must include:

```text
hidden room
entry to Forgotten Underpass
secret enemy or guardian
Moon Toll Token
true-ending clue
true ending if completed
```

This should take roughly:

```text
3 to 8 extra minutes
```

It must not be required for normal completion.

The player should feel rewarded for discovering it.

---

### 5. Game Name and Story Text

#### Game Name

```text
Roadside Realm
```

#### Main Quest Name

```text
Find the Mapstone
```

#### Main Quest Description

```text
The old roadside map kiosk has swallowed the route. Find the Mapstone, defeat the Signpost Ogre, and return before the snack magic fades.
```

#### Secret Quest Name

```text
The Forgotten Underpass
```

#### Secret Quest Description

```text
A moon-shaped scratch marks a wall that should not be there. Find the hidden route beneath the kiosk and recover the Moon Toll Token.
```

#### Normal Ending

```text
You escaped the Roadside Realm with the Mapstone. The route is restored, the map kiosk clicks shut, and someone in the car earns first snack pick.
```

#### True Ending

```text
You found the Forgotten Underpass and restored the moonlit route. The Roadside Realm stamps your map with a secret star.
```

---

### 6. Files to Inspect

Before editing, inspect:

```text
AGENT.md
README.md
index.html
script.js
style.css
sw.js
scripts/audit-game-quality.js
```

Inspect existing game patterns:

```text
js/games/hide-seek-data.js
js/games/hide-seek-art.js
js/games/pong-data.js
js/games/pong-art.js
```

Look for:

```text
how modes are added
how sections are shown/hidden
how score summaries work
how fullscreen helper works
how accessibility settings are represented
how reduce motion/high contrast classes are applied
how service worker cache is managed
```

Do not guess if the existing app already has a pattern.

---

### 7. Files to Create

Create:

```text
js/games/roadside-realm-data.js
js/games/roadside-realm.js
```

Optional later if art becomes large:

```text
js/games/roadside-realm-art.js
```

Recommended first pass:

```text
Do not create roadside-realm-art.js yet unless roadside-realm.js becomes too large.
```

---

### 8. Files to Modify

Modify:

```text
index.html
script.js
style.css
sw.js
scripts/audit-game-quality.js
```

#### Required `index.html` changes

Add mode card.

Recommended location:

```text
Bonus section
```

Suggested card:

```html
<button class="option-card" data-category="realm">
  <span class="option-emoji" aria-hidden="true">🗝️</span>
  <span class="option-title">Roadside Realm</span>
  <span class="mode-pill scored">Quest</span>
</button>
```

Add a new section:

```html
<section id="realm-game" hidden>
  ...
</section>
```

Add script tags before `script.js`:

```html
<script src="js/games/roadside-realm-data.js"></script>
<script src="js/games/roadside-realm.js"></script>
<script src="script.js"></script>
```

#### Required `script.js` changes

Keep changes minimal.

Wire the new mode into existing routing.

Possible integration:

```js
if (selectedCategory === 'realm') {
  startRoadsideRealmGame();
}
```

or:

```js
function startRoadsideRealmGame() {
  resetGame();
  showSection('realm');
  window.RTA_ROADSIDE_REALM.start({
    players,
    showSection,
    showSummary: showRealmSummary,
  });
}
```

Use the repo’s actual conventions.

Avoid putting the whole game into `script.js`.

#### Required `style.css` changes

Add styles for:

```text
realm-game
realm-canvas
realm-status-card
realm-stats
realm-inventory
realm-log
realm-controls
realm-map-panel
realm-action-button
realm-danger
realm-success
realm-secret
realm-fullscreen
high-contrast realm styles
large-text realm styles
reduce-motion realm styles
```

#### Required `sw.js` changes

If the service worker has a cache version:

```text
bump it
```

If it has a file list:

```text
add js/games/roadside-realm-data.js
add js/games/roadside-realm.js
```

If you add art file:

```text
add js/games/roadside-realm-art.js
```

#### Required audit change

Add validation for the new game data if practical.

At minimum validate:

```text
data object exists
maps exist
start map exists
map rows are rectangular
map dimensions match rows
start position is walkable
hidden room exists
hidden layer exists
main goal item exists
boss exists
normal exit exists
no duplicate item IDs
no duplicate monster IDs
```

---

### 9. Architecture

Use global namespaces, but keep them contained.

#### Data namespace

```js
window.RTA_ROADSIDE_REALM_DATA = { ... };
```

#### Game namespace

```js
window.RTA_ROADSIDE_REALM = {
  start,
  stop,
  reset,
  save,
  load,
};
```

Use an IIFE:

```js
(function () {
  const DATA = window.RTA_ROADSIDE_REALM_DATA;

  let state = null;
  let elements = {};

  function start(options = {}) {}
  function stop() {}
  function reset() {}
  function save() {}
  function load() {}

  window.RTA_ROADSIDE_REALM = {
    start,
    stop,
    reset,
    save,
    load,
  };
})();
```

Do not create many globals.

---

### 10. Suggested Game Section Markup

Add this or adapt to existing conventions.

```html
<section id="realm-game" hidden>
  <div class="mode-header">
    <div>
      <h2 id="realm-heading">Roadside Realm</h2>
      <p id="realm-intro">
        Explore a tiny first-person dungeon hidden inside a roadside map kiosk.
      </p>
      <p class="privacy-note">
        Local-only quest. No accounts, no tracking, no location access.
      </p>
    </div>
    <div id="realm-score" class="emoji-target" aria-label="Roadside Realm status">
      Floor 1
    </div>
  </div>

  <article class="trivia-card realm-status-card">
    <span id="realm-phase" class="challenge-badge">Quest</span>
    <h3 id="realm-title">Find the Mapstone</h3>
    <p id="realm-status" class="hunt-status" aria-live="polite">
      Move forward, turn, inspect suspicious walls, and survive the dungeon.
    </p>
  </article>

  <div class="realm-layout">
    <div class="realm-view-wrap">
      <canvas
        id="realm-canvas"
        class="realm-canvas"
        width="720"
        height="420"
        aria-label="First-person dungeon view"
      ></canvas>
      <div id="realm-screen-reader-state" class="visually-hidden" aria-live="polite"></div>
    </div>

    <aside class="realm-side-panel">
      <div id="realm-stats" class="realm-stats" aria-live="polite"></div>
      <div id="realm-inventory" class="realm-inventory" aria-label="Inventory"></div>
      <div id="realm-minimap" class="realm-minimap" aria-label="Discovered map"></div>
    </aside>
  </div>

  <ol id="realm-log" class="realm-log" aria-label="Adventure log"></ol>

  <div class="realm-controls" aria-label="Roadside Realm controls">
    <button id="realm-turn-left" class="secondary-button" type="button">Turn Left</button>
    <button id="realm-forward" class="primary-button" type="button">Forward</button>
    <button id="realm-turn-right" class="secondary-button" type="button">Turn Right</button>
    <button id="realm-back" class="secondary-button" type="button">Back</button>
    <button id="realm-inspect" class="secondary-button" type="button">Inspect</button>
    <button id="realm-attack" class="secondary-button" type="button">Attack</button>
    <button id="realm-use" class="secondary-button" type="button">Use Item</button>
    <button id="realm-map" class="secondary-button" type="button" aria-pressed="true">Map</button>
  </div>

  <div class="adventure-actions">
    <button id="realm-continue" class="secondary-button" type="button" hidden>Continue Quest</button>
    <button id="realm-save" class="secondary-button" type="button">Save Quest</button>
    <button id="realm-reset" class="secondary-button" type="button">Reset Quest</button>
    <button id="realm-fullscreen" class="secondary-button" type="button">Full Screen</button>
    <button id="realm-finish" class="secondary-button" type="button">Finish Quest</button>
  </div>
</section>
```

If the app already uses a visually hidden class, reuse it. If not, create one.

---

### 11. Data Schema

Create this in:

```text
js/games/roadside-realm-data.js
```

Use this structure:

```js
(function () {
  window.RTA_ROADSIDE_REALM_DATA = {
    version: '1.0.0',
    title: 'Roadside Realm',
    startMap: 'map-kiosk-dungeon',
    start: {
      mapId: 'map-kiosk-dungeon',
      x: 1,
      y: 10,
      facing: 'north',
    },
    quests: {},
    items: {},
    monsters: {},
    maps: {},
  };
})();
```

---

### 12. Map Coordinate Rules

Use `x,y` coordinates.

Rules:

```text
x starts at 0 on the left.
y starts at 0 at the top.
tiles[y][x] gives the tile character.
```

Facing directions:

```js
const DIRECTIONS = ['north', 'east', 'south', 'west'];
```

Direction vectors:

```js
north: { x: 0, y: -1 }
east:  { x: 1, y: 0 }
south: { x: 0, y: 1 }
west:  { x: -1, y: 0 }
```

---

### 13. Tile Legend

Use these tile characters:

```text
# wall
. floor
P start
K key/item
D locked door
T treasure
H hidden wall
S secret switch
M monster
B boss
G goal item
E exit
F healing fountain
U stairs down / hidden layer entrance
R stairs up / return
```

Do not rely only on the tile character. Use event metadata for exact item/monster IDs.

---

### 14. Recommended Main Map

Use a real playable map. The agent may tune it, but it must remain solvable.

Suggested `12x12` map:

```js
tiles: [
  '############',
  '#....M....E#',
  '#.####.###.#',
  '#.#..T...#.#',
  '#.#.####.#.#',
  '#...#K...#.#',
  '###.#.####.#',
  '#...#....#B#',
  '#.#####D.#G#',
  '#S..H....#.#',
  '#P..M..F...#',
  '############'
]
```

Coordinate notes:

```text
P at x=1, y=10
S at x=1, y=9
H at x=4, y=9
K at x=5, y=5
D at x=6, y=8
F at x=7, y=10
B at x=10, y=7
G at x=10, y=8
E at x=10, y=1
```

Important: verify this map is actually solvable. If not, adjust it.

Map purpose:

```text
Player starts near bottom.
Player can explore lower corridors.
Player finds key.
Player unlocks door.
Player reaches boss.
Player gets Mapstone.
Player exits through E.
Secret switch opens hidden wall H.
Hidden room leads to underpass.
```

---

### 15. Recommended Hidden Map

Suggested `8x8` map:

```js
tiles: [
  '########',
  '#R..M..#',
  '#.##.#.#',
  '#..T.#.#',
  '##.#.#.#',
  '#..#W#.#',
  '#..G...#',
  '########'
]
```

Legend additions:

```text
R return stairs
W Moonlit Warden
G Moon Toll Token / true ending clue
T secret treasure
```

Coordinate notes:

```text
R at x=1, y=1
W at x=4, y=5
G at x=3, y=6 or x=5, y=6 depending final path
```

Important: tune this map so it is solvable and not too long.

---

### 16. Recommended Items

Define items like this:

```js
items: {
  'rusty-road-key': {
    id: 'rusty-road-key',
    name: 'Rusty Road Key',
    type: 'key',
    description: 'Opens the old Toll Gate.',
  },
  'snack-charm': {
    id: 'snack-charm',
    name: 'Snack Charm',
    type: 'consumable',
    heal: 10,
    description: 'A tiny charm shaped like a snack bag. Restores 10 HP.',
  },
  'apple-juice-potion': {
    id: 'apple-juice-potion',
    name: 'Apple Juice Potion',
    type: 'consumable',
    heal: 8,
    description: 'Restores 8 HP. Road trip approved.',
  },
  'mapstone': {
    id: 'mapstone',
    name: 'Mapstone',
    type: 'quest',
    description: 'The missing heart of the roadside map.',
  },
  'moon-toll-token': {
    id: 'moon-toll-token',
    name: 'Moon Toll Token',
    type: 'quest',
    secret: true,
    description: 'A silver token from the Forgotten Underpass.',
  }
}
```

---

### 17. Recommended Monsters

```js
monsters: {
  'dust-goblin': {
    id: 'dust-goblin',
    name: 'Dust Goblin',
    hp: 8,
    attack: 2,
    defense: 0,
    xp: 2,
    gold: 1,
    text: 'A Dust Goblin rattles an old motel key.',
  },
  'map-bat': {
    id: 'map-bat',
    name: 'Map Bat',
    hp: 6,
    attack: 3,
    defense: 0,
    xp: 2,
    gold: 1,
    text: 'A Map Bat flutters out from behind a torn route sign.',
  },
  'toll-troll': {
    id: 'toll-troll',
    name: 'Toll Troll',
    hp: 13,
    attack: 4,
    defense: 1,
    xp: 4,
    gold: 3,
    text: 'A Toll Troll blocks the old service road.',
  },
  'signpost-ogre': {
    id: 'signpost-ogre',
    name: 'Signpost Ogre',
    hp: 24,
    attack: 5,
    defense: 2,
    xp: 8,
    gold: 8,
    boss: true,
    text: 'The Signpost Ogre spins arrows in every direction.',
  },
  'moonlit-warden': {
    id: 'moonlit-warden',
    name: 'Moonlit Warden',
    hp: 18,
    attack: 5,
    defense: 2,
    xp: 7,
    gold: 5,
    secret: true,
    text: 'The Moonlit Warden guards the hidden underpass.',
  }
}
```

---

### 18. Recommended Events

Use event metadata.

Example:

```js
events: {
  '1,10': {
    type: 'start',
    text: 'The map kiosk glows behind you.',
  },
  '5,5': {
    type: 'item',
    itemId: 'rusty-road-key',
    once: true,
    text: 'A Rusty Road Key hangs from a bent route marker.',
  },
  '6,8': {
    type: 'lockedDoor',
    requiredItem: 'rusty-road-key',
    openFlag: 'tollGateOpen',
    text: 'The Toll Gate is locked.',
    openText: 'The Rusty Road Key turns. The Toll Gate lifts.',
  },
  '1,9': {
    type: 'secretSwitch',
    flag: 'secretSwitchPressed',
    text: 'You press a loose map pin. Somewhere, a wall clicks.',
  },
  '4,9': {
    type: 'hiddenWall',
    requiredFlag: 'secretSwitchPressed',
    openFlag: 'secretWallOpen',
    text: 'A plain wall. Or is it?',
    clueText: 'A moon-shaped scratch glows on the wall.',
    openText: 'The hidden wall slides open.',
  },
  '10,7': {
    type: 'monster',
    monsterId: 'signpost-ogre',
    boss: true,
  },
  '10,8': {
    type: 'item',
    itemId: 'mapstone',
    once: true,
    requiredFlag: 'bossDefeated',
    lockedText: 'The Mapstone is sealed until the Signpost Ogre is defeated.',
    text: 'The Mapstone hums like a dashboard compass.',
  },
  '10,1': {
    type: 'exit',
    requiredItem: 'mapstone',
    text: 'The exit glows with route-marker light.',
  }
}
```

Adjust coordinates to match the final map.

---

### 19. State Model

Use a complete state object.

```js
function createDefaultState() {
  return {
    version: DATA.version,
    started: true,
    won: false,
    ending: null,
    activeMapId: DATA.start.mapId,
    player: {
      x: DATA.start.x,
      y: DATA.start.y,
      facing: DATA.start.facing,
      hp: 20,
      maxHp: 20,
      attack: 4,
      defense: 1,
      level: 1,
      xp: 0,
      gold: 0,
      keys: 0,
      inventory: [],
    },
    flags: {
      tollGateOpen: false,
      secretSwitchPressed: false,
      secretWallOpen: false,
      underpassUnlocked: false,
      underpassFound: false,
      mapstoneFound: false,
      bossDefeated: false,
      moonTokenFound: false,
      trueEndingUnlocked: false,
    },
    counters: {
      steps: 0,
      monstersDefeated: 0,
      treasuresFound: 0,
      secretsFound: 0,
      defeats: 0,
      attacks: 0,
      inspections: 0,
    },
    defeatedMonsters: {},
    collectedItems: {},
    openedDoors: {},
    discovered: {},
    log: [],
  };
}
```

---

### 20. Movement Rules

#### Turn Left

```js
facing = previous direction in DIRECTIONS
```

#### Turn Right

```js
facing = next direction in DIRECTIONS
```

#### Move Forward

1. Compute tile ahead.
2. If wall: block.
3. If hidden wall not open: block, give clue if discovered.
4. If locked door: block unless unlocked.
5. If monster: block and warn.
6. If boss: block and warn.
7. Else move.
8. Increment steps.
9. Mark discovered.
10. Resolve tile event if automatic.
11. Render.
12. Save.

#### Move Backward

Optional but recommended.

Same as forward, using opposite vector.

#### Collision

A tile is walkable if:

```text
floor
start
open door
opened hidden wall
collected treasure tile
defeated monster tile
goal tile after collected
exit tile
stairs
healing tile
```

A tile is blocked if:

```text
wall
locked door not open
hidden wall not open
living monster
living boss
```

---

### 21. Inspect Rules

Inspect should look at the tile directly ahead.

Examples:

#### Facing ordinary wall

```text
A dusty wall. Nothing unusual.
```

#### Facing hidden wall before switch

```text
The wall is plain, but a cool draft slips through the cracks.
```

#### Facing hidden wall after switch

```text
A moon-shaped scratch glows. The wall slides open.
```

#### Facing locked door without key

```text
The Toll Gate is locked. Somewhere nearby, a road key is waiting.
```

#### Facing locked door with key

```text
The Rusty Road Key turns. The Toll Gate lifts.
```

#### Facing monster

```text
A Dust Goblin blocks the way. Attack to clear the path.
```

#### Facing treasure

```text
A snack tin glows on the floor.
```

#### Facing exit without Mapstone

```text
The exit refuses to open. The Mapstone is still missing.
```

#### Facing exit with Mapstone

```text
The route glows. Step forward to leave the Roadside Realm.
```

---

### 22. Combat Rules

Combat is turn-based and simple.

#### Attack Flow

When the player attacks a monster in the tile ahead:

1. Player deals damage.
2. Log damage.
3. If monster HP <= 0:
   - mark monster defeated
   - give XP
   - give gold
   - set boss flag if boss
   - do not monster-counterattack
4. Else monster counterattacks.
5. If player HP <= 0:
   - call player defeat flow
6. Render and save.

#### Damage Formula

```js
function rollDamage(attackerAttack, defenderDefense) {
  const roll = Math.floor(Math.random() * 3); // 0, 1, 2
  return Math.max(1, attackerAttack + roll - defenderDefense);
}
```

#### Boss

The Signpost Ogre should be beatable with normal stats and one healing item.

Boss should not require grinding.

#### Player Defeat

Do not hard-reset the entire game.

Use gentle penalty:

```text
You got overwhelmed and woke near the map kiosk.
```

Effects:

```js
player.hp = Math.max(5, Math.floor(player.maxHp / 2));
player.x = DATA.start.x;
player.y = DATA.start.y;
player.facing = DATA.start.facing;
player.mapId = DATA.start.mapId;
counters.defeats += 1;
gold = Math.max(0, gold - 1);
```

Do not remove key items.

---

### 23. Inventory Rules

Inventory should support:

- showing items
- using consumables
- checking quest item ownership
- not using key items incorrectly

#### Item acquisition

When picking up item:

```js
state.player.inventory.push(itemId);
state.collectedItems[eventId] = true;
```

If `type: key`, either inventory item or key count is okay.

Prefer inventory item for clarity.

#### Use Item

If player has healing item and HP is below max:

```text
Use first healing item.
Restore HP.
Remove item.
Log message.
```

If no usable item:

```text
No usable item right now.
```

Quest items should not be consumed.

---

### 24. XP and Leveling

Keep leveling simple.

Option A: no leveling, only XP shown.

Option B: simple level up.

Recommended V1.0:

```text
simple level up at XP 6 and XP 14
```

Example:

```js
const LEVELS = [
  { level: 1, xp: 0, maxHp: 20, attack: 4, defense: 1 },
  { level: 2, xp: 6, maxHp: 24, attack: 5, defense: 1 },
  { level: 3, xp: 14, maxHp: 28, attack: 6, defense: 2 },
];
```

On level up:

```text
Level up! Max HP and attack improved.
```

Restore a little HP:

```js
player.hp = Math.min(player.maxHp, player.hp + 6);
```

Do not overcomplicate.

---

### 25. Main Win Logic

Normal win occurs when:

```js
hasItem('mapstone') && player steps onto exit tile
```

Then:

```js
state.won = true;
state.ending = state.flags.trueEndingUnlocked && hasItem('moon-toll-token')
  ? 'true'
  : 'normal';
```

Show summary.

If using existing global summary section:

```js
showSection('summary')
summaryText.textContent = ...
summaryList.innerHTML = ...
```

If the game owns its own summary, keep style consistent.

---

### 26. True Ending Logic

True ending requires:

```text
Mapstone
Moon Toll Token
Forgotten Underpass found/completed
exit reached
```

Set:

```js
flags.trueEndingUnlocked = true
```

after completing hidden layer objective.

True ending should not trigger just because player opened a hidden wall.

---

### 27. Secret Discovery Design

The secret must have hints.

Add at least three clue opportunities.

Possible clues:

#### Clue 1 near start

```text
A faded sticker says: “Moon routes are not printed on normal maps.”
```

#### Clue 2 near switch

```text
One map pin is loose.
```

#### Clue 3 near hidden wall

```text
The wall has a tiny moon-shaped scratch.
```

This makes the hidden room feel fair.

---

### 28. Hidden Room

Hidden room should include:

```text
Moon Toll Token OR entrance to Forgotten Underpass
secret lore sign
bonus treasure
```

Example hidden room log:

```text
A hidden room opens behind the map wall.
A silver token rests in an old toll basket.
A sign reads: “The old route runs below the road.”
```

---

### 29. Forgotten Underpass

This is a second map.

Requirements:

- Small.
- Optional.
- Has a different visual palette.
- Contains Moonlit Warden.
- Contains Moon Toll Token or true ending clue.
- Has return stairs.

Visual palette:

```text
deep blue
moon silver
dark teal
soft yellow road lines
```

No horror. Make it mysterious.

---

### 30. Rendering Plan

Do not use WebGL.

Implement a simple first-person renderer.

#### Basic Approach

Draw the view in layers based on the next 3 cells ahead.

For each depth:

```text
depth 0 = current adjacent tile
depth 1 = one tile farther
depth 2 = two tiles farther
```

Draw trapezoids/rectangles to suggest walls.

Simpler acceptable version:

- Draw ceiling/sky.
- Draw floor.
- Draw far rectangle for tile ahead.
- Draw side wall panels.
- Draw front wall if blocked.
- Draw door if ahead.
- Draw monster sprite if ahead.
- Draw item/treasure icon if ahead.
- Draw compass and small text.

A simple readable view is better than a broken raycaster.

#### Needed helpers

```js
function drawRealm() {}
function drawDungeonView(ctx) {}
function drawWall(ctx, depth, side) {}
function drawDoor(ctx, depth) {}
function drawMonster(ctx, monster, depth) {}
function drawTreasure(ctx, item, depth) {}
function drawCompass(ctx) {}
function drawMinimap() {}
```

---

### 31. Canvas Rendering Details

Canvas size:

```text
720x420
```

Use CSS max-width 100%.

#### Background

Normal map:

```text
ceiling: deep teal
floor: warm tan
walls: blue-gray
trim: orange/gold
```

Hidden map:

```text
ceiling: moon navy
floor: dark teal
walls: blue-violet
trim: silver/gold
```

#### Wall distance rectangles

Use rectangles like:

```js
const DEPTH_RECTS = [
  { x: 80, y: 40, w: 560, h: 340 },
  { x: 160, y: 82, w: 400, h: 250 },
  { x: 240, y: 124, w: 240, h: 166 },
];
```

Draw farthest first, nearest last.

#### Front tile

If tile ahead is blocked:

- draw front wall or locked door.
- draw label/icon.

If tile ahead is open:

- draw corridor opening.

#### Monster

Draw if monster is directly ahead and alive.

Use simple sprite:

- body silhouette
- eyes
- small road sign accessory
- name label

#### Item

Draw if item or treasure directly ahead.

Use glowing chest/lunchbox/mapstone icon.

---

### 32. Minimap

Recommended V1.0 minimap.

Rules:

- Show discovered tiles only.
- Current map only.
- Player marker.
- Facing arrow.
- Hidden tiles hidden until discovered.
- Secret map hidden until entered.

Implementation:

```js
function markDiscovered(mapId, x, y) {}
function renderMinimap() {}
```

Mark:

- current tile
- tile ahead
- optionally adjacent tiles

Use HTML grid or canvas. HTML is fine.

Symbols:

```text
■ wall/discovered boundary
· floor
▲ player
? unknown
★ goal discovered
```

For accessibility, add text:

```text
Map: You are at row 10, column 1, facing north.
```

---

### 33. Text Log

The text log is critical.

Show last 6 to 8 events.

Use `<ol>` or `<ul>`.

Newest can be first or last, but be consistent.

Function:

```js
function addLog(message, type = 'info') {
  state.log.unshift({ message, type, time: Date.now() });
  state.log = state.log.slice(0, 8);
  renderLog();
}
```

Types:

```text
info
success
danger
secret
combat
item
```

Do not rely only on type color.

---

### 34. Save / Load

Use:

```js
const SAVE_KEY = 'rtaRoadsideRealmSave';
```

#### Save

```js
function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
```

Catch errors.

#### Load

```js
function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  // parse safely
}
```

Validate loaded state before using.

If invalid:

```text
Start new quest and log that save could not be loaded.
```

#### Reset

Confirm if existing app allows confirm. If not, reset directly.

```js
localStorage.removeItem(SAVE_KEY);
state = createDefaultState();
renderAll();
```

#### Auto-save

Call save after:

```text
move
item pickup
door unlock
secret found
monster defeated
map transition
win
manual save
```

Do not save every animation frame.

---

### 35. Fullscreen

Use existing immersive helper if available in `script.js`.

If not easily accessible from the new module, keep fullscreen simple.

The Full Screen button should:

- try to fullscreen the `realm-game` section or canvas wrapper.
- if unavailable, show status:

```text
Full screen is not available in this browser.
```

Controls must remain visible.

---

### 36. Keyboard Controls

Add keydown listener when game is active.

Do not hijack keys outside Roadside Realm.

```js
function handleKeydown(event) {
  if (!isActive()) return;

  switch (event.key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      turnLeft();
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      turnRight();
      break;
    case 'ArrowUp':
    case 'w':
    case 'W':
      moveForward();
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      moveBackward();
      break;
    case ' ':
    case 'Enter':
      inspect();
      break;
    case 'f':
    case 'F':
      attack();
      break;
    case 'i':
    case 'I':
      useItem();
      break;
    case 'm':
    case 'M':
      toggleMap();
      break;
  }
}
```

Prevent default only for keys used by the game while active.

---

### 37. Buttons

Bind:

```js
turnLeftButton.addEventListener('click', turnLeft)
forwardButton.addEventListener('click', moveForward)
turnRightButton.addEventListener('click', turnRight)
backButton.addEventListener('click', moveBackward)
inspectButton.addEventListener('click', inspect)
attackButton.addEventListener('click', attack)
useButton.addEventListener('click', useItem)
mapButton.addEventListener('click', toggleMap)
saveButton.addEventListener('click', saveGame)
resetButton.addEventListener('click', resetGame)
finishButton.addEventListener('click', showSummaryOrExit)
```

---

### 38. Status Rendering

Render status cards after every action.

#### Stats example

```text
HP 18/20 · Level 1 · Gold 3 · Facing North
```

#### Objective example

Before Mapstone:

```text
Objective: Find the Mapstone.
```

After Mapstone:

```text
Objective: Return to the exit.
```

After secret clue:

```text
Secret: A hidden route may run beneath the map kiosk.
```

#### Inventory example

```text
Inventory: Rusty Road Key, Snack Charm
```

If empty:

```text
Inventory: empty
```

---

### 39. Combat Message Examples

Use varied but short messages.

Player attacks:

```text
You bonk the Dust Goblin for 4.
You swat the Map Bat for 3.
You smack the Toll Troll’s sign for 5.
```

Monster attacks:

```text
The Dust Goblin bumps you for 2.
The Map Bat flutters into your backpack for 3.
The Toll Troll thumps the floor for 4.
```

Defeat enemy:

```text
The Dust Goblin vanishes into a puff of road dust.
The Map Bat folds itself back into the old map.
The Toll Troll drops 3 gold.
```

Boss:

```text
The Signpost Ogre spins wildly.
The Signpost Ogre points every direction at once.
The Signpost Ogre drops the route marker.
```

Player defeat:

```text
You wake up beside the glowing map kiosk. The dungeon gives you another chance.
```

---

### 40. Item Message Examples

Rusty Road Key:

```text
You found the Rusty Road Key.
```

Snack Charm:

```text
You found a Snack Charm. It smells faintly like victory and pretzels.
```

Apple Juice Potion:

```text
You found an Apple Juice Potion.
```

Mapstone:

```text
You found the Mapstone. The exit route begins to glow.
```

Moon Toll Token:

```text
You found the Moon Toll Token. A secret star appears on your map.
```

---

### 41. Door and Secret Messages

Locked door no key:

```text
The Toll Gate is locked. A rusty key should open it.
```

Unlock door:

```text
The Rusty Road Key turns. The Toll Gate lifts with a friendly clank.
```

Secret switch:

```text
You press the loose map pin. Somewhere nearby, a hidden wall clicks.
```

Hidden wall before switch:

```text
A cool draft slips through the wall, but it will not move.
```

Hidden wall after switch:

```text
The moon scratch glows. The wall slides open.
```

Underpass entry:

```text
A stairway drops into the Forgotten Underpass.
```

---

### 42. Balance Rules

Main quest should be beatable.

Recommended:

```text
Player HP: 20
Player attack: 4
Player defense: 1
Potion: +8 HP
Snack Charm: +10 HP or auto-heal once
Dust Goblin HP: 8
Map Bat HP: 6
Toll Troll HP: 13
Signpost Ogre HP: 24
Moonlit Warden HP: 18
```

Put at least one heal before boss.

Do not trap player with no healing and unavoidable boss.

Do not make boss require perfect RNG.

---

### 43. Soft-Lock Prevention

The game must avoid soft locks.

Prevent:

```text
required key behind locked door
required boss unreachable
exit unreachable
hidden layer no return path
player saved inside wall
player saved on blocked tile
required item collected but not saved
monster defeated but respawned on load
door opened but relocked on load
hidden wall state lost on save/load
true ending triggering early
normal ending blocked by optional secret
```

On load, validate player tile. If invalid, move player to map start.

---

### 44. Summary Screen

At the end, show:

```text
ending type
winner/quest result
steps taken
monsters defeated
treasures found
secrets found
defeats
score
prize idea
```

Normal summary:

```text
Roadside Realm Complete.
You escaped with the Mapstone.
Steps: 74.
Monsters defeated: 4.
Secrets found: 0.
Score: 850.
Prize idea: first snack pick.
```

True ending summary:

```text
Secret Star Ending.
You restored the moonlit route through the Forgotten Underpass.
Steps: 112.
Monsters defeated: 5.
Secrets found: 2.
Score: 2050.
Prize idea: choose the next road-trip game.
```

---

### 45. Score Formula

Use local-only score.

```js
function calculateScore() {
  return Math.max(0,
    state.counters.monstersDefeated * 50
    + state.counters.treasuresFound * 100
    + state.counters.secretsFound * 250
    + (state.flags.bossDefeated ? 500 : 0)
    + (state.flags.trueEndingUnlocked ? 1000 : 0)
    - state.counters.defeats * 100
  );
}
```

No online leaderboard.

---

### 46. CSS Requirements

Add classes.

```css
.realm-layout {}
.realm-view-wrap {}
.realm-canvas {}
.realm-side-panel {}
.realm-stats {}
.realm-inventory {}
.realm-minimap {}
.realm-log {}
.realm-controls {}
.realm-status-card {}
.realm-danger {}
.realm-success {}
.realm-secret {}
.realm-combat {}
```

#### Mobile

Use responsive layout.

On narrow screens:

```text
canvas full width
stats below canvas
controls in grid
buttons large
log readable
```

#### Controls grid

```css
.realm-controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}
```

#### Canvas

```css
.realm-canvas {
  width: 100%;
  max-width: 720px;
  aspect-ratio: 12 / 7;
}
```

#### High contrast

Add:

```css
.high-contrast .realm-canvas {
  border: 3px solid currentColor;
}
```

#### Large text

Ensure controls wrap.

#### Reduced motion

```css
.reduce-motion .realm-canvas {
  scroll-behavior: auto;
}
```

Most motion reduction will be JS-controlled.

---

### 47. Reduced Motion JS

Check existing app preference.

If body has class:

```text
reduce-motion
```

Then:

```js
const reduceMotion = document.body.classList.contains('reduce-motion');
```

Use it to reduce:

```text
shake
flash
pulse
animation frames
```

For V1.0, it is acceptable to use mostly static rendering and no heavy animations.

---

### 48. High Contrast JS/Canvas

Canvas should still be understandable in high contrast.

If body class:

```text
high-contrast
```

Use:

```text
stronger outlines
higher text contrast
simpler fills
```

Function:

```js
function isHighContrast() {
  return document.body.classList.contains('high-contrast');
}
```

---

### 49. Data Validation Function

Add an internal validator.

```js
function validateRealmData(data) {
  const errors = [];

  if (!data) errors.push('Missing data.');
  if (!data.maps || !Object.keys(data.maps).length) errors.push('No maps.');

  Object.values(data.maps || {}).forEach(map => {
    if (!map.id) errors.push('Map missing id.');
    if (!Array.isArray(map.tiles)) errors.push(`${map.id} missing tiles.`);
    const width = map.tiles && map.tiles[0] ? map.tiles[0].length : 0;
    map.tiles.forEach((row, index) => {
      if (row.length !== width) errors.push(`${map.id} row ${index} width mismatch.`);
    });
  });

  return errors;
}
```

If errors, show clear status and do not crash.

---

### 50. Testing / Debug Option

Add optional debug flag only for local testing.

Could be hidden behind query string:

```text
?realmDebug=1
```

Debug panel can show:

```text
mapId
x
y
facing
front tile
front event
flags
inventory
```

Do not expose scary developer UI to normal users unless harmless.

---

### 51. Service Worker Checklist

Before finishing:

- Add new JS files to cache list if needed.
- Bump cache version.
- Confirm app version badge changed.
- Confirm hard refresh loads new game.
- Confirm offline after first load still works if existing app supports it.

---

### 52. Manual QA Checklist

Create or update:

```text
docs/roadside-realm-qa.md
```

Include this checklist.

#### Launch

- App loads.
- Passenger gate works.
- Roadside Realm card appears.
- Mode opens.
- Canvas renders.
- No console errors.

#### Controls

- Touch buttons work.
- Keyboard controls work.
- Buttons are large enough.
- Back/home does not break game.
- Finish returns to summary or app flow.

#### Movement

- Walls block movement.
- Turning works.
- Facing direction updates.
- Forward movement works.
- Back movement works if implemented.
- Log updates.

#### Interactions

- Inspect wall works.
- Inspect locked door works.
- Key pickup works.
- Door unlock works.
- Healing item works.
- Treasure cannot be collected twice.

#### Combat

- Attack works.
- Monster takes damage.
- Monster counterattacks.
- Monster can be defeated.
- Boss can be defeated.
- Player defeat recovers gracefully.

#### Main Ending

- Mapstone can be found.
- Exit blocks player without Mapstone.
- Exit works with Mapstone.
- Normal ending appears.
- Summary is correct.

#### Hidden Room

- Hidden room not visible at start.
- Clue exists.
- Switch opens route.
- Hidden wall works.
- Hidden reward exists.
- Secret counted.

#### Hidden Layer

- Underpass entry works.
- Underpass map renders.
- Return works.
- Warden fight works.
- Moon Toll Token works.
- True ending unlocks.
- Hidden layer optional.

#### Save/Load

- Manual save works.
- Auto-save works.
- Refresh restores.
- Reset clears.
- Invalid save handled.

#### Accessibility

- Aria-live status works.
- Log contains important info.
- Large text works.
- High contrast works.
- Reduced motion works.
- Canvas has label.
- No color-only meaning.

#### Mobile

- Portrait works.
- Landscape works.
- Fullscreen works or fails gracefully.
- Controls visible in fullscreen.
- No tiny tap targets.

---

### 53. Build Order for Agent

Follow this exact order.

#### Phase 1: Integration Shell

1. Add data script file placeholder.
2. Add game script file placeholder.
3. Add section markup.
4. Add mode card.
5. Wire route.
6. Show blank Roadside Realm screen.

Commit/checkpoint idea:

```text
Add Roadside Realm shell
```

#### Phase 2: State and Data

1. Add data object.
2. Add main map.
3. Add hidden map.
4. Add items.
5. Add monsters.
6. Add createDefaultState.
7. Add data validation.

Checkpoint:

```text
Add Roadside Realm data model
```

#### Phase 3: Movement

1. Add direction helpers.
2. Add tile lookup.
3. Add walkability.
4. Add turn/move functions.
5. Add log.
6. Add basic rendering.

Checkpoint:

```text
Add grid movement
```

#### Phase 4: Canvas View

1. Draw dungeon background.
2. Draw walls/doors.
3. Draw item ahead.
4. Draw monster ahead.
5. Draw compass.
6. Draw minimap.

Checkpoint:

```text
Add first-person dungeon view
```

#### Phase 5: Interactions

1. Add inspect.
2. Add item pickup.
3. Add locked door.
4. Add healing.
5. Add secret switch.
6. Add hidden wall.

Checkpoint:

```text
Add dungeon interactions and secrets
```

#### Phase 6: Combat

1. Add monster state.
2. Add attack.
3. Add counterattack.
4. Add defeat.
5. Add rewards.
6. Add boss flag.

Checkpoint:

```text
Add turn-based combat
```

#### Phase 7: Win and Secret Layer

1. Add Mapstone.
2. Add normal exit.
3. Add underpass transition.
4. Add Moon Toll Token.
5. Add true ending.
6. Add summary.

Checkpoint:

```text
Add endings and hidden layer
```

#### Phase 8: Save and Polish

1. Add save/load/reset.
2. Add continue button.
3. Add CSS polish.
4. Add accessibility polish.
5. Add service worker update.
6. Add QA doc.

Checkpoint:

```text
Polish Roadside Realm V1
```

---

### 54. Definition of Done

The work is complete only when all are true:

```text
Roadside Realm card appears.
Roadside Realm launches.
Game renders a first-person dungeon.
Player can move and turn.
Player can inspect.
Player can collect items.
Player can unlock a door.
Player can fight monsters.
Player can defeat boss.
Player can collect Mapstone.
Player can reach normal ending.
Hidden room exists.
Hidden room has meaningful reward.
Hidden second layer exists.
Hidden second layer is optional.
True ending exists.
Save/continue works.
Reset works.
Touch controls work.
Keyboard controls work.
Accessibility status/log works.
High contrast/large text/reduce motion are respected.
No backend/tracking/accounts added.
Service worker updated.
App version bumped.
Existing games still launch.
No normal-play console errors.
QA checklist created or updated.
```

---

### 55. Do Not Do

Do not:

- clone QuestLord
- use QuestLord name
- use QuestLord assets
- copy QuestLord maps
- copy QuestLord UI exactly
- use external APIs
- install packages
- add a build process
- add backend services
- add accounts
- add analytics
- add tracking
- use GPS/geolocation
- add online leaderboards
- add ads
- add gore
- make it horror
- add addictive daily mechanics
- make drivers interact
- break existing app modes
- put all logic into script.js if separate file is reasonable
- make hidden layer required for normal ending
- make the main path too obscure
- leave the game as a prototype

---

### 56. Final Instruction to Agent

Build this as a real V1.0.

The user is not asking for a sketch, stub, or proof of concept.

The user wants a complete mini-game with:

```text
main path
hidden room
hidden second layer
normal ending
true ending
save system
mobile controls
keyboard controls
polish
QA
```

When finished, report:

1. Files changed.
2. Files created.
3. How to launch the game.
4. How to beat the main path.
5. How to find the hidden room.
6. How to trigger the true ending.
7. What QA was performed.
8. Any known limitations.

The final product should make a player say:

```text
Wait, this little road-trip app has a whole secret dungeon game in it?
```


---

## 2. Expanded Game Content

### Roadside Realm V1.0 — Expanded Game Content Add-On

#### Purpose of This Add-On

Expand the actual game, not just the implementation instructions.

Roadside Realm V1.0 should feel like a small but complete RPG adventure with:

```text
more rooms
more enemy variety
more items
more secrets
more environmental flavor
more puzzles
more optional discoveries
more replay value
a better hidden layer
a stronger final boss path
a true ending path
```

This should still remain achievable as a V1.0 static JavaScript mini-game.

Do not turn it into a huge RPG. Make it feel dense, polished, and complete.

---

### 1. Bigger Game Shape

Instead of feeling like one tiny map with a boss, Roadside Realm should feel like a compact adventure with **three connected zones**:

```text
Zone 1: Map Kiosk Dungeon
Zone 2: Tollgate Halls
Zone 3: Signpost Court
Secret Zone: Forgotten Underpass
```

These can be separate maps or sections of one larger map.

Recommended structure:

```text
Map 1: Map Kiosk Dungeon        Main intro / key / first enemies
Map 2: Tollgate Halls           Locked doors / puzzle / stronger enemies
Map 3: Signpost Court           Boss route / Mapstone / exit
Secret Map: Forgotten Underpass Optional hidden layer / true ending
```

For V1.0, this can still be implemented as **two or three small maps**, not a giant world.

---

### 2. Main Adventure Flow

The main path should have a clear adventure arc.

#### Act 1: Enter the Map Kiosk

Player starts near the glowing roadside map kiosk.

Main goals:

```text
learn movement
inspect walls
find first treasure
fight weak enemy
find Rusty Road Key
unlock first Toll Gate
```

Important feel:

```text
simple
welcoming
slightly mysterious
not punishing
```

Suggested events:

```text
A glowing route line points north.
A Dust Goblin rattles an old motel key.
A snack tin contains an Apple Juice Potion.
A faded sign says: "All roads are real somewhere."
```

---

#### Act 2: Tollgate Halls

This is the middle of the game.

Main goals:

```text
use key
learn locked-door logic
fight stronger enemy
solve simple route-marker puzzle
find Snack Charm
discover clue about hidden underpass
```

Important feel:

```text
more maze-like
slightly more strategic
still readable
```

Suggested events:

```text
A Toll Troll blocks the way.
A road sign points east, but the floor arrows point west.
A moon symbol appears on an old toll receipt.
A locked snack machine hums softly.
```

---

#### Act 3: Signpost Court

This is the final main route.

Main goals:

```text
reach boss room
defeat Signpost Ogre
collect Mapstone
return to exit
trigger normal ending
```

Important feel:

```text
finale
dramatic but silly
short boss buildup
clear main objective
```

Suggested events:

```text
The signs point in every direction at once.
The Mapstone glows behind the Signpost Ogre.
The exit route flickers on the wall.
```

---

#### Secret Act: Forgotten Underpass

This is optional.

Main goals:

```text
notice hidden clue
open hidden wall
enter underpass
fight Moonlit Warden
find Moon Toll Token
unlock true ending
```

Important feel:

```text
secret
rewarding
cooler color palette
deeper mystery
not required
```

Suggested events:

```text
The wall breathes a cool moonlit draft.
A service stair drops below the map kiosk.
Old route lines glow on the tunnel floor.
A sign reads: "Some roads only appear after you already know the way."
```

---

### 3. More Room Types

Add named room types so the dungeon feels like a place.

Each room can just be a region of the map, but the game should show room names in the HUD or log when entered.

#### Main Rooms

##### 1. Map Kiosk Entry

Purpose:

```text
starting room
tutorial
safe place
```

Flavor:

```text
A dusty roadside map kiosk glows behind cracked glass.
```

Possible interactions:

```text
inspect map kiosk
read first clue
return here after defeat
exit after Mapstone
```

---

##### 2. Route Marker Hall

Purpose:

```text
first corridor
teaches turning and inspecting
```

Flavor:

```text
Old route markers are nailed into the stone like trail signs.
```

Possible interactions:

```text
inspect route marker
find small clue
fight Dust Goblin
```

---

##### 3. Snack Shrine

Purpose:

```text
healing / item room
```

Flavor:

```text
A tiny shrine of road snacks sits beneath a flickering motel lamp.
```

Possible rewards:

```text
Snack Charm
Apple Juice Potion
gold
```

---

##### 4. Toll Gate

Purpose:

```text
first locked-door gate
```

Flavor:

```text
A striped barrier blocks the hall. The toll booth window is empty.
```

Requires:

```text
Rusty Road Key
```

---

##### 5. Detour Gallery

Purpose:

```text
small maze section
```

Flavor:

```text
Every sign says DETOUR, but none agree where the detour goes.
```

Gameplay:

```text
dead ends
optional treasure
enemy encounter
hidden clue
```

---

##### 6. Lost & Found Alcove

Purpose:

```text
optional treasure room
```

Flavor:

```text
A pile of lost road-trip objects sits under a sign that says CLAIMED BY THE REALM.
```

Possible rewards:

```text
Apple Juice Potion
Postcard Shield
gold
```

---

##### 7. Moon-Scratch Wall

Purpose:

```text
hidden room clue
```

Flavor:

```text
A wall has a tiny moon-shaped scratch, almost too small to notice.
```

Gameplay:

```text
requires inspect
changes after secret switch
opens hidden room
```

---

##### 8. Signpost Court

Purpose:

```text
boss arena
```

Flavor:

```text
A circle of signs points north, south, east, west, and snackward.
```

Boss:

```text
Signpost Ogre
```

---

##### 9. Mapstone Niche

Purpose:

```text
main quest reward
```

Flavor:

```text
The Mapstone hums like a dashboard compass.
```

Requires:

```text
boss defeated
```

---

##### 10. Exit Route

Purpose:

```text
normal ending
```

Flavor:

```text
The route line glows across the floor, leading back to the real road.
```

Requires:

```text
Mapstone
```

---

### 4. Secret Rooms and Secret Layer

#### Hidden Room: Moon Toll Booth

This hidden room should be behind the Moon-Scratch Wall.

Unlock sequence:

```text
1. Player finds Secret Map Pin.
2. Player inspects loose map pin.
3. Somewhere a wall clicks.
4. Player returns to Moon-Scratch Wall.
5. Inspect opens hidden passage.
6. Hidden room is revealed.
```

Room flavor:

```text
A tiny toll booth sits in a room that was not on the map. Moonlight leaks through the ceiling, even though you are underground.
```

Rewards:

```text
Moon Toll Token clue
Old Underpass Key
secret lore sign
optional treasure
```

Possible text:

```text
The toll basket holds a silver token, cold as moonlight.
```

---

#### Secret Layer: Forgotten Underpass

The Forgotten Underpass should feel like a second hidden mini-dungeon.

It should be small but meaningful.

Required content:

```text
separate map
new palette
new enemy
one puzzle
one reward
one true-ending clue
return path
```

Suggested rooms:

```text
Underpass Steps
Moonlit Service Tunnel
Old Route Shrine
Warden Gate
Hidden Road Sign
Return Stair
```

---

##### Underpass Steps

Purpose:

```text
entry room
```

Flavor:

```text
The stairs hum with the sound of faraway tires on wet pavement.
```

---

##### Moonlit Service Tunnel

Purpose:

```text
main secret corridor
```

Flavor:

```text
Silver route lines glow across the floor.
```

Enemy:

```text
Map Bat or Moonlit Warden
```

---

##### Old Route Shrine

Purpose:

```text
secret lore and reward
```

Flavor:

```text
Old maps are folded into tiny stars and pinned to the walls.
```

Reward:

```text
Moon Toll Token
```

---

##### Warden Gate

Purpose:

```text
secret combat check
```

Enemy:

```text
Moonlit Warden
```

Flavor:

```text
The Moonlit Warden raises a silver stop sign.
```

---

##### Hidden Road Sign

Purpose:

```text
true-ending clue
```

Text:

```text
The sign reads: "The shortest road is not always the only road."
```

Effect:

```text
sets trueEndingUnlocked = true
```

---

### 5. More Items

Add more items than the minimum so the dungeon feels rewarding.

#### Required Quest Items

##### Rusty Road Key

Purpose:

```text
opens first Toll Gate
```

Flavor:

```text
An old key with a motel number tag.
```

---

##### Mapstone

Purpose:

```text
main quest item
```

Flavor:

```text
A smooth stone with glowing route lines inside it.
```

---

##### Moon Toll Token

Purpose:

```text
secret ending item
```

Flavor:

```text
A silver toll token stamped with a crescent moon.
```

---

#### Healing Items

##### Apple Juice Potion

Effect:

```text
Restore 8 HP.
```

Flavor:

```text
A tiny bottle of apple juice with a heroic label.
```

---

##### Snack Charm

Effect:

```text
Restore 10 HP or auto-heal once when HP drops low.
```

Recommended V1.0 behavior:

```text
manual use item
```

Flavor:

```text
A charm shaped like a crinkly snack bag.
```

---

##### Trail Mix Packet

Effect:

```text
Restore 5 HP.
```

Flavor:

```text
A suspiciously magical bag of trail mix.
```

---

#### Utility Items

##### Old Underpass Key

Purpose:

```text
opens secret underpass gate
```

Flavor:

```text
A small key that smells faintly like rain on pavement.
```

---

##### Postcard Shield

Effect:

```text
+1 defense
```

Flavor:

```text
A stiff postcard from a place that may not exist.
```

Implementation:

```text
Can be a passive item.
When collected, increase defense by 1.
```

---

##### Compass Sticker

Effect:

```text
reveals one nearby undiscovered tile on minimap
```

Simpler V1.0 option:

```text
pure flavor item / score bonus
```

Flavor:

```text
A shiny sticker that always points toward snacks.
```

---

##### Motel Bell

Effect:

```text
stuns or weakens one enemy
```

Simpler V1.0 option:

```text
usable once, next monster attack is skipped
```

Flavor:

```text
A tiny desk bell. It makes every monster pause politely.
```

---

### 6. More Enemies

Add enough enemies so the game feels varied.

#### Enemy 1: Dust Goblin

Role:

```text
first easy enemy
```

Stats:

```text
HP 8
Attack 2
Defense 0
```

Flavor:

```text
A Dust Goblin rattles an old motel key.
```

Messages:

```text
The Dust Goblin kicks up road dust.
The Dust Goblin bonks your backpack.
```

---

#### Enemy 2: Map Bat

Role:

```text
fast weak enemy
```

Stats:

```text
HP 6
Attack 3
Defense 0
```

Flavor:

```text
A Map Bat flutters out from behind a torn route sign.
```

Messages:

```text
The Map Bat folds itself into a paper airplane.
The Map Bat nips at your compass.
```

---

#### Enemy 3: Toll Troll

Role:

```text
middle enemy, tougher
```

Stats:

```text
HP 13
Attack 4
Defense 1
```

Flavor:

```text
A Toll Troll blocks the old service road.
```

Messages:

```text
The Toll Troll demands exact change.
The Toll Troll thumps the toll gate.
```

---

#### Enemy 4: Cone Imp

Role:

```text
annoying optional enemy
```

Stats:

```text
HP 10
Attack 3
Defense 1
```

Flavor:

```text
A Cone Imp hides under an orange traffic cone.
```

Messages:

```text
The Cone Imp squeaks, "Detour!"
The Cone Imp rolls into your path.
```

---

#### Enemy 5: Snack Mimic

Role:

```text
treasure-room surprise enemy
```

Stats:

```text
HP 12
Attack 4
Defense 1
```

Flavor:

```text
The snack tin grows tiny legs.
```

Gameplay:

```text
optional enemy near treasure
```

Messages:

```text
The Snack Mimic snaps its lid.
The Snack Mimic smells like barbecue chips and trouble.
```

---

#### Boss: Signpost Ogre

Role:

```text
main boss
```

Stats:

```text
HP 26
Attack 5
Defense 2
```

Flavor:

```text
The Signpost Ogre spins arrows in every direction.
```

Special behavior:

```text
Every third turn, it uses Confusing Directions.
```

Simple implementation:

```text
On every third monster turn, deal normal damage and show special message.
```

Special message:

```text
The Signpost Ogre points every sign at once. You lose your sense of direction for a moment.
```

Optional effect:

```text
randomly turns player left or right after the attack
```

Only add this if it is not annoying.

---

#### Secret Boss: Moonlit Warden

Role:

```text
secret-layer guardian
```

Stats:

```text
HP 20
Attack 5
Defense 2
```

Flavor:

```text
The Moonlit Warden guards the route that does not appear on ordinary maps.
```

Special behavior:

```text
Uses Silver Stop once.
```

Simple effect:

```text
player's next attack deals -1 damage
```

Message:

```text
The Moonlit Warden raises a silver stop sign.
```

---

### 7. More Puzzle Ideas

Keep puzzles simple. This is a small road-trip app, not a full RPG.

#### Puzzle 1: Loose Map Pin

Purpose:

```text
opens hidden room
```

Flow:

```text
Player inspects a map pin.
It clicks.
Moon-Scratch Wall can now open.
```

Clue:

```text
One map pin is loose, but all the printed roads avoid it.
```

---

#### Puzzle 2: Three Route Signs

Purpose:

```text
opens optional treasure room or shortcut
```

Room contains three signs:

```text
North
Snack
Detour
```

Player must inspect the correct sign.

Clue:

```text
A faded note says: "When lost, follow snacks."
```

Correct sign:

```text
Snack
```

Reward:

```text
Snack Charm or Trail Mix Packet
```

Implementation can be simple:

```text
inspect event sets flag and opens treasure.
```

---

#### Puzzle 3: Toll Booth Choice

Purpose:

```text
optional gold/item choice
```

Player finds old toll booth with three baskets:

```text
Coins
Keys
Receipts
```

Only one has a reward.

Clue:

```text
A sign says: "The road remembers receipts."
```

Correct:

```text
Receipts
```

Reward:

```text
Old Underpass Key clue or gold
```

Implementation can be a simple inspect sequence.

---

#### Puzzle 4: Hidden Road Line

Purpose:

```text
secret underpass clue
```

The minimap or canvas shows a faint road line near a wall.

Inspecting that wall after switch opens hidden route.

Message:

```text
A road line continues across the wall, as if the map forgot to stop.
```

---

### 8. More Secrets

Add more optional secrets beyond the required hidden room.

#### Secret 1: Moon Toll Booth

Required hidden room.

Reward:

```text
access to Forgotten Underpass
```

---

#### Secret 2: Lost Postcard

Optional collectible.

Location:

```text
dead-end alcove
```

Reward:

```text
score bonus
small lore
```

Text:

```text
The postcard says, "Wish you were somewhere slightly impossible."
```

---

#### Secret 3: Snack Cache

Optional healing room.

Discovery:

```text
inspect suspicious vending machine
```

Reward:

```text
Trail Mix Packet
```

Text:

```text
The vending machine dispenses exactly one heroic snack.
```

---

#### Secret 4: Shortcut Door

Optional convenience.

Discovery:

```text
opens after boss defeated or secret switch pressed
```

Effect:

```text
lets player return to exit faster
```

Text:

```text
A service door swings open, revealing a shortcut back to the map kiosk.
```

---

#### Secret 5: True Ending Sign

Required for true ending.

Location:

```text
Forgotten Underpass
```

Text:

```text
The sign reads: "A road can be hidden and still be real."
```

Effect:

```text
trueEndingUnlocked = true
```

---

### 9. Better Quest Objectives

The HUD should update the objective as the player progresses.

#### Objective States

##### Start

```text
Objective: Explore the map kiosk dungeon.
```

##### First Gate Seen

```text
Objective: Find the Rusty Road Key.
```

##### Key Found

```text
Objective: Unlock the Toll Gate.
```

##### Gate Opened

```text
Objective: Reach the Signpost Court.
```

##### Boss Seen

```text
Objective: Defeat the Signpost Ogre.
```

##### Boss Defeated

```text
Objective: Claim the Mapstone.
```

##### Mapstone Found

```text
Objective: Return to the glowing exit.
```

##### Secret Switch Found

```text
Secret: Something opened near a moon-marked wall.
```

##### Underpass Entered

```text
Secret Objective: Find the Moon Toll Token.
```

##### Moon Token Found

```text
Secret Objective: Return to the exit for the Secret Star Ending.
```

---

### 10. Better Endings

#### Normal Ending

Title:

```text
Route Restored
```

Text:

```text
You escaped the Roadside Realm with the Mapstone. The old kiosk clicks shut, the road lines settle back onto the map, and the car’s route is restored.
```

Reward text:

```text
Prize idea: the winner gets first snack pick.
```

---

#### True Ending

Title:

```text
Secret Star Ending
```

Text:

```text
You escaped with the Mapstone and the Moon Toll Token. The Forgotten Underpass glows beneath the map, revealing a route that only careful explorers ever find. A tiny silver star appears on your road-trip map.
```

Reward text:

```text
Prize idea: the winner chooses the next mini-game.
```

---

#### Defeat Ending / Recovery

Do not make defeat permanent.

Text:

```text
You got overwhelmed and woke up beside the map kiosk. The Roadside Realm gives passengers second chances.
```

Effect:

```text
return to start
restore partial HP
keep key items
```

---

### 11. Optional Local Badges

Keep badges local only. No accounts. No tracking.

Add lightweight local badges:

```text
Route Restored
Secret Star
No Defeats
Snack Saver
Wall Whisperer
Ogre Bonker
Underpass Explorer
```

These can appear only on the summary screen.

Do not add addictive streaks or daily rewards.

#### Badge Rules

##### Route Restored

```text
Beat normal ending.
```

##### Secret Star

```text
Beat true ending.
```

##### No Defeats

```text
Beat game with zero defeats.
```

##### Snack Saver

```text
Beat game while still holding a healing item.
```

##### Wall Whisperer

```text
Find hidden room.
```

##### Ogre Bonker

```text
Defeat Signpost Ogre.
```

##### Underpass Explorer

```text
Enter Forgotten Underpass.
```

---

### 12. More Environmental Flavor

Add flavor text when inspecting non-critical things.

#### Wall Flavor

```text
The wall is covered in old route lines.
Someone carved "ARE WE THERE YET?" into the stone.
A faded sticker says: "Visit Scenic Nowhere."
The stone smells faintly like dust and french fries.
```

#### Floor Flavor

```text
The floor tiles look like pieces of an old road map.
A painted lane line runs under your feet.
Tiny pebbles form an arrow toward nowhere.
```

#### Door Flavor

```text
The toll gate is striped like an old parking barrier.
A sign says: "Exact courage only."
The lock is shaped like a tiny steering wheel.
```

#### Treasure Flavor

```text
A lunchbox glows with suspicious importance.
A motel key hangs from a golden nail.
A postcard flutters even though there is no wind.
```

#### Secret Flavor

```text
A cool draft slips through a wall with no cracks.
The moon scratch glows when you look away.
The route line continues where the wall begins.
```

---

### 13. Better First-Time Tutorial

Do not add a long tutorial.

Use short in-game messages.

At start:

```text
Turn left or right to look around. Move forward to explore.
```

After first blocked wall:

```text
Walls block movement. Try turning or inspecting.
```

After first item:

```text
Items appear in your inventory. Some can heal you.
```

At first monster:

```text
A monster blocks the way. Attack until it is defeated.
```

At first locked door:

```text
Locked doors need keys. Explore nearby.
```

At first secret clue:

```text
Some walls hide more than stone. Inspect suspicious details.
```

---

### 14. Game Balance Expansion

The game should be forgiving.

#### Recommended Enemy Placement

Main path:

```text
Dust Goblin before key
Map Bat near optional treasure
Toll Troll after first locked gate
Cone Imp in detour area
Signpost Ogre near Mapstone
```

Secret path:

```text
Map Bat or Cone Imp near entrance
Moonlit Warden near Moon Toll Token
```

#### Healing Placement

Add at least:

```text
1 Apple Juice Potion before first locked gate
1 healing fountain before boss
1 optional Snack Charm in secret/side room
```

#### Gold

Gold should be flavor/score only for V1.0.

Do not add shops unless very simple.

---

### 15. Optional Shopkeeper Idea

Only add if easy.

NPC:

```text
The Vending Oracle
```

Location:

```text
Snack Shrine
```

Function:

```text
trades 3 gold for Apple Juice Potion
```

If too much, skip shop for V1.0.

Flavor:

```text
The vending machine hums: "INSERT COURAGE."
```

---

### 16. More UI Details

The game UI should feel richer than plain buttons.

#### Stats Row

Show:

```text
HP 18/20
Level 1
Attack 4
Defense 1
Gold 3
Facing North
```

#### Inventory Row

Show item chips:

```text
Rusty Road Key
Snack Charm
Mapstone
Moon Toll Token
```

Empty state:

```text
Inventory: empty
```

#### Objective Card

Show:

```text
Current Objective
Secret Objective if active
```

#### Log

Show latest events.

Example:

```text
You found the Rusty Road Key.
The Toll Gate lifts with a friendly clank.
The Toll Troll demands exact change.
You bonk the Toll Troll for 5.
```

#### Minimap

Show discovered tiles only.

Use simple symbols:

```text
▲ player
· floor
█ wall
? unknown
★ goal
```

Do not reveal hidden rooms before discovery.

---

### 17. More Canvas Detail

Add visible differences for objects directly ahead.

#### Ahead Wall

Draw:

```text
large stone wall
route-line cracks
small sign if inspected
```

#### Ahead Locked Door

Draw:

```text
striped toll barrier
lock icon
tiny toll booth window
```

#### Ahead Monster

Draw:

```text
monster silhouette
name label
HP bar or HP text
```

#### Ahead Treasure

Draw:

```text
glowing lunchbox/chest
sparkle
item label
```

#### Ahead Exit

Draw:

```text
glowing road line
open map kiosk light
```

#### Ahead Secret Wall

Before discovered:

```text
normal wall with barely visible moon scratch
```

After switch:

```text
wall seam glows
```

After opened:

```text
dark passage visible
```

---

### 18. More Replay Value

The second pass should not just be “do the same thing again.”

Add small replay incentives:

```text
find hidden room
find lost postcard
beat with no defeats
beat true ending
beat with Snack Charm unused
find all secrets
```

The summary can say:

```text
Secrets found: 2 of 4
Ending: Normal
Hint: A moon-marked wall still waits somewhere in the dungeon.
```

If normal ending achieved without secret:

```text
Hint: You restored the route, but one moonlit road remains hidden.
```

This encourages second pass without forcing it.

---

### 19. Secret Hints After Normal Ending

If player beats normal ending without hidden layer, show one subtle hint:

```text
As the kiosk closes, you notice a crescent-shaped scratch glowing on the inside of the glass.
```

Or:

```text
The Mapstone hums once more, pointing toward a road under the road.
```

Do not reveal the exact answer, but make replay feel intentional.

---

### 20. V1.0 Content Counts

Minimum content counts for the finished game:

```text
3 main zones or map sections
1 secret zone
10+ named rooms/areas
5+ enemy types
1 main boss
1 secret boss/guardian
6+ items
3+ treasures
2+ healing sources
1 main locked door
1 optional locked door
1 hidden room
1 hidden layer
1 normal ending
1 true ending
4+ optional flavor inspect messages
4+ local badges
1 minimap or compass
1 save/continue system
```

This is still manageable but feels complete.

---

### 21. Best V1.0 Final Experience

A player should experience something like this:

```text
I opened Roadside Realm.
I learned to turn and move.
I found a key.
I unlocked a toll gate.
I fought weird road-trip monsters.
I found healing items.
I noticed a suspicious wall.
I either ignored it or opened it.
I defeated the Signpost Ogre.
I found the Mapstone.
I escaped and got a real ending.
Then I realized there was a hidden underpass and a true ending.
```

That is the desired V1.0 feeling.

---

### 22. Final Agent Instruction

Add enough content so Roadside Realm feels like a real mini-RPG.

Do not just create a hallway, a key, and a boss.

The game should have:

```text
a main route
side rooms
optional treasure
secrets
a hidden room
a hidden second layer
a normal ending
a true ending
memorable road-trip fantasy flavor
```

The final product should make the user feel like:

```text
This is a full little game inside my app.
```


---

## 3. Exact Build Detail

### Roadside Realm — Expanded Design Spec (V1.0 Build Detail)

This expands the original build prompt with concrete maps, full dialogue/text content, exact event coordinates, and balancing math, so an implementing agent has nothing left to invent on the fly.

---

#### 1. Map 1 — "Map Kiosk Dungeon" (Main Quest, 12×12)

##### 1.1 Full Grid

Row/col are 0-indexed, top-left origin. `(x,y)` = `(col,row)`.

```
      0  1  2  3  4  5  6  7  8  9 10 11
 0    #  #  #  #  #  #  #  #  #  #  #  #
 1    #  P  .  .  .  .  .  .  .  .  G  #
 2    #  .  #  #  .  #  #  #  .  #  .  #
 3    #  .  K  .  .  #  M  .  .  #  .  #
 4    #  .  #  #  D  #  .  #  .  #  .  #
 5    #  .  .  .  .  #  .  .  .  .  .  #
 6    #  #  #  .  #  #  T  #  #  #  H  #
 7    #  S  .  .  #  M  .  #  .  .  .  #
 8    #  .  #  .  #  .  .  #  .  #  M  #
 9    #  .  #  .  .  .  #  #  .  #  .  #
10    #  .  .  .  #  B  .  .  .  .  .  #
11    #  #  #  #  #  #  #  #  #  #  #  #
```

Legend (matches `legend` object in data file):

| Symbol | Meaning | Notes |
|---|---|---|
| `#` | wall | impassable |
| `.` | floor | walkable |
| `P` | player start | (1,1), facing south |
| `K` | Rusty Road Key | at (2,3) |
| `D` | Toll Gate (locked door) | at (4,4), requires `rusty-road-key` |
| `M` | monster | three spawns: (6,3) Dust Goblin, (5,7) Map Bat, (10,8) Toll Troll |
| `T` | treasure (Apple Juice Potion) | at (6,6) |
| `B` | Signpost Ogre (boss) | at (5,10), guards the goal corridor |
| `G` | goal — Mapstone | at (10,1), only collectable once Ogre is defeated |
| `S` | secret switch | at (1,7) |
| `H` | hidden wall (Forgotten Underpass entrance) | at (10,6), opens only after `S` is pressed |
| (unmarked floor near (1,9)–(3,10)) | healing tile | step-on heal, see 1.3 |

##### 1.2 Intended Main-Path Route (first-time player)

1. Start (1,1) facing south.
2. Walk down corridor to (1,3) → step onto `K` (2,3): pick up **Rusty Road Key**.
3. Backtrack to (1,5), head east along row 5 to (4,5)/(4,4): reach **Toll Gate** `D`. Unlock with key.
4. Continue north through the gate to (4,3)/(6,3): encounter **Dust Goblin** `M`. Defeat it.
5. Detour south to (3,6)→(6,6): claim **Apple Juice Potion** treasure `T` (optional but recommended before boss).
6. Head south to (1,7): pass the secret switch `S` (can ignore it for the main path — it's not required, but inspecting it is how perceptive players notice the secret track).
7. Path continues to (5,7) and (10,8): fight **Map Bat** and **Toll Troll**.
8. Move to the healing tile around (1,9)–(3,10) if HP is low.
9. Approach (5,10): boss fight with **Signpost Ogre**.
10. After the Ogre falls, the corridor to the goal opens. Travel north along column 10 to (10,1): pick up **Mapstone**.
11. Return to the **Exit** (placed at the original entrance tile, (1,1)/north wall break) to trigger the **Normal Ending**.

Estimated playtime for this route: **6–10 minutes**, consistent with the 5–12 minute target.

##### 1.3 Healing Tile

Add one `healingFountain` tile at `(2,9)`, not shown as a special character on the ASCII map (render as `.` with an `events` entry) so it's a "hidden in plain sight" floor tile:

```js
events: {
  '2,9': {
    type: 'healingFountain',
    text: 'A trickle of leftover soda fizzes near a drain grate. It smells faintly of lime.',
    healAmount: 6,
    oncePerVisit: false,
    cooldownSteps: 10
  }
}
```

Cooldown prevents fountain-camping from trivializing the boss fight.

##### 1.4 Event Table (Map 1)

```js
events: {
  '2,3':  { type: 'item', itemId: 'rusty-road-key',
            text: 'A Rusty Road Key hangs from a bent route marker.' },

  '4,4':  { type: 'lockedDoor', flag: 'tollGateOpen', requiredItem: 'rusty-road-key',
            lockedText: 'A striped Toll Gate blocks the way. It needs a key.',
            unlockText: 'You slide the Rusty Road Key into the toll slot. The gate creaks up.' },

  '6,3':  { type: 'monster', monsterId: 'dust-goblin',
            text: 'A Dust Goblin rattles an old motel key at you.' },

  '5,7':  { type: 'monster', monsterId: 'map-bat',
            text: 'A Map Bat flutters out from behind a torn route sign.' },

  '10,8': { type: 'monster', monsterId: 'toll-troll',
            text: 'A Toll Troll blocks the old service road, arms crossed.' },

  '6,6':  { type: 'treasure', itemId: 'apple-juice-potion',
            text: 'A half-buried cooler holds one cold Apple Juice Potion.' },

  '2,9':  { type: 'healingFountain', healAmount: 6,
            text: 'A trickle of leftover soda fizzes near a drain grate.' },

  '5,10': { type: 'monster', monsterId: 'signpost-ogre', boss: true, blocksUntilDefeated: true,
            text: 'The Signpost Ogre spins its arrow-arms and blocks the goal corridor.' },

  '10,1': { type: 'goalItem', itemId: 'mapstone', requiresFlag: 'bossDefeated',
            blockedText: 'Something is still rattling the gate behind you. Better deal with that first.',
            text: 'The Mapstone hums like a tiny dashboard compass.' },

  '1,7':  { type: 'secretSwitch', flag: 'secretSwitchPressed',
            text: 'You press a loose map pin into the wall. Somewhere, a hidden wall clicks.' },

  '10,6': { type: 'hiddenWall', flag: 'secretWallOpen', requiredFlag: 'secretSwitchPressed',
            unrevealedText: 'A dusty wall. Nothing unusual... though it feels a little hollow when you knock.',
            cluedText: 'The wall has a tiny moon-shaped scratch near the base.',
            revealedText: 'The wall slides open with a soft road-sign rattle, revealing a stairway down.' },

  '1,1':  { type: 'exit', requiresItem: 'mapstone',
            blockedText: 'There's nothing to go back to yet — you came here for a reason.',
            text: 'You step back through the kiosk doorway, Mapstone in hand.' }
}
```

---

#### 2. Map 2 — "Forgotten Underpass" (Hidden Layer, 7×7)

##### 2.1 Full Grid

```
      0  1  2  3  4  5  6
 0    #  #  #  #  #  #  #
 1    #  E  .  .  W  #  #
 2    #  .  #  .  #  #  #
 3    #  .  #  .  .  .  #
 4    #  .  #  #  #  C  #
 5    #  .  .  .  .  .  #
 6    #  #  #  #  #  #  #
```

Legend:

| Symbol | Meaning |
|---|---|
| `E` | entry point, arrives from Map 1's hidden wall (1,1) facing east |
| `W` | Moonlit Warden (secret/bonus boss) at (4,1) |
| `C` | Moon Toll Token + lore sign at (5,4) |
| stairs back | placed at `E` tile itself — re-using entry as exit |

##### 2.2 Intended Secret Route

1. Player arrives at (1,1) from the Map 1 hidden passage.
2. Travels along row to (4,1): optional fight with **Moonlit Warden**. (Can be skipped by going (1,2)→(1,3)→(3,3) instead — Warden is a side guardian, not a gate, matching "must not block the normal ending" and ideally also not blocking the secret reward itself, so it should guard a *bonus* treasure rather than the token. See 2.3 for adjustment.)
3. Path down to (1,5), east to (5,5), north to (5,4): find **Moon Toll Token** and read the **lore sign**.
4. Return to (1,1) and step on `E` again to climb back to Map 1, re-emerging at (10,6).

##### 2.3 Design Correction — Warden Placement

To strictly satisfy "must not block the normal ending" *and* "the second layer should reward exploration without being a gate the player can fail," reposition the Warden as an optional side-room guardian rather than sitting on the main secret corridor:

- Move Moonlit Warden to a small alcove at `(2,2)` (a dead-end stub off the main secret corridor), guarding a **second reward**, "Lucky Toll Coin" (cosmetic/score-only item), not the Moon Toll Token itself.
- This keeps the Token reachable even if the player avoids combat entirely, while still giving combat-oriented players a bonus fight worth doing.

##### 2.4 Event Table (Map 2)

```js
events: {
  '1,1': { type: 'stairsUp', text: 'Stairs lead back up to the kiosk dungeon above.' },

  '2,2': { type: 'monster', monsterId: 'moonlit-warden', optional: true,
           text: 'The Moonlit Warden steps out of an alcove, guarding a small coin dish.' },

  '2,2-reward': { type: 'treasure', itemId: 'lucky-toll-coin', requiresFlag: 'wardenDefeated',
           text: 'A Lucky Toll Coin glints in the dish where the Warden stood.' },

  '5,4': { type: 'item', itemId: 'moon-toll-token',
           text: 'A cold, silver Moon Toll Token sits beside a weathered lore sign.' },

  '5,4-lore': { type: 'loreSign',
           text: '"Before the highway was paved, travelers paid a moonlit toll to pass safely. Some say the toll booth never closed — it just went quiet." ' },

  '1,1-exit': { type: 'returnStairs',
           onUse: 'setFlag:underpassFound; mapId:map-kiosk-dungeon; x:10; y:6; facing:west',
           text: 'You climb back up into the kiosk dungeon.' }
}
```

---

#### 3. Item Catalogue (Full Text)

| Item | ID | Effect | Pickup Text | Inspect Text (in inventory) | Use Text |
|---|---|---|---|---|---|
| Rusty Road Key | `rusty-road-key` | Unlocks Toll Gate | "You found the Rusty Road Key." | "An old key, worn smooth from a thousand glove compartments." | n/a (auto-used at door) |
| Snack Charm | `snack-charm` | Restores HP fully, once | "You found the Snack Charm." | "A wax-paper charm that smells like trail mix. Feels lucky." | "You unwrap the Snack Charm. Warm road-trip energy fills you. HP fully restored." |
| Apple Juice Potion | `apple-juice-potion` | Restores 8 HP | "You found an Apple Juice Potion." | "A juice box, slightly warm but still good." | "You drink the Apple Juice Potion. +8 HP." |
| Mapstone | `mapstone` | Main goal item | "The Mapstone hums like a tiny dashboard compass." | "A smooth stone etched with tiny glowing roads. It seems to know the way home." | n/a (carried to exit) |
| Moon Toll Token | `moon-toll-token` | True ending key | "You found the Moon Toll Token." | "A cold silver coin, heavier than it looks. It hums faintly under moonlight." | n/a (carried to exit) |
| Lucky Toll Coin | `lucky-toll-coin` | Score bonus, cosmetic | "You found a Lucky Toll Coin." | "Just a lucky coin. Doesn't open anything, but it's nice to have." | n/a |

---

#### 4. Monster Dialogue & Behavior Detail

For each monster: appearance line, attack lines (rotate through 2–3 variants to avoid repetition), defeat line, flee/special line if any.

##### Dust Goblin
- Appear: "A Dust Goblin rattles an old motel key at you."
- Attack (player hits): "You bonk the Dust Goblin for {n}." / "You tap the Dust Goblin with your elbow for {n}."
- Attack (goblin hits): "The Dust Goblin bumps you for {n}." / "The Dust Goblin tosses a pebble at you for {n}."
- Defeat: "The Dust Goblin drops its key ring and scurries off."

##### Map Bat
- Appear: "A Map Bat flutters out from behind a torn route sign."
- Player hit: "You swat the Map Bat for {n}."
- Bat hit: "The Map Bat nips at you for {n}."
- Defeat: "The Map Bat folds up like a paper airplane and vanishes."
- Special: 25% chance per turn to "flutter past" and skip its attack — log: "The Map Bat flutters past, missing entirely."

##### Toll Troll
- Appear: "A Toll Troll blocks the old service road, arms crossed."
- Player hit: "You shove past the Toll Troll's guard for {n}."
- Troll hit: "The Toll Troll leans on you for {n}."
- Defeat: "The Toll Troll grumbles and steps aside, dropping a few coins."

##### Signpost Ogre (Boss)
- Appear: "The Signpost Ogre spins its arrow-arms and blocks the goal corridor."
- Player hit: "You bonk the Signpost Ogre's signboard chest for {n}."
- Ogre hit (normal): "The Signpost Ogre swings an arrow-arm for {n}."
- Ogre hit (every 3rd turn — telegraphed): "The Signpost Ogre winds up a Big Spin!" (prior turn) → "The Big Spin clips you for {n}!" (this turn). The telegraph line should appear one full player turn early so the player can choose to retreat a tile or use an item.
- Defeat: "The Signpost Ogre's arrows clatter to the ground. The corridor north is finally clear."

##### Moonlit Warden (Optional)
- Appear: "The Moonlit Warden steps out of an alcove, guarding a small coin dish."
- Player hit: "You catch the Moonlit Warden off guard for {n}."
- Warden hit: "The Moonlit Warden's moonlit staff grazes you for {n}."
- Defeat: "The Moonlit Warden dissolves into moonlight, leaving the coin dish unguarded."

---

#### 5. Inspect / Ambient Wall Text Bank

To avoid every wall saying the identical line, rotate through a small bank for plain walls, keyed loosely by zone so the dungeon feels textured:

**Plain wall (generic, any zone):**
- "A dusty wall. Nothing unusual."
- "Cool stone. A faint smell of old asphalt."
- "Just a wall. Someone carved a tiny arrow into it ages ago, pointing nowhere useful."

**Near the Toll Gate zone:**
- "Faded toll rates are painted on the stone, illegible now."

**Near the boss corridor:**
- "The wall vibrates faintly, like something big is pacing nearby."

**Suspicious wall (pre-switch, at 10,6):**
- "A dusty wall. Nothing unusual... though it feels a little hollow when you knock."

**Suspicious wall (post-switch, pre-open):**
- "The wall has a tiny moon-shaped scratch near the base."

**Suspicious wall (revealed):**
- "The wall slides open with a soft road-sign rattle, revealing a stairway down."

**Underpass walls (moonlit zone):**
- "Cold stone, slick with condensation. Moonlight leaks in from somewhere above."
- "Someone scratched tally marks into the wall here. Dozens of them."

---

#### 6. Balancing Pass

##### 6.1 Damage Formula (unchanged, confirmed)

```js
damage = Math.max(1, attacker.attack + random(0, 2) - defender.defense);
```

##### 6.2 Expected Turns-to-Kill (player attacking, attack=4, no upgrades)

| Monster | HP | Defense | Avg dmg/turn (4+1−def) | Expected turns to kill |
|---|---|---|---|---|
| Dust Goblin | 8 | 0 | 5 | 2 |
| Map Bat | 6 | 0 | 5 | 2 (sometimes 1 due to variance) |
| Toll Troll | 13 | 1 | 4 | 3–4 |
| Signpost Ogre | 24 | 2 | 3 | 7–8 |
| Moonlit Warden | 18 | 2 | 3 | 6 |

##### 6.3 Expected Damage Taken (player defense=1)

| Monster | Attack | Avg dmg/turn (atk+1−1) | Turns to kill player solo from full 20 HP |
|---|---|---|---|
| Dust Goblin | 2 | 2 | 10 |
| Map Bat | 3 (×0.75 due to miss chance) | ~2.25 | ~9 |
| Toll Troll | 4 | 3 | ~7 |
| Signpost Ogre (incl. Big Spin every 3rd turn) | 5 base, spikes to ~8 on spin turns | ~5.3 avg over 3 turns | ~4 |

##### 6.4 Heal Economy Check

Total available healing before the boss, if player collects everything:
- Apple Juice Potion: +8
- Healing fountain: +6, reusable every 10 steps (assume 1 extra use realistically) → +6 to +12
- **Total available before boss: 14–20 HP** on top of starting 20/20 (capped at maxHp, so really this buffers losses taken before the fight)

Boss fight cost estimate: ~8 turns × ~5.3 avg dmg ≈ **42 damage taken** if the player tanks every hit with zero counterplay — clearly more than 20 HP. This means **retreating a tile during the Big Spin telegraph is intended to be load-bearing**, not optional flavor. Recommended adjustment for fairness:

- **Telegraph escape**: if the player retreats out of the Ogre's tile-adjacency during the telegraphed turn, the Big Spin deals 0 damage instead of full damage (it "spins through empty air").
- With correct play (dodging ~2–3 of the ~3 Big Spins across an 8-turn fight), realistic damage taken drops to roughly **24–28**, still requiring at least one potion/fountain use — which matches "main dungeon should include at least one heal" being a *needed*, not decorative, feature.
- This also justifies the Snack Charm's full-heal-once effect as a safety net for players who don't realize they can dodge.

##### 6.5 Defeat Penalty (confirmed numbers)

```js
onDefeat = {
  returnTo: 'start tile of current map',
  hp: Math.max(5, Math.floor(player.maxHp / 2)), // = 10 for maxHp 20
  goldLoss: Math.min(1, player.gold),
  keepKeyItems: true,
  keepDiscoveredMap: true
}
```

Log line on defeat: *"You got overwhelmed and woke up near the map kiosk with {hp} HP. Your keys and clues are still with you."*

##### 6.6 Secret Layer Difficulty

Moonlit Warden (18 HP, atk 5, def 2) is tuned slightly *below* the main boss (24 HP, atk 5, def 2) so it reads as "a real fight" without gating the actually-important reward (Moon Toll Token, which requires zero combat to reach per the corrected layout in §2.3).

---

#### 7. Score Formula (confirmed, with example)

```js
score =
  monstersDefeated * 50
  + treasuresFound * 100
  + secretsFound * 250
  + bossDefeated * 500
  + trueEndingUnlocked * 1000
  - defeats * 100
```

**Example — full clear, no deaths, both endings explored in one continuous save:**
- 5 monsters defeated (Goblin, Bat, Troll, Ogre counted once each as "monsters," plus optional Warden) → actually let's separate boss from regular:
  - Regular monsters: Goblin, Bat, Troll, Warden = 4 × 50 = 200
  - Bosses: Ogre = 1 × 500 = 500
  - Treasures: Apple Juice Potion, Lucky Toll Coin = 2 × 100 = 200
  - Secrets found: hidden wall + Moon Toll Token area = 2 × 250 = 500
  - True ending: 1 × 1000 = 1000
  - Defeats: 0
  - **Total: 2400**

This gives a clean example for the summary-screen mockup below.

---

#### 8. Summary Screen Copy

##### 8.1 Normal Ending

```
ROADSIDE REALM — COMPLETE
"You escaped the Roadside Realm with the Mapstone.
The route is restored, and someone in the car gets first snack pick."

Steps taken: {steps}
Monsters defeated: {monstersDefeated}
Treasures found: {treasuresFound}
Secrets found: {secretsFound} / 2
Ending: Normal Route
Score: {score}

[Save Quest]  [Reset Quest]  [Share Result — local only]
```

##### 8.2 True Ending

```
ROADSIDE REALM — SECRET STAR ENDING
"You found the Forgotten Underpass and restored the old moonlit route.
The Roadside Realm stamps your map with a secret star."

Steps taken: {steps}
Monsters defeated: {monstersDefeated}
Treasures found: {treasuresFound}
Secrets found: {secretsFound} / 2
Ending: True Route ★
Score: {score}

A permanent Secret Star badge has been added to your local save.

[Save Quest]  [Reset Quest]  [Share Result — local only]
```

---

#### 9. Full Log Walkthrough (Reference Transcript)

A sample "golden path" transcript an implementer can use to sanity-check log formatting and pacing:

```
Facing south. The kiosk doorway closes behind you.
You step forward.
You step forward.
You found the Rusty Road Key.
You turn right.
You step forward.
You step forward.
You step forward.
A striped Toll Gate blocks the way. It needs a key.
You slide the Rusty Road Key into the toll slot. The gate creaks up.
You step forward.
A Dust Goblin rattles an old motel key at you.
You bonk the Dust Goblin for 5.
The Dust Goblin bumps you for 2.
You bonk the Dust Goblin for 4.
The Dust Goblin drops its key ring and scurries off.
You step forward.
A half-buried cooler holds one cold Apple Juice Potion.
You turn left.
You step forward.
You press a loose map pin into the wall. Somewhere, a hidden wall clicks.
You step forward.
A Map Bat flutters out from behind a torn route sign.
You swat the Map Bat for 6.
The Map Bat folds up like a paper airplane and vanishes.
You step forward.
A Toll Troll blocks the old service road, arms crossed.
You shove past the Toll Troll's guard for 4.
The Toll Troll leans on you for 3.
You shove past the Toll Troll's guard for 5.
The Toll Troll grumbles and steps aside, dropping a few coins.
A trickle of leftover soda fizzes near a drain grate. +6 HP.
You step forward.
The Signpost Ogre spins its arrow-arms and blocks the goal corridor.
You bonk the Signpost Ogre's signboard chest for 3.
The Signpost Ogre swings an arrow-arm for 4.
You bonk the Signpost Ogre's signboard chest for 2.
The Signpost Ogre winds up a Big Spin!
You step back.
The Big Spin clips empty air.
You bonk the Signpost Ogre's signboard chest for 3.
The Signpost Ogre swings an arrow-arm for 5.
You drink the Apple Juice Potion. +8 HP.
You bonk the Signpost Ogre's signboard chest for 4.
You bonk the Signpost Ogre's signboard chest for 2.
The Signpost Ogre's arrows clatter to the ground. The corridor north is finally clear.
You step forward.
You step forward.
You step forward.
The Mapstone hums like a tiny dashboard compass.
You turn around.
You step forward. (x9)
You step back through the kiosk doorway, Mapstone in hand.
ROADSIDE REALM — COMPLETE
```

---

#### 10. Implementation Notes Added by This Pass

1. **Boss telegraph mechanic** (§4, §6.4) is new since the original spec only said "boss can be defeated" — this gives the implementer the actual counterplay loop, which also satisfies "avoid soft locks" and "do not make random damage too punishing."
2. **Warden repositioning** (§2.3) resolves a latent contradiction in the original spec: putting a bonus boss directly on the only path to the secret reward would make it a soft gate, violating "must not block the normal ending" in spirit even though it's not the *main* ending. Moving it to a side alcove keeps it purely optional.
3. **Fountain cooldown** (§1.3) prevents trivializing the boss via infinite healing loops, which the original spec didn't address numerically.
4. **Exact coordinates for every event** replace the original's "shape example only" disclaimer — these are tuned so no key item sits behind its own locked door, every tile is reachable, and the hidden wall is genuinely off the critical path.
5. **Score example walkthrough** (§7) gives QA a concrete expected number to test against.


---

## 4. Technical Appendix

### Roadside Realm — Full Technical & Content Expansion (Part 2)

This document goes underneath the Part 1 spec (maps/items/balancing) and adds:

- **A.** State machine & game loop pseudocode
- **B.** Render loop pseudocode (first-person view)
- **C.** Save schema, versioning, migration
- **D.** Expanded map content (new optional rooms)
- **E.** Expanded dialogue variant banks (3–5 variants per line type)
- **F.** Full visual/art spec per tile and sprite
- **G.** Exhaustive QA test scripts (step-by-step, with expected state)

Nothing here contradicts Part 1 — coordinates and IDs are consistent with it. Where this doc adds new optional rooms, it calls out exactly how they attach to the existing maps so the grid dimensions and event table from Part 1 don't need to change shape, only gain entries.

---

#### A. State Machine & Game Loop Pseudocode

##### A.1 Top-Level Game States

```
GameState =
  | 'BOOT'            // checking for existing save
  | 'TITLE'           // "Start New Quest" / "Continue Quest"
  | 'INTRO'           // one-time story text before first move
  | 'EXPLORING'       // normal grid movement / inspect
  | 'COMBAT'          // turn-based fight in progress
  | 'PANEL_INVENTORY' // inventory overlay open
  | 'PANEL_MAP'       // minimap overlay open
  | 'DEFEATED'        // brief defeat message before respawn
  | 'WIN_NORMAL'       // normal ending summary
  | 'WIN_TRUE'         // true ending summary
  | 'PAUSED'           // tab hidden / explicit pause, if implemented
```

##### A.2 Transition Table

```
BOOT
  → TITLE                         (always, after checking localStorage)

TITLE
  → INTRO         on 'Start New Quest' AND no existing save
  → EXPLORING     on 'Continue Quest' AND save exists (skip INTRO)

INTRO
  → EXPLORING     on first movement input or 'Skip Intro'

EXPLORING
  → COMBAT            when moveForward() or turnLeft/Right() resolves onto/facing
                       a tile with an undefeated monster AND player chooses Attack,
                       OR automatically on first entering an occupied tile-facing
                       state if design wants forced first-contact (see A.5)
  → PANEL_INVENTORY   on 'Use Item' / 'I' key (only opens picker; using an item
                       resolves immediately and returns to EXPLORING or COMBAT)
  → PANEL_MAP         on 'Map' / 'M' key
  → WIN_NORMAL        on exit reached AND has(mapstone) AND NOT trueEndingUnlocked
  → WIN_TRUE          on exit reached AND has(mapstone) AND has(moon-toll-token)
                       AND flags.trueEndingUnlocked

COMBAT
  → EXPLORING     when monster.hp <= 0 (resolve rewards first)
  → DEFEATED      when player.hp <= 0
  → COMBAT        (self-loop) after each attack exchange while both alive

DEFEATED
  → EXPLORING     after defeat penalty applied (see Part 1 §6.5) — automatic after
                   a short delay or on 'Continue' press, no input lock longer than
                   needed to read one line

PANEL_INVENTORY / PANEL_MAP
  → EXPLORING     on Escape / close button / selecting an item to use
                   (returns to COMBAT instead of EXPLORING if combat was active
                   when the panel opened — track `state.returnTo`)

WIN_NORMAL / WIN_TRUE
  → TITLE         on 'Reset Quest'
  (no path back to EXPLORING from a win state except via Reset; this is intentional —
   a finished run should feel finished. If "keep exploring after winning" is desired,
   treat it as a deliberate design decision, not a default, since it changes the
   win-condition semantics in Part 1 §"Completion".)
```

##### A.3 Action Dispatch (EXPLORING state)

```js
function handleAction(action) {
  if (state.mode !== 'EXPLORING') return;

  switch (action) {
    case 'turnLeft':    rotate(-90); break;
    case 'turnRight':   rotate(+90); break;
    case 'forward':     attemptMove(+1); break;
    case 'backward':    attemptMove(-1); break;
    case 'inspect':     resolveInspect(); break;
    case 'attack':      resolveAttackOrNoTarget(); break;
    case 'useItem':     openInventoryPicker(); break;
    case 'toggleMap':   openMapPanel(); break;
    case 'save':        persistSave(); break;
    case 'reset':        confirmAndReset(); break;
  }

  maybeAutoSave(action);
  render();
}
```

##### A.4 Movement Resolution

```js
function attemptMove(dir) {           // dir: +1 forward, -1 backward
  const target = tileAhead(player, dir);
  const tile = getTile(player.mapId, target.x, target.y);

  if (tile === 'wall') {
    log("A wall blocks the way.");
    return;
  }

  if (tile === 'hiddenWall' && !flags.secretWallOpen) {
    log("A wall blocks the way."); // indistinguishable from a normal wall until revealed
    return;
  }

  if (tile === 'lockedDoor' && !flags[doorFlagFor(target)]) {
    log(eventAt(target).lockedText ?? "A locked door blocks the way.");
    return;
  }

  const monster = monsterAt(target);
  if (monster && !monster.defeated) {
    log(monster.text); // re-announce, don't auto-walk into a live monster
    return; // movement is blocked by monsters; player must Attack or go around
  }

  if (eventAt(target)?.type === 'goalItem' && eventAt(target).requiresFlag
      && !flags[eventAt(target).requiresFlag]) {
    log(eventAt(target).blockedText);
    return; // tile is walkable but the *pickup* is gated, not the movement —
             // see A.5 note on "soft walls" vs hard collision
  }

  player.x = target.x;
  player.y = target.y;
  counters.steps += 1;
  revealTile(target);
  resolveAutoEvents(target); // item auto-pickup, fountain, etc.
}
```

##### A.5 Design Note — "Soft Walls" vs Hard Collision

Two different blocking mechanisms exist and must not be conflated:

1. **Hard collision** (`wall`, unrevealed `hiddenWall`, unmet `lockedDoor`, live `monster`): movement itself fails, player stays put, only a log line changes.
2. **Soft gating** (`goalItem` with `requiresFlag`, `exit` with `requiresItem`): the *tile* is walkable — player can stand on it — but the *event* (picking up the Mapstone, triggering the win) refuses to fire until the condition is met. This matters for soft-lock prevention (Part 1 §"Soft Lock Prevention"): a player should never get physically stuck on a tile they can't leave, so soft gates must always allow free movement off the tile in any direction.

##### A.6 Combat Loop Pseudocode

```js
function resolveAttackOrNoTarget() {
  const target = monsterAhead(player);
  if (!target || target.defeated) {
    log("There's nothing to attack here.");
    return;
  }
  enterCombat(target);
}

function enterCombat(monster) {
  state.mode = 'COMBAT';
  state.activeMonsterId = monster.id;
  if (!monster.announced) {
    log(monster.text);
    monster.announced = true;
  }
}

function combatPlayerAttack() {
  const dmg = Math.max(1, player.attack + rand(0, 2) - monster.defense);
  monster.hp -= dmg;
  log(pickLine(monster.lines.playerHit, { n: dmg }));

  if (monster.hp <= 0) {
    return resolveMonsterDefeat(monster);
  }
  return combatMonsterTurn(monster);
}

function combatMonsterTurn(monster) {
  // Special-case telegraph logic (Signpost Ogre "Big Spin"), see Part 1 §6.4 / Part 2 §A.7
  if (monster.id === 'signpost-ogre') {
    return ogreTurnLogic(monster);
  }

  // Map Bat miss chance
  if (monster.id === 'map-bat' && rand(0, 1) < 0.25) {
    log(pickLine(monster.lines.miss));
    return;
  }

  const dmg = Math.max(1, monster.attack + rand(0, 2) - player.defense);
  player.hp -= dmg;
  log(pickLine(monster.lines.monsterHit, { n: dmg }));

  if (player.hp <= 0) resolvePlayerDefeat();
}

function resolveMonsterDefeat(monster) {
  monster.defeated = true;
  counters.monstersDefeated += 1;
  player.xp += monster.xp;
  player.gold += monster.gold;
  log(pickLine(monster.lines.defeat));
  maybeLevelUp();
  state.mode = 'EXPLORING';
  state.activeMonsterId = null;
  if (monster.boss) flags.bossDefeated = true;
  if (monster.id === 'moonlit-warden') flags.wardenDefeated = true;
}
```

##### A.7 Signpost Ogre Telegraph Logic (concrete)

```js
function ogreTurnLogic(ogre) {
  ogre.turnCount = (ogre.turnCount ?? 0) + 1;

  // Telegraph fires every 3rd monster-turn (turns 3, 6, 9, ...)
  const isTelegraphTurn = ogre.turnCount % 3 === 0;
  const isSpinResolutionTurn = ogre.pendingSpin === true;

  if (isTelegraphTurn && !isSpinResolutionTurn) {
    ogre.pendingSpin = true;
    log("The Signpost Ogre winds up a Big Spin!");
    return; // no damage this turn — this IS the warning
  }

  if (isSpinResolutionTurn) {
    ogre.pendingSpin = false;
    if (player.retreatedThisTurn) {
      log("The Big Spin clips empty air.");
      return;
    }
    const dmg = Math.max(1, ogre.attack + 3 + rand(0, 2) - player.defense); // spin = +3 over normal
    player.hp -= dmg;
    log(`The Big Spin clips you for ${dmg}!`);
    if (player.hp <= 0) resolvePlayerDefeat();
    return;
  }

  // normal attack
  const dmg = Math.max(1, ogre.attack + rand(0, 2) - player.defense);
  player.hp -= dmg;
  log(`The Signpost Ogre swings an arrow-arm for ${dmg}.`);
  if (player.hp <= 0) resolvePlayerDefeat();
}
```

`player.retreatedThisTurn` is set to `true` for exactly one resolution if the player's last action before the monster's turn was `moveBackward()` while in COMBAT state. Implementers should allow `backward` as a valid in-combat action specifically to support this dodge (this is a deliberate exception to "movement is blocked by monsters" in A.4 — retreating *away* from an engaged monster during COMBAT state is allowed and is the intended skill expression of the fight).

##### A.8 Level-Up (lightweight, optional but recommended given XP already exists)

```js
const XP_THRESHOLDS = [0, 6, 14, 26]; // level 1→2 at 6xp, 2→3 at 14xp, 3→4 at 26xp

function maybeLevelUp() {
  const next = XP_THRESHOLDS[player.level];
  if (next !== undefined && player.xp >= next) {
    player.level += 1;
    player.maxHp += 4;
    player.hp = player.maxHp; // full heal on level up, feels rewarding
    player.attack += 1;
    log(`You feel sturdier. Level ${player.level}! Max HP and Attack increased.`);
    maybeLevelUp(); // recurse in case of overflow xp
  }
}
```

This is additive to Part 1 (which said "no complex equipment system required" but didn't forbid simple leveling, and player.xp/level already existed in the state shape with nothing consuming them). Caps at level 4 to avoid trivializing the optional Warden fight on a second playthrough.

---

#### B. Render Loop Pseudocode (First-Person View)

##### B.1 Layer Order (back to front)

```
1. Sky/ceiling gradient (static, theme-colored)
2. Floor gradient (static, theme-colored)
3. Far wall slice (tile at distance 3, if exists and not a corridor opening)
4. Far side walls (left/right at distance 3)
5. Mid wall slice (distance 2)
6. Mid side walls (left/right at distance 2)
7. Near wall slice (distance 1) OR open-corridor vanishing lines if floor continues
8. Near side walls (left/right at distance 1)
9. Door overlay (if a door tile is at distance 1 or 2, drawn on top of that wall slice)
10. Monster sprite (if a live monster occupies the tile directly ahead, at the
    distance matching its tile — bigger sprite the closer it is)
11. Item/treasure glyph (if an uncollected item event sits on the tile ahead)
12. Hidden-wall clue overlay (moon scratch icon) — only if flags.secretSwitchPressed
    is true and the ahead tile is the hidden wall and it's not yet opened
13. Compass / facing indicator (top-right corner, always on top)
14. Minimap inset (top-left corner, only when toggled on — see B.4)
```

##### B.2 Distance-Based Wall Sizing (the "by wall distance" hand-drawn approach)

Rather than true raycasting, draw three nested trapezoids representing distance 1/2/3 down the corridor. Use a fixed perspective table:

```js
const PERSPECTIVE = {
  // distance: { wallTop, wallBottom, wallLeftX, wallRightX }  — values are
  // fractions of canvas width/height, canvas assumed 720x420 per Part 1 HTML
  1: { top: 0.08, bottom: 0.92, leftX: 0.18, rightX: 0.82 },
  2: { top: 0.22, bottom: 0.78, leftX: 0.32, rightX: 0.68 },
  3: { top: 0.32, bottom: 0.68, leftX: 0.42, rightX: 0.58 },
};

function drawCorridorSlice(ctx, distance, tileType) {
  const p = PERSPECTIVE[distance];
  const x0 = p.leftX * CANVAS_W, x1 = p.rightX * CANVAS_W;
  const y0 = p.top * CANVAS_H, y1 = p.bottom * CANVAS_H;

  if (tileType === 'wall' || tileType === 'hiddenWall') {
    ctx.fillStyle = wallColorFor(distance); // darker as distance increases
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    drawStoneTexture(ctx, x0, y0, x1 - x0, y1 - y0, distance);
  } else {
    // open corridor: draw floor/ceiling convergence lines instead of a wall
    drawVanishingLines(ctx, distance);
  }
}
```

Side walls at each distance are drawn as parallelogram strips connecting the current distance's trapezoid edge to the next-closer one, using the same `PERSPECTIVE` table's `leftX`/`rightX` pairs as the two edges of the strip. This gives the classic "hallway converging to a point" look without any real 3D math.

##### B.3 Per-Frame Render Function

```js
function render() {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  drawSkyAndFloor(ctx);

  const tilesAhead = [1, 2, 3].map(d => tileAtDistance(player, d)); // null past a wall

  // Walls are drawn far-to-near so nearer geometry overdraws farther geometry
  for (const distance of [3, 2, 1]) {
    const t = tilesAhead[distance - 1];
    if (t === undefined) continue; // off the edge of explored/valid space — treat as wall
    drawCorridorSlice(ctx, distance, t.type);
    drawSideWalls(ctx, distance, t.leftType, t.rightType);
    if (t.type === 'lockedDoor' || t.type === 'door') drawDoorOverlay(ctx, distance, t);
  }

  const immediate = tilesAhead[0];
  if (immediate?.monster && !immediate.monster.defeated) {
    drawMonsterSprite(ctx, immediate.monster.id, distance = 1);
  } else if (immediate?.item) {
    drawItemGlyph(ctx, immediate.item.id, distance = 1);
  } else if (immediate?.type === 'hiddenWall' && flags.secretSwitchPressed && !flags.secretWallOpen) {
    drawMoonScratchOverlay(ctx);
  }

  drawCompass(ctx, player.facing);
  if (state.mapPanelOpen) drawMinimapInset(ctx);
}
```

##### B.4 Minimap Drawing

```js
function drawMinimapInset(ctx) {
  const cell = 6; // px per tile in minimap
  const origin = { x: 10, y: 10 };
  for (const key of Object.keys(discovered)) {
    const [tx, ty] = key.split(',').map(Number);
    const tile = getTile(player.mapId, tx, ty);
    ctx.fillStyle = tile === 'wall' ? '#2b2f36' : '#e7d9b8';
    ctx.fillRect(origin.x + tx * cell, origin.y + ty * cell, cell - 1, cell - 1);
  }
  // player marker, rotated triangle pointing in facing direction
  drawFacingTriangle(ctx, origin.x + player.x * cell, origin.y + player.y * cell, player.facing);
}
```

Only tiles present as keys in `discovered` (populated by `revealTile()` on move, per A.4) are drawn — undiscovered tiles, including the hidden room/layer, never appear until the player has actually stood adjacent to or on them, satisfying "Do not reveal hidden rooms until discovered."

##### B.5 Reduced Motion Adjustments to the Render Loop

```js
function maybeAnimate(name, durationMs) {
  if (prefersReducedMotion()) return 0; // skip animation entirely, apply end-state immediately
  return durationMs;
}
```

Concretely: door-opening uses a slide animation by default; under reduced motion, the door overlay simply disappears on the frame the flag flips, with no slide. The hidden wall's "slides open" reveal behaves the same way. Combat has no shake/flash effects at all regardless of setting (Part 1 already asks for no screen shake), so reduced motion only affects door/wall transitions and any ambient idle animation on monster sprites (e.g., a slow bob), which should be frozen to a static pose under reduced motion.

---

#### C. Save Schema, Versioning, Migration

##### C.1 Schema (v1)

```js
const SAVE_KEY = 'rtaRoadsideRealmSave';

const saveSchemaV1 = {
  schemaVersion: 1,
  gameVersion: '1.0.0',         // from RTA_ROADSIDE_REALM_DATA.version
  savedAt: '<ISO timestamp>',
  player: {
    x: Number, y: Number, facing: 'north'|'east'|'south'|'west',
    mapId: String,
    hp: Number, maxHp: Number, attack: Number, defense: Number,
    level: Number, xp: Number, gold: Number, keys: Number,
    inventory: [String],         // item IDs, duplicates allowed only for stackables
                                   // (none are stackable in V1.0 — all unique)
  },
  flags: {
    tollGateOpen: Boolean,
    secretSwitchPressed: Boolean,
    secretWallOpen: Boolean,
    mapstoneFound: Boolean,
    bossDefeated: Boolean,
    wardenDefeated: Boolean,
    underpassFound: Boolean,
    trueEndingUnlocked: Boolean,
  },
  counters: {
    steps: Number, monstersDefeated: Number, treasuresFound: Number,
    secretsFound: Number, defeats: Number,
  },
  defeatedMonsters: { /* monsterInstanceKey: true */ },
  collectedItems:  { /* itemId or eventKey: true */ },
  openedDoors:     { /* eventKey: true */ },
  discovered: {
    // per-map discovered tile sets, so switching maps doesn't lose either map's fog
    'map-kiosk-dungeon': { /* "x,y": true */ },
    'forgotten-underpass': { /* "x,y": true */ },
  },
  log: [String],                 // last 8 entries only, oldest first
  completedAt: String | null,    // ISO timestamp of first WIN_NORMAL or WIN_TRUE, else null
  badges: { secretStar: Boolean },
};
```

##### C.2 Why `discovered` Is Keyed Per-Map

Part 1's suggested shape had a single flat `discoveredTiles`. With two maps sharing the same coordinate space size in places (e.g., both could have a `(2,2)`), a flat structure would either collide or require map-prefixed keys anyway — so the schema here keys by `mapId` explicitly up front. This avoids a subtle bug where re-entering the Underpass after exploring part of the main dungeon shows phantom "discovered" tiles that were actually discovered on the *other* map.

##### C.3 Load / Validate / Migrate

```js
function loadSave() {
  let raw;
  try {
    raw = localStorage.getItem(SAVE_KEY);
  } catch (e) {
    return null; // storage unavailable (private browsing, quota, etc.) — treat as no save
  }
  if (!raw) return null;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.warn('Roadside Realm save was corrupt JSON, ignoring.');
    return null;
  }

  parsed = migrate(parsed);
  if (!validateSave(parsed)) {
    console.warn('Roadside Realm save failed validation, ignoring.');
    return null;
  }
  return parsed;
}

function migrate(save) {
  if (save.schemaVersion === 1) return save;
  // Future: if (save.schemaVersion === undefined) { ...upgrade pre-versioned saves... }
  // For V1.0 there is only one schema version, so this is a no-op passthrough that
  // exists purely so V1.1+ has a place to add real migration steps without
  // restructuring loadSave() itself.
  return save;
}

function validateSave(save) {
  if (typeof save !== 'object' || save === null) return false;
  if (!DATA.maps[save.player?.mapId]) return false;
  const map = DATA.maps[save.player.mapId];
  const inBounds = save.player.x >= 0 && save.player.x < map.width
                 && save.player.y >= 0 && save.player.y < map.height;
  if (!inBounds) return false;
  const tile = map.tiles[save.player.y]?.[save.player.x];
  if (tile === '#') return false; // never restore into a wall — direct soft-lock prevention
  if (!['north','east','south','west'].includes(save.player.facing)) return false;
  if (save.player.hp <= 0) return false; // a save should never capture a dead state
  return true;
}
```

If `validateSave` fails for any reason, the game falls back to `TITLE` with "Start New Quest" only (Continue button hidden), and the corrupt key is left alone rather than auto-deleted, in case a developer wants to inspect it via devtools after a bug report.

##### C.4 Save Triggers (concrete list, matching Part 1's "auto-save after meaningful events")

```js
const AUTOSAVE_EVENTS = new Set([
  'move',           // after every successful tile change (cheap; just steps + position)
  'itemPickup',
  'doorUnlock',
  'switchPressed',
  'hiddenWallOpened',
  'combatResolved',  // win or loss, not after every single exchange
  'mapTransition',
  'win',
]);

function maybeAutoSave(eventType) {
  if (!AUTOSAVE_EVENTS.has(eventType)) return;
  persistSave(); // already debounced, see C.5
}
```

##### C.5 Write Debounce (avoid spamming localStorage on rapid movement)

```js
let saveTimer = null;
function persistSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(buildSaveObject()));
    } catch (e) {
      // quota exceeded or storage disabled — fail silently but flag once in the log
      if (!state.saveWarningShown) {
        log("Heads up: this device can't save progress right now.");
        state.saveWarningShown = true;
      }
    }
  }, 250);
}
```

##### C.6 Reset

```js
function confirmAndReset() {
  // UI layer should show an actual confirm dialog/modal before calling this —
  // this function assumes confirmation already happened.
  localStorage.removeItem(SAVE_KEY);
  state = structuredClone(defaultState);
  state.mode = 'TITLE';
  render();
}
```

---

#### D. Expanded Map Content (New Optional Rooms)

These are additive patches on top of the Part 1 maps — they only touch boundary cells that were plain wall, and they don't move any existing event coordinate. Treat this section as a v1.0-optional / v1.1-ready content pack: implementers can ship without it and the main+secret structure from Part 1 is unaffected.

##### D.1 Map 1 Patch — "Snack Stand Alcove"

**Diff to existing rows** (only these two rows change; all others are untouched from Part 1 §1.1):

```
Row 11 (was):  #  #  #  #  #  #  #  #  #  #  #  #
Row 11 (new):  #  #  .  #  #  #  #  #  #  #  #  #     <- col 2 opened
```

**New rows appended below the original 12×12 grid** (map height becomes 14):

```
Row 12 (new):  #  #  .  .  #  #  #  #  #  #  #  #
Row 13 (new):  #  #  #  #  #  #  #  #  #  #  #  #     <- new outer boundary
```

This branches off the existing floor at `(2,10)` straight down through the new opening at `(2,11)` into a 2-tile dead-end alcove at `(2,12)` and `(3,12)`.

**New events:**

```js
'2,12': { type: 'loreSign',
  text: '"Welcome to the Last Stop Kiosk — Maps, Snacks, Souvenirs, and (allegedly) Magic." The paint is peeling but still cheerful.' },

'3,12': { type: 'treasure', itemId: 'souvenir-postcard',
  text: 'A faded postcard shows the kiosk in better days. Worth keeping.' }
```

**New item:**

| Item | ID | Effect | Notes |
|---|---|---|---|
| Souvenir Postcard | `souvenir-postcard` | Cosmetic / +100 score as a treasure pickup | No gameplay function, purely a "did you find everything" collectible |

**Why this placement is safe:** the alcove is a true dead end off an already-explored main-path tile (the player walks right past (2,10) en route to the boss at (5,10) and back). It requires zero new mechanics, can't be missed in a way that blocks anything, and gives backtracking players something to find on a second look — which directly supports "deep enough to reward exploration" without touching the critical path.

##### D.2 Map 2 Patch — "Tally Wall Nook"

**Diff to existing rows:**

```
Row 6 (was):  #  #  #  #  #  #  #
Row 6 (new):  #  .  #  #  #  #  #     <- col 1 opened
```

**New rows appended below the original 7×7 grid** (map height becomes 9):

```
Row 7 (new):  #  .  .  #  #  #  #
Row 8 (new):  #  #  #  #  #  #  #     <- new outer boundary
```

**New event:**

```js
'2,7': { type: 'loreSign', oneTime: false,
  text: 'Dozens of tally marks are scratched into the stone here — one for every traveler who found this tunnel. You add one more.' }
```

This is flavor-only (no item, no flag), included specifically because Part 1's secret layer was light on pure lore relative to how much the spec emphasized "secret lore room" as an acceptable hidden-layer ingredient. It also gives a second, independent reason to explore the Underpass beyond the Moon Toll Token, which helps the True Ending feel like the payoff for genuine curiosity rather than a single fetch-quest.

##### D.3 Updated Manual Map Design Checklist Pass (for D.1/D.2 specifically)

Re-applying Part 1's checklist to the patched maps:

- ✅ Valid rectangular rows (14×12 grid for Map 1, all rows length 12; 9×7 for Map 2, all rows length 7).
- ✅ Walls around edges (new outer boundary rows added at the bottom; sides unchanged).
- ✅ One start each (unchanged from Part 1).
- ✅ Valid path to every new tile (both alcoves connect to already-reachable floor tiles).
- ✅ No unreachable required item (both new items are optional collectibles, not required — consistent with "do not make it just an empty room" while also not creating a new required gate).
- ✅ No required key behind a locked door (neither patch adds a door).
- ✅ Enough space to turn and understand layout (2-tile dead ends are intentionally tiny; this is fine for a dead-end reward room, less fine for a room meant to be explored at length — these are reward stubs, not real rooms, and should read visually as "a little nook," not "a hallway that got cut short").

---

#### E. Expanded Dialogue Variant Banks

Pick randomly (no-repeat-twice-in-a-row) from each bank below. `{n}` = numeric interpolation.

##### E.1 Generic Movement

```
You step forward.
You move ahead.
You head forward.
```

```
You turn left.
You pivot left.
```

```
You turn right.
You pivot right.
```

```
You step back.
You back away a step.
```

##### E.2 Wall Bump (no event at the tile, plain wall)

```
A wall blocks the way.
Solid stone. No way through here.
You bump into the wall. Nothing happens.
That's a wall, not a door.
```

##### E.3 Locked Door — Locked / Unlock / Already Open

**Locked (no key yet):**
```
A striped Toll Gate blocks the way. It needs a key.
The Toll Gate is locked tight.
You rattle the Toll Gate. It doesn't budge without a key.
```

**Unlocking (key in inventory, door opens):**
```
You slide the Rusty Road Key into the toll slot. The gate creaks up.
The Rusty Road Key fits perfectly. The Toll Gate lifts.
With a rusty groan, the Toll Gate opens.
```

**Already open (re-approaching later):**
```
The Toll Gate stands open.
You pass through the open Toll Gate.
```

##### E.4 Item Pickup (generic wrapper around the specific item text)

```
You found {itemName}.
You pick up {itemName}.
Tucked into your bag: {itemName}.
```

##### E.5 Treasure Container Flavor (used before the specific item text resolves)

```
A half-buried cooler creaks open.
An old map tube pops its lid.
A dusty lunchbox clicks unlatched.
```

##### E.6 Healing Fountain

**Available:**
```
A trickle of leftover soda fizzes near a drain grate. +{n} HP.
You cup your hands under the drain and drink. +{n} HP. Tastes faintly of lime.
The fountain bubbles. +{n} HP.
```

**On cooldown:**
```
The fountain's gone flat for now. Maybe later.
Nothing left to drink here yet — give it a bit.
```

##### E.7 Secret Switch

**First press:**
```
You press a loose map pin into the wall. Somewhere, a hidden wall clicks.
The map pin sinks in with a click. Something shifted nearby.
```

**Re-pressing (already activated):**
```
The map pin is already pressed in.
Nothing more happens — you already triggered this.
```

##### E.8 Hidden Wall — Three-Stage Reveal

**Stage 1 — unrevealed, switch not yet pressed:**
```
A dusty wall. Nothing unusual... though it feels a little hollow when you knock.
Just a wall. It sounds odd when tapped, but you can't place why.
```

**Stage 2 — clued, switch pressed but wall not yet opened:**
```
The wall has a tiny moon-shaped scratch near the base.
Now that you look closer, there's a faint seam in the stone.
```

**Stage 3 — revealed:**
```
The wall slides open with a soft road-sign rattle, revealing a stairway down.
A hidden passage opens. Cool, moonlit air drifts up from below.
```

##### E.9 Boss Pre-Fight Flavor (one-time, before first attack)

```
The Signpost Ogre spins its arrow-arms and blocks the goal corridor.
The Signpost Ogre's signboard chest creaks as it turns to face you.
```

##### E.10 Defeat (player HP reaches 0)

```
You got overwhelmed and woke up near the map kiosk with {hp} HP. Your keys and clues are still with you.
Everything goes fuzzy for a second. You come to near the entrance with {hp} HP, a little worse for wear.
```

##### E.11 Level Up

```
You feel sturdier. Level {level}! Max HP and Attack increased.
Something clicks into place. Level {level} — you're tougher now.
```

##### E.12 Normal Win (entry line before the full summary screen renders)

```
You step back through the kiosk doorway, Mapstone in hand.
```

(Singular, intentionally not varied — this is the climactic line and should read as fixed and ceremonial rather than randomized.)

##### E.13 True Win (entry line)

```
You step back through the kiosk doorway, Mapstone and Moon Toll Token both in hand. The kiosk lights flicker — once, twice — and settle into a soft, moonlit glow.
```

(Also fixed for the same reason.)

##### E.14 Idle Monster Re-Inspect (player inspects a monster mid-fight or before engaging, without attacking)

```
{monsterName} watches you, waiting.
{monsterName} doesn't move. It's waiting for you to make the first move.
```

##### E.15 Goal Item Blocked (Mapstone tile before boss is defeated)

```
Something is still rattling the gate behind you. Better deal with that first.
You reach for the Mapstone, but a low growl from behind makes you reconsider.
```

##### E.16 Exit Blocked (no Mapstone yet)

```
There's nothing to go back to yet — you came here for a reason.
You're not done here. The Mapstone is still out there somewhere.
```

##### E.17 Status Bar / Accessibility Live-Region Text (separate from the scrolling log — this is the always-current one-line summary read by `aria-live="polite"`, per Part 1's "important events appear in HTML log" requirement)

Format template:

```
Facing {facing}. {aheadDescription}
```

Where `{aheadDescription}` resolves to one of:

```
an open path ahead.
a wall ahead.
a locked Toll Gate ahead.
{monsterName} ahead, blocking the way.
the Mapstone ahead.
the Exit ahead.
a hidden wall ahead. (only if clued or revealed — never reveal "hidden" in status text before the player has any clue, to avoid spoiling via the accessibility layer what sighted exploration hasn't found yet)
```

This status line updates on every turn/move, independent of the scrolling log, so a screen-reader user always has an accurate one-sentence "where am I, what's ahead" summary without needing to re-read log history.

---

#### F. Full Visual / Art Spec Per Tile & Sprite

All colors given as hex, intended as CSS custom properties so high-contrast mode can override them (Part 1 §"High Contrast"). Canvas is 720×420 per Part 1's HTML structure.

##### F.1 Palette (CSS custom properties)

```css
:root {
  --realm-sky: #f4e8c9;          /* warm cream ceiling */
  --realm-floor: #e2c79a;        /* postcard tan floor */
  --realm-wall-near: #2f4f4f;    /* deep teal, near distance */
  --realm-wall-mid: #3f6363;
  --realm-wall-far: #547878;
  --realm-accent-orange: #e2772e; /* sunset orange highlights, signage, UI accents */
  --realm-gold: #d4af37;          /* treasure glow */
  --realm-moon: #c9d6e8;          /* secret layer moonlight tint */
  --realm-blood: none;            /* explicitly unused — no red "damage" tint on the
                                       player view; HP changes communicate via the
                                       stats row and log only, never a screen tint,
                                       to keep tone non-violent per Part 1's "not
                                       scary / not violent" requirement */
}

body.high-contrast {
  --realm-sky: #ffffff;
  --realm-floor: #cccccc;
  --realm-wall-near: #000000;
  --realm-wall-mid: #1a1a1a;
  --realm-wall-far: #333333;
  --realm-accent-orange: #ff8c00;  /* kept saturated — orange-on-dark still passes
                                        contrast and preserves the "this is a door/
                                        important thing" visual language */
  --realm-gold: #ffd700;
}
```

##### F.2 Wall Texture (`drawStoneTexture`)

Simple, cheap, no sprite assets:

```js
function drawStoneTexture(ctx, x, y, w, h, distance) {
  ctx.save();
  ctx.globalAlpha = distance === 1 ? 0.25 : distance === 2 ? 0.15 : 0.08;
  ctx.strokeStyle = '#000000';
  const rows = 4, cols = Math.max(2, Math.floor(w / 40));
  for (let r = 0; r <= rows; r++) {
    const ly = y + (h / rows) * r;
    ctx.beginPath(); ctx.moveTo(x, ly); ctx.lineTo(x + w, ly); ctx.stroke();
  }
  for (let c = 0; c <= cols; c++) {
    const lx = x + (w / cols) * c;
    ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(lx, y + h); ctx.stroke();
  }
  ctx.restore();
}
```

Brick-grid lines, fading with distance — gives a "hand-drawn dungeon" feel without needing actual image assets, consistent with Part 1's "Use simple shapes and text if needed. A polished simple view is better than a broken complicated renderer."

##### F.3 Door Overlay (`drawDoorOverlay`)

```
Toll Gate visual, drawn over the wall slice at its distance:
  - A horizontal striped barrier bar (orange/cream diagonal stripes,
    like a real toll-booth arm) across the middle 40% of the wall slice height.
  - A small circular "lock" icon (simple drawn circle + rectangle shackle,
    no image asset) centered on the bar, only rendered while flags.tollGateOpen
    is false.
  - When open: the bar is drawn rotated ~70° as if lifted, anchored at its
    left edge (a simple canvas rotate() around that anchor point — this is the
    one "animated" element worth a brief tween, skipped entirely under
    reduced motion per §B.5).
```

##### F.4 Hidden Wall Visual States

```
Stage 1 (unrevealed): identical to a normal wall slice — zero visual
  difference, by design. The clue is textual only (knock sound description),
  not visual, so sighted players get no unfair advantage over a screen-reader
  user at this stage.

Stage 2 (clued): a small crescent-moon scratch icon (simple path: two
  overlapping arcs) drawn faintly (alpha 0.4) near the bottom-left of the
  wall slice. Subtle — should require the player to be looking, not be a
  glowing beacon.

Stage 3 (revealed): wall slice replaced with a darker rectangle (the
  "stairway down" opening) plus 3 thin horizontal lines suggesting steps,
  and a cool moon-tinted glow (--realm-moon at low alpha) bleeding from
  the opening.
```

##### F.5 Monster Sprites (silhouette spec — simple shape composition, no external images)

All monsters are built from basic canvas shapes layered together, scaled by distance (full size at distance 1, ~55% at distance 2 if ever shown that far, though per Part 1 monsters typically only render at distance 1 once engaged).

**Dust Goblin** — small, low to the ground:
```
- Body: squashed ellipse, --realm-wall-mid fill, ~70px wide × 50px tall
- Two small triangle ears on top
- A small gray rectangle "key" shape held in front (motel-key motif)
- Two simple dot eyes, no mouth (keeps it cute, not threatening)
```

**Map Bat** — wide, flat:
```
- Body: small circle, dark fill
- Two wide triangular "wings" made of a torn-paper texture (jagged edge
  via a zigzag path) tinted --realm-accent-orange at low alpha, suggesting
  a paper map folded into wings
- Position animates with a gentle bob (frozen under reduced motion)
```

**Toll Troll** — squat, wide:
```
- Body: rounded rectangle, wider than tall, --realm-wall-far fill
- A small sign-shaped chest plate (rectangle with "TOLL" suggested by
  two horizontal lines, not actual readable text at this scale)
- Thick simple arms crossed (two short rectangles)
```

**Signpost Ogre (Boss)** — tall, dominant, fills more of the frame:
```
- Body: tall rounded rectangle, --realm-wall-near fill, scaled ~1.4× a
  normal monster's footprint to read as a boss at a glance
- "Arms" are two crossed signpost-arrow shapes (simple arrow polygons,
  --realm-accent-orange fill) rotating slowly around a shoulder pivot
  (frozen under reduced motion; this is also the visual tell for the
  Big Spin telegraph — the arrows should visibly speed up their rotation
  during the telegraphed turn, giving sighted players a redundant cue
  alongside the log line)
- Simple round "sign" head with two dot eyes
```

**Moonlit Warden** — slim, vertical, cool-toned:
```
- Body: tall thin ellipse, --realm-moon fill at higher saturation than
  background moonlight tint
- A simple staff (vertical line with a small circle at top, glowing
  faintly --realm-gold) held to one side
- No animation by default (a still, watchful guardian reads correctly
  as calm rather than aggressive, matching the "not scary" tone even
  though it's an optional boss fight)
```

##### F.6 Item Glyphs (drawn floating/glinting on the tile-ahead overlay, distance 1 only)

```
Rusty Road Key   -> simple key silhouette, --realm-wall-mid, slight rotation
Snack Charm      -> small wrapped-candy shape (twisted ends), cream fill
Apple Juice Potion -> small juice-box rectangle with a bent straw line
Mapstone         -> faceted hexagon, --realm-gold fill, soft pulsing glow
                      (glow intensity animated only when motion is allowed;
                      under reduced motion render at fixed mid-brightness)
Moon Toll Token   -> circle coin shape, --realm-moon fill, thin ring outline
Lucky Toll Coin   -> circle coin shape, --realm-gold fill, smaller than the
                      Moon Toll Token so the two are distinguishable at a
                      glance without relying on color alone (size + label
                      in inventory list, not color, is the real
                      differentiator — supports "no color-only meaning")
Souvenir Postcard -> small rectangle with a thin border and a tiny printed
                      "image" suggested by 2-3 short horizontal lines
```

##### F.7 Compass Widget (top-right, always visible)

```
A simple 4-point compass rose, ~50px diameter:
  - N/E/S/W labels at fixed positions
  - A short orange arrow/needle rotates to point toward the player's
    current facing direction (N up, E right, S down, W left — fixed
    screen-space compass, not a 3D-perspective one, so it's always
    legible at a glance)
  - This exists specifically so "the player should always know what
    direction they face" (Part 1) doesn't rely solely on the status
    text line, giving sighted players a redundant always-on visual cue
```

##### F.8 Stat Cards Row (HTML/CSS, not canvas)

```
Five small cards, each with an icon (emoji is fine, no asset pipeline
needed) + label + value, laid out in a horizontal scroll on narrow
mobile widths rather than wrapping awkwardly:

  ❤️ HP: {hp}/{maxHp}
  ⚔️ ATK: {attack}
  🛡️ DEF: {defense}
  🔑 Keys: {keys}
  🪙 Gold: {gold}

HP card gets a subtle border color shift at low HP (<= 25% of maxHp)
using --realm-accent-orange -> a warning tone, NOT red, to keep the
"avoid color implying violence/danger in a scary way" tone while still
giving a clear low-HP signal. The numeric value is the actual signal
for accessibility; the border tint is a bonus for sighted users only.
```

---

#### G. Exhaustive QA Test Scripts

Each scenario lists exact actions and the expected resulting state, using the coordinates and IDs from Parts 1–2 so a tester (human or scripted) can follow them literally. "State" snapshots only list fields that matter for that step, not the full object.

##### G.1 Scenario: Fresh Launch, No Save

| Step | Action | Expected Result |
|---|---|---|
| 1 | Load app, open Roadside Realm mode card | `state.mode = TITLE`. "Continue Quest" button is hidden or disabled (no save in localStorage). |
| 2 | Click "Start New Quest" | `state.mode = INTRO`. Intro text about the kiosk is shown. |
| 3 | Press any movement key | `state.mode = EXPLORING`. `player = {x:1, y:1, facing:'south', hp:20, maxHp:20, mapId:'map-kiosk-dungeon'}`. Canvas renders a corridor. Status text reads "Facing south. an open path ahead." |
| 4 | Check console | No errors. |

##### G.2 Scenario: Basic Movement & Wall Collision

| Step | Action | Expected Result |
|---|---|---|
| 1 | From start (1,1) facing south, press Forward twice | Player at (1,3). `counters.steps` increased by 2. Log has 2 "step forward" variants. |
| 2 | Press Turn Right (now facing west) | `player.facing = 'west'`. No position change. |
| 3 | Press Forward | Tile (0,3) is `#`. Player position unchanged at (1,3). Log shows a wall-bump variant from §E.2. Status text: "Facing west. a wall ahead." |
| 4 | Press Turn Left twice (now facing east) | `player.facing = 'east'`. |
| 5 | Press Forward | Player picks up Rusty Road Key at (2,3) automatically (auto-pickup on entering tile, per A.4 `resolveAutoEvents`). `player.inventory` includes `rusty-road-key`. Log: "You found the Rusty Road Key." |

##### G.3 Scenario: Locked Door, With and Without Key

| Step | Action | Expected Result |
|---|---|---|
| 1 | Without the key, navigate to face the Toll Gate at (4,4) from (4,5) facing north | Press Forward → blocked. Log shows a "locked" variant from §E.3. Player stays at (4,5). |
| 2 | Acquire `rusty-road-key` (see G.2), return to face (4,4) the same way | Press Forward → door unlocks (`flags.tollGateOpen = true`), player moves into (4,4). Log shows an "unlocking" variant from §E.3. |
| 3 | Step back to (4,5), then forward again into the now-open door | No re-lock check needed — door stays open for the rest of the session. Log shows the "already open" variant, not the unlock variant again (the unlock line should only ever fire once per door, on the transition from locked→unlocked). |

##### G.4 Scenario: Standard Combat (Dust Goblin)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Approach (6,3), face the Dust Goblin | `state.mode` stays `EXPLORING` until Attack is pressed; movement into the tile is blocked per A.4 ("movement is blocked by monsters"), with the monster's appear line re-logged, not duplicated infinitely (only re-log if it's been more than N actions or use an `announced` flag exactly as in A.6 — verify it does NOT spam the log on every blocked forward-press). |
| 2 | Press Attack | `state.mode = COMBAT`. Damage applied per the formula in Part 1 §6.1 / Part 2 §A.6. Goblin HP decreases. Player HP may decrease (goblin's turn). Log shows one player-hit line and (if goblin survives) one goblin-hit line. |
| 3 | Press Attack until Goblin HP ≤ 0 | `resolveMonsterDefeat` fires: `counters.monstersDefeated += 1`, `player.xp` and `player.gold` increase, defeat line logged, `state.mode` returns to `EXPLORING`. Tile (6,3) no longer blocks movement. |
| 4 | Re-approach (6,3) | Tile is now plain floor — no re-trigger, no ghost monster. |

##### G.5 Scenario: Boss Fight — Telegraph Dodge Works

| Step | Action | Expected Result |
|---|---|---|
| 1 | Engage Signpost Ogre at (5,10) with full HP and `attack=4` | `state.mode = COMBAT`, `ogre.turnCount = 0`. |
| 2 | Attack repeatedly, tracking `ogre.turnCount` | On the monster-turn where `turnCount % 3 === 0` (i.e., the 3rd monster turn), log shows "The Signpost Ogre winds up a Big Spin!" and **no damage is applied that turn** (`ogre.pendingSpin = true`). Boss sprite's arrow-arms visibly speed up rotation (sighted redundant cue, §F.5). |
| 3 | On the player's next action, press Backward (retreat) instead of Attack | `player.retreatedThisTurn = true` for that resolution. |
| 4 | Monster turn resolves the pending spin | Log shows "The Big Spin clips empty air." Player HP unchanged. `ogre.pendingSpin = false`. |
| 5 | Repeat without retreating on a later telegraph turn | Log shows "The Big Spin clips you for {n}!" with `n` noticeably higher than a normal hit (base attack +3). Player HP decreases accordingly. |
| 6 | Continue until Ogre HP ≤ 0 | `flags.bossDefeated = true`. Defeat line logged. Goal tile (10,1) event's `blockedText` no longer fires on approach. |

##### G.6 Scenario: Boss Fight — Defeat & Respawn (Soft-Lock Check)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Engage Ogre at low HP (e.g., manually set `player.hp = 6` for test purposes) and lose | `resolvePlayerDefeat()` fires. `state.mode = DEFEATED`. |
| 2 | Observe defeat handling | `player.hp = Math.max(5, floor(maxHp/2)) = 10`. Player position reset to the map's start tile (1,1). `player.inventory` unchanged (key items retained). `player.gold` reduced by min(1, gold). `discovered` map data NOT cleared. |
| 3 | Confirm/continue past defeat screen | `state.mode = EXPLORING`. Ogre is NOT defeated (still blocks the corridor) — player must walk back and re-fight it; this is intended, not a bug. |
| 4 | Verify no soft lock | Player can freely move away from (1,1) in any non-wall direction; nothing about the defeat state traps movement. |

##### G.7 Scenario: Hidden Room Discovery (Three-Stage Reveal)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Before pressing the secret switch, face the hidden wall at (10,6) from (9,6) facing east | Inspect → Stage 1 text (§E.8) logged. Tile still behaves as a hard wall (Forward is blocked, per A.4's hidden-wall hard-collision rule). |
| 2 | Navigate to (1,7), press Inspect or step onto the switch tile (per the data file, secretSwitch fires on entry, not requiring a separate Inspect — confirm against the actual `events` entry type in Part 1 §1.4, which has no `requiresAction` field, implying auto-trigger on tile entry) | `flags.secretSwitchPressed = true`. Log: a press variant from §E.7. |
| 3 | Return to face (10,6) and Inspect | Stage 2 text (§E.8) logged. Wall still hard-blocks Forward (clue ≠ opened). Visual: faint moon-scratch overlay now rendered (§F.4 Stage 2). |
| 4 | Inspect again (same tile, same state) | Stage 2 text repeats (or a rotation-bank variant) — it must NOT silently progress to Stage 3 from Inspect alone; opening requires an explicit action (see next step). |
| 5 | Press Forward into the hidden wall now that it's clued | Confirm the actual unlock trigger your implementation uses — recommended: Inspect a clued hidden wall a second time IS the unlock action (consistent with "It should be discoverable by... pressing a hidden switch" being a separate, already-completed step). `flags.secretWallOpen = true`. Stage 3 text logged. `counters.secretsFound += 1`. |
| 6 | Press Forward again | Player moves into (10,6) and onward toward the Underpass entry, per Part 1 §1.4's `H` tile leading to Map 2. |

##### G.8 Scenario: Hidden Layer Round Trip

| Step | Action | Expected Result |
|---|---|---|
| 1 | From (10,6) on Map 1, continue forward into the revealed passage | `player.mapId = 'forgotten-underpass'`, `player.x/y` set to the Map 2 entry coordinates (1,1) per Part 1 §2.2, facing east. `discovered['forgotten-underpass']` begins populating fresh (separate from Map 1's discovered set, per Part 2 §C.2). |
| 2 | Navigate to (5,4), trigger the item event | `player.inventory` includes `moon-toll-token`. Lore sign at the same area also logs its text (Part 1 §2.4). |
| 3 | Optionally detour to (2,2), fight Moonlit Warden | Standard combat loop (§A.6) applies. On defeat, `flags.wardenDefeated = true`, and the adjacent reward tile's `requiresFlag` gate (Part 1 §2.4 `'2,2-reward'`) now resolves, granting `lucky-toll-coin`. |
| 4 | Return to (1,1), trigger the return stairs | `player.mapId = 'map-kiosk-dungeon'`, position set to (10,6) facing west (re-emerging at the hidden wall tile, per Part 1 §2.4's `onUse` spec). `flags.underpassFound = true`. |
| 5 | Verify Map 1 state preserved | Player's earlier progress (key, defeated Goblin, open Toll Gate, etc.) is all still intact — confirms map-switching doesn't reset or duplicate the other map's state. |

##### G.9 Scenario: Normal Ending vs True Ending Gating

| Step | Action | Expected Result |
|---|---|---|
| 1 | Complete the main path (Mapstone obtained, boss defeated) WITHOUT ever finding the secret switch | Reaching the exit tile (1,1) with `mapstone` in inventory triggers `WIN_NORMAL`. Summary screen shows "Ending: Normal Route", no Secret Star badge. |
| 2 | Reset, replay, this time also complete the Underpass and obtain `moon-toll-token` before exiting | Reaching the exit with both `mapstone` AND `moon-toll-token` in inventory AND `flags.trueEndingUnlocked` true triggers `WIN_TRUE` instead. `badges.secretStar = true` is written to the save. |
| 3 | Edge case: player has `moon-toll-token` but somehow not `flags.trueEndingUnlocked` (shouldn't be reachable normally — test as a defensive check) | Win resolves to `WIN_NORMAL`, not `WIN_TRUE` — the flag, not just item possession, gates the true ending, per the exit event's stated condition (Part 1 §1.4's exit event plus the True Win condition in Part 1 §"Completion"). This guards against a future content patch that lets the token be acquired through some other path without going through the full Underpass loop. |

##### G.10 Scenario: Save / Continue / Reset

| Step | Action | Expected Result |
|---|---|---|
| 1 | Make meaningful progress (key, one fight, one door), then close/reload the tab without manually saving | Because `move`, `itemPickup`, `doorUnlock`, and `combatResolved` are all autosave triggers (§C.4), reloading should still find a save. `TITLE` screen shows "Continue Quest" enabled. |
| 2 | Click Continue | `validateSave` passes (player not in a wall, hp > 0, facing valid). State restores exactly: position, inventory, flags, counters, both maps' `discovered` sets, last 8 log lines. |
| 3 | Manually corrupt the save (e.g., via devtools, set `player.x` to a wall coordinate) and reload | `validateSave` fails. Continue button is hidden; only Start New Quest is available. Corrupt key is left in localStorage untouched (not auto-deleted, per §C.3). |
| 4 | Start fresh, then click Reset Quest mid-game with a confirm dialog | On confirming, `localStorage.removeItem(SAVE_KEY)` fires, state resets to `defaultState`, mode returns to `TITLE`. Canceling the confirm dialog leaves the in-progress game untouched. |
| 5 | Trigger a `QuotaExceededError` (e.g., fill localStorage artificially in a test harness) | Game does not crash. One single warning log line appears ("Heads up: this device can't save progress right now."), not repeated on every subsequent failed save attempt (`state.saveWarningShown` guard, §C.5). |

##### G.11 Scenario: Accessibility Pass

| Step | Action | Expected Result |
|---|---|---|
| 1 | Tab through the game screen using only keyboard, no mouse | Every control (turn/move/inspect/attack/use/map/save/reset/finish) is reachable in a logical order and operable with Enter/Space. |
| 2 | Use a screen reader, move several tiles | The `aria-live="polite"` status region (§E.17) updates each move with an accurate one-line summary; the scrolling log is also exposed as readable text, not canvas-only. |
| 3 | Enable OS/browser "prefers-reduced-motion" | Door-open and hidden-wall-reveal transitions apply instantly with no slide/fade (§B.5). Monster idle bob animation freezes to a static pose. No screen flash/shake ever occurs regardless of this setting (combat never had any). |
| 4 | Enable the app's `high-contrast` body class | Walls, floor, and accent colors swap to the high-contrast palette (§F.1). No information (door state, low HP, item type) depends on color alone — confirm low-HP warning is also reflected in the numeric HP value, and item types are distinguishable by inventory label/size, not color alone (§F.6). |
| 5 | Enable large-text / browser zoom to 200% | Control buttons remain tappable and don't overlap; canvas may shrink but controls and stat cards reflow rather than clip. |

##### G.12 Scenario: Mobile Touch Pass

| Step | Action | Expected Result |
|---|---|---|
| 1 | Load on a narrow viewport (e.g., 375px wide) in portrait | Control buttons (§ suggested layout in Part 1) are large enough for thumb taps, no horizontal scroll required to reach any control. |
| 2 | Rotate to landscape | Layout reflows without breaking; canvas and controls both remain visible without scrolling. |
| 3 | Tap Full Screen | Game enters fullscreen (or fails gracefully with a log/toast if the browser denies it — must not crash). Controls remain visible and usable in fullscreen. |
| 4 | Tap rapidly on Forward multiple times in quick succession (stress test for the debounced autosave and for double-processing a single move) | Each tap advances exactly one tile (or is correctly blocked by a wall) — no double-move-per-tap, no missed taps, no duplicate log lines from a single tap. |

##### G.13 Scenario: Service Worker / Offline

| Step | Action | Expected Result |
|---|---|---|
| 1 | Load the app fresh after the Roadside Realm files are added, confirm `sw.js`'s cache list and version were updated per Part 1's instructions | New files (`roadside-realm-data.js`, `roadside-realm.js`, any `-art.js`) are present in the cache manifest; `CACHE_VERSION` differs from the pre-Realm build. |
| 2 | Go offline (devtools "Offline" throttling) after first successful load | Roadside Realm still launches and plays fully — no network requests are attempted at any point during play (consistent with "No backend, no external APIs, no external asset loading"). |
| 3 | Ship a follow-up patch, bump `CACHE_VERSION` again, reload | Old cached assets are evicted; new version loads cleanly without requiring the user to manually clear site data. |

##### G.14 Scenario: Regression Check on Existing Modes

| Step | Action | Expected Result |
|---|---|---|
| 1 | Launch Road Pong, Hide & Seek, Banana Towers, trivia, and the scavenger hunt in turn, after the Realm integration | Each still launches and plays exactly as before. No shared global (`script.js` routing, `style.css` selectors, `sw.js` cache keys) was overwritten or shadowed by the new `RTA_ROADSIDE_REALM*` namespace. |
| 2 | Check the app's passenger-gate / driver-safety check (if present) | Still functions identically; Roadside Realm did not introduce any new always-on input capture (e.g., a stray global keydown listener) that could interfere with driver-mode restrictions elsewhere in the app. |

---

## 5. Production Expansion Notes

This section expands the build spec into production-facing guidance. Use it when turning the design into files, tickets, implementation phases, and QA passes.

### 5.1 Design Pillars

Roadside Realm should be judged against these pillars before adding, cutting, or reworking features:

- **Readable exploration:** the player always understands their position, facing, available actions, and immediate obstacle.
- **Small but complete RPG arc:** the game has introduction, growth, obstacle, boss, reward, ending, and optional secret mastery.
- **Road-trip fantasy identity:** every dungeon idea should connect to maps, signage, snacks, keys, tolls, motels, routes, or roadside landmarks.
- **No twitch pressure:** success comes from noticing, choosing, preparing, and exploring, not fast reactions.
- **Hidden content with clues:** secrets should feel discoverable after the player reads the environment, not arbitrary.
- **Static-app friendliness:** all code and assets remain local, lightweight, cacheable, and independent of network services.

### 5.2 Target Player Journey

The ideal first play session should follow this emotional curve:

| Beat | Player Feeling | Game Responsibility |
|---|---|---|
| Launch | Curiosity | Show a polished title state and a clear start option. |
| First room | Orientation | Teach turn, move, inspect, and log reading in one or two safe tiles. |
| First key | Momentum | Give the player an obvious locked-gate problem and a reachable solution. |
| First fight | Competence | Make combat understandable with visible HP changes and simple language. |
| Toll Gate | Progress | Confirm that items matter and world state changes persist. |
| Mid-map clue | Suspicion | Seed moon scratches, odd wall text, and underpass hints without requiring them. |
| Boss | Tension | Make the Signpost Ogre distinct through telegraph behavior and strong flavor. |
| Mapstone | Relief | Give a visible quest-state update and a clear return objective. |
| Normal ending | Closure | Reward the main path fully, even if secrets were missed. |
| Secret discovery | Delight | Make the hidden room feel intentional and worth finding. |
| True ending | Mastery | Acknowledge the extra route with unique copy, badge, and summary details. |

### 5.3 Implementation Ownership Map

Keep responsibilities separated so the feature does not turn into one giant script:

| Area | Recommended Home | Owns |
|---|---|---|
| Static content | `js/games/roadside-realm-data.js` | maps, items, monsters, events, dialogue banks, balance constants |
| Runtime state | `js/games/roadside-realm.js` | current mode, player state, flags, counters, save/load, actions |
| Rendering | `js/games/roadside-realm.js` first, optional `roadside-realm-art.js` later | canvas drawing helpers, minimap, sprites, high-contrast palette |
| App integration | `index.html`, `script.js` | mode card, section routing, script includes, app summary flow |
| Styling | `style.css` | Realm layout, controls, status, responsive behavior, accessibility variants |
| Offline support | `sw.js` | cache version and new file manifest entries |
| QA | `docs/roadside-realm-qa.md` | manual test paths, known limitations, release checklist |
| Maintainer overview | `docs/roadside-realm-summary.md` | quick summary of scope, flow, architecture, controls, QA, and sync notes |
| Optional image production | `docs/roadside-realm-image-spec.md` | exact raster/vector asset sizes, export settings, sprite sheets, UI icons, and image QA |

### 5.4 Runtime State Contract

The runtime should keep all mutable state in one Realm-owned object, never scattered through DOM attributes. Suggested high-level shape:

```js
const realmState = {
  mode: 'TITLE',
  returnTo: null,
  activeMonsterId: null,
  player: {
    mapId: 'map-kiosk-dungeon',
    x: 1,
    y: 1,
    facing: 'east',
    hp: 18,
    maxHp: 18,
    attack: 4,
    defense: 1,
    level: 1,
    xp: 0,
    gold: 0,
    inventory: [],
  },
  flags: {},
  counters: {},
  defeatedMonsters: {},
  collectedItems: {},
  openedDoors: {},
  discovered: {},
  log: [],
  ui: {
    mapOpen: false,
    inventoryOpen: false,
    saveWarningShown: false,
  },
};
```

Implementation rule: state mutators should update the state first, then call a single render/update pipeline:

```text
input -> action resolver -> state mutation -> autosave if needed -> render canvas -> render DOM -> update live region
```

This keeps keyboard, touch, and debug controls from drifting apart.

### 5.5 Data Contracts

Map, item, monster, and event data should be boring and explicit. Prefer stable IDs over inferred behavior.

#### Map Contract

```js
{
  id: 'map-kiosk-dungeon',
  name: 'Map Kiosk Dungeon',
  width: 12,
  height: 12,
  start: { x: 1, y: 1, facing: 'east' },
  tiles: [
    '############',
    '#P..M......#',
    // ...
  ],
}
```

Rules:

- Every row must match `width`.
- Every map must have one start or explicit transition entry.
- Walls are collision by default.
- Special behavior belongs in events, not magic tile-character assumptions.
- Hidden-room and underpass tiles should not appear on the minimap until discovered.

#### Event Contract

```js
{
  id: 'main-rusty-road-key',
  mapId: 'map-kiosk-dungeon',
  x: 3,
  y: 2,
  trigger: 'enter',
  type: 'item',
  itemId: 'rusty-road-key',
  once: true,
  text: 'A motel-style key hangs from a bent route marker.',
}
```

Rules:

- `id` must be unique.
- `trigger` should be one of `enter`, `inspect`, `attack`, `use`, or `exit`.
- `once: true` events must write to `collectedItems`, `openedDoors`, or a named flag.
- Locked, gated, or conditional events must include player-facing blocked text.

#### Monster Contract

```js
{
  id: 'dust-goblin-1',
  monsterType: 'dust-goblin',
  mapId: 'map-kiosk-dungeon',
  x: 4,
  y: 1,
  hp: 8,
  attack: 3,
  defense: 0,
  xp: 3,
  gold: 2,
  boss: false,
}
```

Rules:

- Instance IDs should differ from monster type IDs.
- Defeat state is saved by instance ID.
- Bosses can use custom turn logic, but basic monsters should share one combat path.
- Monster flavor can vary by type, but combat math should remain predictable.

### 5.6 Interaction Rules In Plain English

Use this as the behavioral contract for manual QA:

- Turning never changes position.
- Moving into a wall, closed hidden wall, locked door, or live monster leaves the player in place.
- Moving backward is allowed during exploration and as a boss-dodge action during the Signpost Ogre fight.
- Inspecting always produces useful text, even when nothing special is ahead.
- Attack only works against a live monster directly ahead.
- Item pickup should happen once and should immediately update inventory/status/log.
- Door unlock should consume or check the correct key consistently; V1.0 may keep quest keys rather than consume them.
- Healing should never raise HP above max HP.
- Defeat should apply the penalty, move the player to a safe tile, keep the game recoverable, and never save an HP `<= 0` state.
- Winning should lock into a win state until reset or return-to-app flow; continuing exploration after a win is a later design choice.

### 5.7 Screen And UI Detail

Roadside Realm should have these visible UI regions:

| Region | Purpose | Notes |
|---|---|---|
| Title panel | Start, continue, reset if save exists | Avoid a marketing page; this is the game entry. |
| Canvas viewport | First-person dungeon view | Include `aria-label`; do not rely on canvas for critical text. |
| Status row | HP, attack, defense, level, gold/score, objective | Must update after every action. |
| Inventory row/panel | Quest items and usable items | Empty state should be compact and readable. |
| Log | Recent events | Keep last 8-12 lines; newest line should be easy to spot. |
| Controls | Turn, forward, back, inspect, attack, item, map, save | Mobile tap targets should be comfortably large. |
| Minimap | Optional discovery aid | Only shows discovered tiles. |
| Summary | Ending text, score, badges, stats | Distinguish normal and true endings clearly. |

Do not put instructions as long permanent text blocks inside the play surface. Teach through first-room events, button labels, tooltips, and log messages.

### 5.8 Writing And Dialogue Guidelines

Voice should be concise, playful, and concrete. Good lines do at least one of these:

- reveal a clue
- explain a state change
- make a room memorable
- confirm an action worked
- warn without scolding

Preferred line length:

```text
Log line: 8-18 words.
Status line: 10-24 words.
Ending paragraph: 30-70 words.
```

Examples:

```text
Good: The toll gate clicks open with a sleepy metal sigh.
Good: Moon scratches glimmer where the wall forgot to be ordinary.
Good: The Mapstone warms your pocket. The exit route should answer now.
Avoid: You used the key and opened the door.
Avoid: A mysterious ambience surrounds the eldritch hallway of doom.
```

### 5.9 Balance Targets

V1.0 should be forgiving but not automatic.

| Element | Target |
|---|---|
| Main completion time | 5-12 minutes |
| Secret completion time | 3-8 extra minutes |
| First monster | defeated in 2-4 player attacks |
| Normal monsters | usually defeated in 3-5 player attacks |
| Boss | 6-10 player attacks, with telegraph dodge teaching |
| Optional Warden | harder than boss if underprepared, fair with secret rewards |
| Healing economy | one reliable heal before boss, one optional secret heal/reward |
| Defeat penalty | noticeable, never run-ending |

Balance should be tested with average luck. Avoid tuning around perfect play.

### 5.10 Secret Design Detail

The hidden route should use a three-clue pattern:

| Clue | Location | Player Interpretation |
|---|---|---|
| Early rumor | Near start or first hallway | There is something odd about moon marks. |
| Action hint | Near switch or suspicious wall | Inspecting or pressing something can reveal a passage. |
| Confirmation | At hidden wall | The player knows this is the right wall before it opens. |

Secret content should remain optional, but it should not feel invisible. A player who reads logs and inspects odd places should reasonably discover it.

### 5.11 Debug And Test Hooks

Optional debug mode may be enabled only through a local query string:

```text
?realmDebug=1
```

Useful debug panel fields:

- current mode
- map ID
- x/y/facing
- tile ahead
- event ahead
- active monster
- HP and inventory
- flags
- discovered count
- save availability

Debug controls may include:

- teleport to boss
- give Mapstone
- reveal hidden wall
- enter underpass
- trigger normal ending
- trigger true ending

Debug UI must stay hidden during normal play and should not be required to complete QA.

### 5.12 Save And Migration Detail

Save data should be resilient because localStorage can be missing, corrupt, old, or full.

Required behavior:

- Bad JSON is ignored without crashing.
- Invalid position is ignored without crashing.
- Saves with dead player HP are ignored or repaired to a safe respawn state.
- Save writes are debounced for rapid movement.
- A save failure produces one friendly warning, not repeated spam.
- Reset asks for confirmation and clears only the Realm save key.

Future migration example:

```js
function migrate(save) {
  if (!save.schemaVersion) return migratePreVersionSave(save);
  if (save.schemaVersion === 1) return save;
  return null;
}
```

### 5.13 Accessibility Acceptance Detail

Accessibility is part of completion, not polish after the fact.

Required checks:

- All controls are reachable by keyboard.
- Arrow/WASD shortcuts work only while the Realm screen is active.
- Buttons have visible focus states.
- Canvas has a useful label.
- Log text duplicates important canvas-only events.
- Status line uses `aria-live="polite"`.
- High contrast changes canvas palette and DOM controls.
- Reduced motion disables slide/bob animations.
- Large text and 200% zoom do not overlap controls.
- Mobile portrait and landscape remain playable.

### 5.14 Build Milestone Acceptance

Each phase should end with a playable checkpoint:

| Phase | Acceptance Standard |
|---|---|
| Shell | Card opens a Realm screen without breaking other modes. |
| Data | Validator passes; maps, items, monsters, and events load. |
| Movement | Player can turn, move, collide, and see status/log updates. |
| Rendering | Canvas clearly shows walls, open corridors, doors, monsters, items, compass, and minimap. |
| Interactions | Inspect, key, door, treasure, fountain, switch, and hidden wall work. |
| Combat | Basic enemies, boss telegraph, defeat, rewards, and level-up work. |
| Endings | Normal ending, underpass, Moon Toll Token, and true ending work. |
| Persistence | Save, continue, reset, bad-save handling, cache update, and QA doc are complete. |

### 5.15 Maintainer Summary Sync Rules

The summary file is `docs/roadside-realm-summary.md`. Update it whenever any of these change:

- game title, premise, or tone
- required files
- main path or secret path flow
- controls
- state/save schema
- map IDs, item IDs, monster IDs, or ending conditions
- build order
- QA checklist
- known limitations

The summary should stay short enough to read in a few minutes. Do not copy all of this game plan into it. It should answer:

```text
What is this game?
What must V1.0 include?
What files own the feature?
How does the player complete it?
How are secrets and true ending triggered?
What must be tested before release?
```

### 5.16 Open Implementation Questions

These are decisions to make during implementation, preferably after inspecting the existing app patterns:

- Should Roadside Realm use the app's global summary screen or its own in-section summary?
- Does the existing app already have utility functions for showing/hiding modes and fullscreen?
- Should the optional `roadside-realm-art.js` split happen immediately or only after `roadside-realm.js` becomes unwieldy?
- Should quest keys remain in inventory after use, or move into a key-item history list?
- Should completed normal-ending saves allow “continue for secrets,” or should true ending require a reset/replay?
- What visible app version format does the repo currently use, and where should the Roadside Realm version bump appear?

Until answered, use the conservative defaults in this spec: follow existing app patterns, keep V1.0 static and vanilla, make normal completion final, and avoid extra files unless they reduce real complexity.

---

## 6. One-Pass Perfect V1.0 Target

This section defines the final target: Roadside Realm should be buildable in one focused production pass and should feel complete on the first shipped version. The player can still discover the optional secret path, but the implementation should not depend on a later polish pass to feel good.

### 6.1 What "One-Pass Perfect" Means

For this project, "one-pass perfect" means:

- the main adventure, secret route, normal ending, and true ending all ship together
- every required mechanic has a finished UI, finished copy, and tested failure state
- no feature is left as a placeholder, stub, or "TODO polish later" path
- the player can complete a normal run without external instructions
- an attentive player can find the secret path in the same run before exiting
- the implementation follows existing app patterns instead of creating a fragile one-off shell
- the summary file and QA file are updated alongside the game

This does not mean the game must be enormous. It means the game must be complete, clear, balanced, and charming at the size V1.0 chooses.

### 6.2 Final Player-Facing Promise

If a player opens Roadside Realm, they should get:

```text
A compact first-person road-fantasy dungeon crawler with a complete main quest,
a hidden optional route, a boss with a readable special move, a normal ending,
a true ending, saves, touch controls, keyboard controls, and accessible text output.
```

Everything in the interface should support that promise. Avoid adding systems that sound impressive but do not improve the player experience in a 5-20 minute mini-game.

### 6.3 Perfect First Session Script

This is the ideal first run from the player's perspective:

| Minute | Experience | What The Game Must Do |
|---|---|---|
| 0 | Player opens the Roadside Realm card | Title screen appears instantly; Start and Continue are clear. |
| 1 | Player learns movement | First hallway makes turn/move/inspect obvious through safe prompts. |
| 2 | Player sees a locked Toll Gate | The goal is concrete: find a key. |
| 3 | Player finds the Rusty Road Key | The log, inventory, and objective all update. |
| 4 | Player fights a Dust Goblin | Combat is readable, short, and mildly risky. |
| 5 | Player opens the Toll Gate | The world visibly changes and stays changed. |
| 6 | Player finds healing and clue text | The boss route is supported; secret route is foreshadowed. |
| 7 | Player reaches Signpost Court | Boss introduction feels distinct from normal fights. |
| 8 | Player learns Big Spin | The telegraph teaches retreat without requiring reflexes. |
| 9 | Player defeats the boss | Reward, XP, and objective update cleanly. |
| 10 | Player gets the Mapstone | Return objective is obvious. |
| 11 | Player may exit normally | Normal ending feels complete, not like a bad ending. |
| 12+ | Attentive player follows moon clues | Hidden wall and Forgotten Underpass feel earned, not random. |
| 15+ | Player gets Moon Toll Token | True ending path is clear. |
| 18+ | Player exits with both relics | Secret Star summary feels like a satisfying bonus. |

### 6.4 Final Room Plan

Use the existing map/event tables as the authority, but every room should have a purpose. If a room does not teach, reward, threaten, foreshadow, route, or resolve something, revise it.

| Room | Purpose | Required Content | Player Takeaway |
|---|---|---|---|
| Map Kiosk Entry | Start and controls | safe floor, exit tile, first inspect text | "I know how to move and where the exit is." |
| Route Marker Hall | First exploration | simple bends, readable walls, first monster nearby | "The dungeon is navigable." |
| Key Nook | First reward | Rusty Road Key, flavor prop | "Items solve world problems." |
| Toll Gate | First lock | locked door, blocked text, unlock feedback | "The key mattered." |
| Snack Shrine | Recovery | healing fountain or Apple Juice Potion | "I can prepare before danger." |
| Detour Gallery | Optional flavor | clue text, treasure, light branching | "Inspecting odd things pays off." |
| Moon-Scratch Wall | Secret foreshadow | suspicious inspect text | "There is something hidden here." |
| Signpost Court | Main boss | Signpost Ogre, telegraph behavior | "This is the climax." |
| Mapstone Niche | Main reward | Mapstone after boss | "I completed the core quest." |
| Moon Toll Booth | Hidden room | underpass entry, meaningful reward | "The secret was real." |
| Forgotten Underpass Entry | Secret transition | new palette, safe landing | "I found a second layer." |
| Underpass Loop | Secret challenge | Warden route, token route, return route | "This is optional but complete." |
| Exit Route | Resolution | normal/true ending gate | "My choices changed the ending." |

### 6.5 Golden Path And Secret Path In One Run

The game should allow this perfect one-run route:

```text
Start -> learn controls -> find Rusty Road Key -> unlock Toll Gate ->
collect heal -> defeat required enemies -> notice moon clue -> press secret switch ->
open hidden wall -> leave secret for later or enter now -> defeat Signpost Ogre ->
collect Mapstone -> complete Forgotten Underpass -> collect Moon Toll Token ->
return to exit -> true ending
```

Rules:

- The player must not be forced into the secret path.
- The player must not be locked out of the secret path by defeating the boss.
- The player must not be forced to replay the whole game to get the true ending if they discover the secret before choosing the final exit.
- If the player chooses the normal ending first, the run is complete. V1.0 can ask the player to reset for a true-ending run unless a "continue before final exit" pattern already exists in the app.

### 6.6 Objective Text Progression

Use clear objective text so the player never has to infer the next required action from memory.

| State | Objective Text |
|---|---|
| New run | Find the Mapstone hidden inside the roadside realm. |
| Locked gate seen | Find the Rusty Road Key for the Toll Gate. |
| Key found | Return to the Toll Gate and unlock the route. |
| Gate opened | Follow the marked route toward Signpost Court. |
| Low HP | Find a snack, fountain, or safer route before the next fight. |
| Boss seen | Defeat the Signpost Ogre and watch for its Big Spin. |
| Boss defeated | Claim the Mapstone beyond Signpost Court. |
| Mapstone found | Return to the exit route near the map kiosk. |
| Secret clue seen | Moon scratches suggest a hidden wall somewhere nearby. |
| Secret switch pressed | Find the moon-scratched wall and inspect the route. |
| Underpass entered | Recover the Moon Toll Token or return to the main route. |
| Moon token found | Return to the map kiosk exit for the secret route home. |
| Normal win ready | Step onto the exit to restore the route. |
| True win ready | Step onto the exit to restore the moonlit route. |

### 6.7 Exact Content Counts For V1.0

These counts are the target. More content is allowed only if the core remains clean and tested.

| Content Type | Target Count | Notes |
|---|---:|---|
| Main maps | 1 | Map Kiosk Dungeon. |
| Secret maps | 1 | Forgotten Underpass. |
| Main rooms/areas | 8-10 | Small, readable, purposeful. |
| Secret rooms/areas | 4-5 | Compact optional layer. |
| Normal enemy types | 4-5 | Dust Goblin, Map Bat, Toll Troll, Cone Imp, Snack Mimic. |
| Required bosses | 1 | Signpost Ogre. |
| Optional bosses/guardians | 1 | Moonlit Warden. |
| Quest items | 3 | Rusty Road Key, Mapstone, Moon Toll Token. |
| Healing items/tiles | 2-3 | Apple Juice Potion, Snack Charm, fountain. |
| Utility rewards | 2-3 | Postcard Shield, Compass Sticker, Lucky Toll Coin. |
| Secret clues | 3 | rumor, action hint, confirmation. |
| Endings | 2 | Normal and true. |
| Badges | 4-7 | Optional summary awards only. |

### 6.8 Combat Feel And Numbers

Combat should feel like a tiny RPG, not a spreadsheet.

Player starting stats:

```text
HP 18
Attack 4
Defense 1
Level 1
Gold 0
```

Recommended enemy tuning:

| Enemy | HP | Attack | Defense | XP | Gold | Fight Role |
|---|---:|---:|---:|---:|---:|---|
| Dust Goblin | 7 | 3 | 0 | 3 | 2 | first readable fight |
| Map Bat | 6 | 2 | 0 | 3 | 2 | low damage, occasional miss |
| Toll Troll | 12 | 4 | 1 | 5 | 4 | gate-area toughness check |
| Cone Imp | 9 | 4 | 0 | 4 | 3 | mid-map pressure |
| Snack Mimic | 10 | 3 | 1 | 4 | 5 | optional treasure surprise |
| Signpost Ogre | 26 | 5 | 1 | 8 | 8 | main boss with Big Spin |
| Moonlit Warden | 22 | 5 | 2 | 8 | 6 | optional secret guardian |

Damage:

```js
damage = Math.max(1, attacker.attack + rand(0, 2) - defender.defense)
```

Big Spin:

```text
Every third Ogre monster-turn telegraphs instead of dealing damage.
The following Ogre turn resolves Big Spin unless the player retreated.
Big Spin damage is normal Ogre damage + 3.
```

Combat polish requirements:

- show player HP and monster HP changes in the log
- disable or clearly no-op Attack when no monster is ahead
- prevent double attacks from key repeat or rapid taps
- keep boss telegraph visible in the log until the next action
- let the player use a healing item during combat
- never allow a defeated monster to attack afterward

### 6.9 Item Detail And Use Cases

Each item should have a clear gameplay reason.

| Item | Type | Use | Acquisition | Required? |
|---|---|---|---|---|
| Rusty Road Key | quest | Opens Toll Gate | Key Nook | Yes |
| Mapstone | quest | Enables normal ending | After Signpost Ogre | Yes |
| Moon Toll Token | quest | Enables true ending | Forgotten Underpass | Secret |
| Apple Juice Potion | consumable | Restores 8 HP | Main route treasure | No |
| Snack Charm | passive | Increases max HP by 2 or grants one small heal | Snack Shrine or hidden room | No |
| Postcard Shield | passive | +1 defense | Secret or optional treasure | No |
| Compass Sticker | utility | Improves objective/minimap hint text | Optional clue reward | No |
| Lucky Toll Coin | badge/reward | Summary bonus or +5 score | Warden reward | No |

Inventory UI rules:

- quest items are always visible once found
- usable items have a clear Use button or selection state
- passive items show effect text, not a fake Use action
- collected treasure cannot be collected twice
- if inventory is empty, show a compact empty state: "No items yet."

### 6.10 Puzzle And Secret Polish

Puzzles should be light, readable, and solvable without trial-and-error brute force.

Required secret clue chain:

1. Near the entry, a sign says the moon route "only opens for travelers who read the walls."
2. Near the secret switch, inspect text mentions a route marker that clicks inward.
3. At the hidden wall, moon scratches appear after the switch is pressed.

Optional puzzle ideas that fit V1.0:

| Puzzle | Mechanic | Reward | Keep If |
|---|---|---|---|
| Loose Map Pin | Inspect a map pin twice or after clue | Compass Sticker | It teaches inspection. |
| Three Route Signs | Inspect signs in hinted order | shortcut or treasure | It does not block main progress. |
| Toll Booth Choice | Choose snack/gold/token flavor response | small reward | It is quick and reversible. |
| Hidden Road Line | Follow wall text directions | Moon Toll Booth | It strengthens secret discovery. |

Avoid:

- puzzles requiring exact unhinted coordinates
- timed inputs
- memory sequences longer than three steps
- penalties for inspecting
- secrets that require reading source code or using debug mode

### 6.11 Canvas Scene Requirements

The first-person view should communicate state at a glance.

Required visual states:

- ordinary wall
- open corridor
- side corridor hint
- locked door
- opened door or cleared doorway
- hidden wall before clue
- hidden wall after secret switch
- treasure/item ahead
- monster ahead
- boss ahead
- stairs/underpass transition
- exit route
- low-HP status in DOM, not color-only

Rendering priorities:

1. Draw sky/ceiling and floor.
2. Draw far-to-near corridor slices.
3. Draw side walls and door overlays.
4. Draw monster or item in the nearest relevant tile.
5. Draw hidden-wall clue overlay when unlocked.
6. Draw compass and minimap if enabled.

Pixel-level acceptance:

- the canvas is never blank after launch
- immediate wall/door/monster states are visually distinct
- high contrast mode remains legible
- mobile canvas scales without squashing controls
- no critical text appears only inside the canvas

### 6.12 Sound And Motion Policy

V1.0 may ship without sound. If sound is added, it must be optional, local, and lightweight.

Allowed sound types:

- short UI click
- door open
- item pickup
- soft combat tap
- ending chime

Do not add:

- autoplay sound
- remote audio
- loud jumps
- looping music by default
- audio required for clues

Motion:

- door and hidden-wall reveals may animate for 150-250ms
- monster idle bob may be subtle
- reduced motion must make these instant/static
- no screen shake
- no flashing damage effects

### 6.13 Deluxe Graphics And Control Feel

Roadside Realm should feel visually special even without external image assets. The target is "handmade roadside fantasy arcade panel": clear silhouettes, bold signage, chunky controls, warm map colors, and memorable monster shapes.

If the build uses exported raster or vector images, follow `docs/roadside-realm-image-spec.md`. That document is the authority for pixel sizes, DPI/source settings, file names, sprite sheets, icon dimensions, and image QA.

#### Art Pillars

| Pillar | Meaning | Implementation |
|---|---|---|
| Chunky | Shapes are readable on phones | thick outlines, simple geometry, large glyphs |
| Roadside | Fantasy is filtered through travel objects | signs, keys, stickers, maps, cones, toll booths |
| Cozy Weird | Mysterious without becoming horror | moon marks, glowing routes, friendly color accents |
| Clear State | Art shows gameplay state | locked/open doors, defeated enemies, collected treasure |
| Lightweight | No external assets required | canvas primitives and optional inline SVG data only |

#### Visual Density Target

Each first-person frame should include at least three layers of visual information:

1. **Environment layer:** wall/floor/ceiling color, texture marks, route lines.
2. **Gameplay layer:** door, monster, item, stairs, hidden clue, or exit.
3. **HUD layer:** compass, optional minimap, status text outside canvas.

Empty corridors should still look intentional. Add floor route stripes, small map-pin scuffs, wall cracks, or sign bolts so "nothing ahead" does not look unfinished.

#### Directional Pad Requirement

Mobile controls should include a proper directional pad, not only a row of text buttons.

Recommended layout:

```text
        [ Forward ]
[ Turn Left ] [ Back ] [ Turn Right ]
```

Alternative compact layout:

```text
          ▲
      ◀   ▼   ▶
```

D-pad behavior:

- Up: move forward.
- Left: turn left.
- Right: turn right.
- Down: move backward or boss retreat.
- Center/nearby primary button: Inspect.
- Secondary buttons: Attack, Use Item, Map, Save.

Button requirements:

- minimum target size: 48px by 48px
- icon or arrow must be visible without reading long text
- label must still be available through `aria-label`
- disabled state must be obvious by opacity and text/icon state, not color alone
- pressing and holding should not cause uncontrolled repeat movement
- keyboard and D-pad must call the same action handlers

Suggested control markup:

```html
<div class="realm-dpad" aria-label="Movement controls">
  <button data-action="forward" aria-label="Move forward">▲</button>
  <button data-action="turnLeft" aria-label="Turn left">◀</button>
  <button data-action="backward" aria-label="Move backward">▼</button>
  <button data-action="turnRight" aria-label="Turn right">▶</button>
</div>
<div class="realm-action-pad" aria-label="Action controls">
  <button data-action="inspect">Inspect</button>
  <button data-action="attack">Attack</button>
  <button data-action="useItem">Item</button>
  <button data-action="toggleMap">Map</button>
</div>
```

Suggested CSS shape:

```css
.realm-dpad {
  display: grid;
  grid-template-columns: repeat(3, minmax(48px, 64px));
  grid-template-rows: repeat(2, minmax(48px, 64px));
  gap: 8px;
  justify-content: center;
}

.realm-dpad [data-action="forward"] { grid-column: 2; grid-row: 1; }
.realm-dpad [data-action="turnLeft"] { grid-column: 1; grid-row: 2; }
.realm-dpad [data-action="backward"] { grid-column: 2; grid-row: 2; }
.realm-dpad [data-action="turnRight"] { grid-column: 3; grid-row: 2; }
```

#### Canvas Composition

Use a 720x420 design coordinate system and scale to fit. Divide the view into zones:

| Zone | Coordinates | Purpose |
|---|---|---|
| Sky/ceiling | y 0-150 | gradient, dim map glow, hanging route signs |
| Horizon | y 120-250 | wall vanishing point, door face, monster head/body |
| Floor | y 250-420 | route stripes, item glow, stairs, shadow |
| HUD corner left | x 12 y 12 | minimap when enabled |
| HUD corner right | x 600 y 12 | compass |
| Center focus | x 260-460 y 120-330 | monster, treasure, door, hidden mark |

Every draw helper should accept a `theme` object so high contrast and underpass palette changes are easy.

#### Palette Expansion

Main dungeon:

| Token | Color | Use |
|---|---|---|
| `--realm-sky` | `#24314a` | cool ceiling/sky gradient |
| `--realm-floor` | `#5b4632` | warm road-dust floor |
| `--realm-wall` | `#7d7462` | map-kiosk stone/cardboard walls |
| `--realm-wall-dark` | `#45413a` | distant wall and shadows |
| `--realm-route-yellow` | `#f3c64e` | route line, objective glow |
| `--realm-sign-green` | `#3e8f68` | road sign panels |
| `--realm-cone-orange` | `#e56b2f` | cones, warnings, attack accents |
| `--realm-moon-blue` | `#8fd3ff` | secret route and underpass glow |
| `--realm-ink` | `#17191f` | outlines |
| `--realm-paper` | `#f4e6c1` | map paper and UI panels |

Forgotten Underpass:

| Token | Color | Use |
|---|---|---|
| `--realm-underpass-wall` | `#42566c` | blue-gray concrete |
| `--realm-underpass-floor` | `#263342` | dark pavement floor |
| `--realm-underpass-glow` | `#9de8ff` | moon toll marks |
| `--realm-underpass-moss` | `#77a878` | soft growth and age |
| `--realm-underpass-shadow` | `#121923` | deep recesses |

High contrast replacements should use stronger black/white/yellow/cyan separation and remove subtle texture dependence.

#### Sprite Style

Sprites should be assembled from canvas primitives: circles, rounded rectangles, triangles, lines, and route-sign shapes. Use thick dark outlines, 2-3 flat fills, and one highlight color. Each monster needs a unique silhouette.

| Sprite | Silhouette | Colors | Signature Detail | Animation |
|---|---|---|---|---|
| Dust Goblin | squat cone-backed figure | tan, gray, route yellow | tiny map scrap shield | slow side-to-side shuffle |
| Map Bat | wide wings, tiny body | dark blue, paper cream | map-fold wing lines | wing flap every idle frame |
| Toll Troll | tall blocky toll-post body | green, rust, dark gray | striped barrier-arm club | club lift on attack |
| Cone Imp | traffic cone body | cone orange, white stripe, black | little sign-pole spear | bounce and tilt |
| Snack Mimic | snack bag chest | red, gold, dark brown | zipper teeth and crumb eyes | bag crinkle pulse |
| Signpost Ogre | huge torso with arrow arms | sign green, yellow, asphalt gray | rotating arrow-sign arms | arms spin faster before Big Spin |
| Moonlit Warden | tall crescent guardian | moon blue, silver, underpass shadow | crescent halo and toll-token eye | faint float, no bob in reduced motion |

Sprite draw signature:

```js
function drawMonsterSprite(ctx, monsterType, distance, pose, theme) {
  const box = spriteBoxForDistance(distance);
  ctx.save();
  ctx.translate(box.cx, box.cy);
  ctx.scale(box.scale, box.scale);
  // draw silhouette, outline, highlights, pose details
  ctx.restore();
}
```

Pose values:

```text
idle
alert
hit
attack
defeated
telegraph
```

#### Sprite Construction Details

Dust Goblin:

- Body: lumpy rounded rectangle, low to ground.
- Head: half-circle with two bright eyes.
- Accessory: torn map scrap used like a shield.
- Attack pose: shield jerks forward and dust puffs appear near feet.
- Defeated pose: map scrap lies flat, eyes become small arcs.

Map Bat:

- Body: small map-pin shape.
- Wings: two folded paper polygons.
- Wing lines: thin darker crease strokes.
- Miss pose: bat shifts upward with a swoosh arc.
- Hit pose: wings fold inward.

Toll Troll:

- Body: toll booth post with chunky legs.
- Head: square sign face.
- Club: striped barrier gate.
- Attack pose: barrier arm swings diagonally.
- Defeated pose: barrier arm drops and sign face turns blank.

Cone Imp:

- Body: triangle traffic cone with white stripe.
- Face: two bright dots under cone lip.
- Spear: bent sign pole.
- Attack pose: cone tilts forward.
- Defeated pose: cone tips sideways.

Snack Mimic:

- Body: crinkled snack bag.
- Mouth: zipper-like jagged opening.
- Eyes: crumb dots.
- Treasure disguise: draw as closed snack bag until attacked or inspected.
- Defeated pose: bag deflates.

Signpost Ogre:

- Body: stacked road signs bolted into a broad torso.
- Head: old route shield with one glowing eye.
- Arms: arrow signs pointing different directions.
- Telegraph pose: arms rotate outward with route-yellow arcs.
- Big Spin pose: draw circular motion arcs around torso.
- Defeated pose: arrows droop and Mapstone glow appears behind it.

Moonlit Warden:

- Body: tall underpass shadow robe.
- Head: crescent moon ring.
- Eye: glowing toll token.
- Attack pose: crescent opens like a gate.
- Defeated pose: crescent dims and token glow transfers to reward.

#### Item Glyphs

Items need big readable glyphs:

| Item | Glyph | Glow |
|---|---|---|
| Rusty Road Key | motel key tag with tooth | warm yellow |
| Mapstone | folded map tile with gem center | route yellow |
| Moon Toll Token | coin with crescent cutout | moon blue |
| Apple Juice Potion | tiny bottle with apple label | amber |
| Snack Charm | wrapped snack with string loop | red/gold |
| Postcard Shield | postcard rectangle with shield crease | paper cream |
| Compass Sticker | round sticker with needle | green/yellow |
| Lucky Toll Coin | small coin with booth icon | gold |

Item render rule:

```text
If item is in the tile ahead, draw it floating above the floor route stripe.
If item is on the player's tile and auto-picked, remove it before the next render.
Collected items never continue glowing in the world.
```

#### Door, Wall, And Secret Graphics

Locked Toll Gate:

- Draw as horizontal striped barrier across the corridor.
- Add a keyhole plate on the right side.
- Locked state has two small red/orange warning reflectors.
- Open state lifts the barrier or removes it with a short slide.

Hidden wall:

- Before clue: identical to normal wall except inspect text can hint.
- After secret switch: faint moon scratches visible in the center.
- Opening: center crack glows moon blue, then wall slides apart.
- Opened: draw a narrow underpass stair glyph beyond the wall.

Exit route:

- Draw road-map route lines converging toward a glowing kiosk frame.
- Without Mapstone: route lines are broken/dim.
- With Mapstone: route lines connect and pulse gently.
- With true ending: add moon-blue secondary route line beside yellow line.

#### Minimap Graphics

The minimap should look like a tiny folded road map, not a generic grid.

Minimap states:

| Tile | Visual |
|---|---|
| Undiscovered | not drawn |
| Floor | paper square |
| Wall | dark ink block |
| Door | small striped line |
| Player | triangular arrow |
| Monster known | tiny dot or warning mark only if encountered |
| Secret discovered | moon-blue outline |
| Exit | route-yellow border |
| Underpass stairs | blue stair tick |

Do not reveal the hidden room or underpass until discovered.

#### Animation States

Use tiny state flags instead of a full animation engine:

```js
const fx = {
  lastAction: 'move',
  actionStartedAt: performance.now(),
  doorOpening: null,
  wallOpening: null,
  monsterPose: 'idle',
  damageNumber: null,
};
```

Allowed animations:

- movement nudge: 80-120ms
- turn wipe or compass tick: 80-120ms
- item pickup sparkle: 200ms
- door open slide: 150-250ms
- hidden wall open slide: 200-300ms
- monster hit squash: 120ms
- boss telegraph spin arcs: until resolved

Reduced motion:

- set animation durations to `0`
- keep pose changes as static frames
- preserve all gameplay information through log and status text

#### Graphical QA

Before shipping, visually check:

- every monster is identifiable by silhouette in grayscale
- locked and opened doors are distinguishable
- hidden wall state 1 and normal wall are visually identical until clue state
- hidden wall state 2 has a visible moon mark
- boss telegraph has both visual and text cues
- items are recognizable at mobile size
- minimap is readable but does not dominate the screen
- high contrast mode still separates wall, floor, monster, item, and door
- no UI text overlaps the D-pad or action buttons
- canvas remains nonblank on first render, after map transition, after defeat, and after win

### 6.14 Enhanced Screen Layout

The game should feel like a compact handheld dungeon device embedded in the app.

Recommended desktop layout:

```text
+------------------------------------------------------+
| Status: HP / ATK / DEF / Level / Gold / Objective    |
+-----------------------------+------------------------+
|                             | Inventory              |
|        Canvas View          | Log                    |
|                             |                        |
+-----------------------------+------------------------+
| D-pad                       | Inspect Attack Item Map |
+------------------------------------------------------+
```

Recommended mobile layout:

```text
+---------------------------+
| Status / Objective        |
+---------------------------+
| Canvas View               |
+---------------------------+
| Log latest 3-5 lines      |
+---------------------------+
|      ▲                    |
|  ◀   ▼   ▶   Inspect      |
| Attack Item Map Save      |
+---------------------------+
```

Responsive rules:

- Canvas appears before controls.
- Controls remain visible without horizontal scrolling.
- Log can collapse to fewer lines on short screens.
- Inventory can become a horizontal chip row.
- Summary screen can replace the canvas area after win.
- Fullscreen mode should keep the D-pad visible.

### 6.15 Final Polish Pass

This polish pass is required inside V1.0, not after it.

Polish checklist:

- Buttons depress visually on tap/click.
- D-pad arrows have active states.
- Current facing direction updates instantly.
- Objective changes are noticeable but not flashy.
- Low HP state changes the status text and icon, not only color.
- New inventory items briefly highlight.
- Boss telegraph line is pinned or repeated until resolved.
- Ending screen includes route type, score, turns/steps, defeats, secrets found, and badges.
- Reset confirmation copy is friendly and clear.
- Corrupt save fallback copy does not blame the player.
- All repeated lines have variants to avoid feeling robotic.

### 6.16 Failure, Recovery, And Edge Cases

The perfect V1.0 build handles boring edge cases gracefully.

| Situation | Required Behavior |
|---|---|
| Player attacks empty space | Log: "There's nothing to attack here." |
| Player uses item with no usable items | Open inventory or log a clear empty message. |
| Player bumps wall | Log one short wall message; no state corruption. |
| Player reaches exit without Mapstone | Explain what is missing. |
| Player reaches Mapstone before boss flag | Explain that the Ogre's route magic still blocks it. |
| Player dies | Respawn safely, increment defeats, keep key quest progress. |
| Save unavailable | Continue play; show one friendly warning. |
| Corrupt save | Hide Continue; allow new game. |
| Underpass return | Restore main-map state exactly. |
| Existing app mode launches after Realm | No Realm key handlers interfere. |

### 6.17 Release Checklist For The One-Pass Build

Before calling V1.0 done:

- Roadside Realm appears in the app mode list.
- Start New Quest launches the title/intro cleanly.
- Continue appears only when a valid save exists.
- Movement works by touch and keyboard.
- Inspect works on walls, doors, monsters, treasures, exits, hidden walls, and empty corridors.
- Every item can be collected once and appears correctly.
- Toll Gate cannot open without Rusty Road Key.
- The boss cannot be bypassed for the Mapstone.
- Big Spin telegraph and retreat work.
- Player defeat cannot soft-lock the game.
- Normal ending can be completed without secrets.
- Secret route can be discovered with in-game clues.
- True ending can be completed in the same run if the player finds the secret before final exit.
- Save/continue/reset work across reload.
- Service worker cache includes new files and version bump.
- Summary file is updated.
- QA file exists and includes manual routes for normal and true endings.
- Existing games still launch.
- No console errors occur during normal play.

### 6.18 Perfect V1.0 Non-Goals

These are deliberately out of scope for the first complete version:

- procedural generation
- equipment system with multiple armor/weapon slots
- large shops or economy loops
- online scoreboards
- achievements that require repeated daily play
- animated cutscenes
- external art/audio packages
- real-time combat
- multiplayer
- route sharing
- geolocation-based content

The game should feel finished because its chosen scope is polished, not because it has every possible RPG feature.

### 6.19 Final Taste Test

Before shipping, play one normal run and one true-ending run. The answer to each question should be yes:

- Did the first minute make sense without reading the docs?
- Did every button do something understandable?
- Did the dungeon feel road-trip themed instead of generic fantasy?
- Did the boss feel different from normal fights?
- Did the normal ending feel satisfying?
- Did the secret route feel fairly hinted?
- Did the true ending feel meaningfully different?
- Did saves work without making the player think about saves?
- Did the app still feel like Road Trip Adventures?
- Would a player be pleasantly surprised this much game fits inside the app?

---

## 7. Never-Finished Mansion Add-On

This optional add-on expands Roadside Realm with a deeper fictional mansion-inspired chapter called **The Never-Finished Mansion**. It is inspired by the broad idea of strange historic roadside mansion architecture, but it must remain fictionalized and must not copy real layouts, tour material, tragedies, branding, or copyrighted content.

### Source Add-On Title

Roadside Realm Add-On: Winchester Mansion Gameplay Zone — Error-Proof Implementation Spec

#### Purpose

Add a dedicated mansion-inspired gameplay chapter to **Roadside Realm V1.0**.

This section should be inspired by the broad idea of a strange historic roadside mansion with:

```text
maze-like architecture
doors that lead nowhere
stairs that stop suddenly
rooms behind rooms
repeating hallways
hidden passages
odd windows
architectural puzzles
tourist-attraction mystery
```

This must be implemented as a **fictionalized game zone**, not a direct recreation.

Recommended zone name:

```text
The Never-Finished Mansion
```

Optional display subtitle:

```text
A mansion of doors, stairs, and rooms that forgot where they were going.
```

The mansion should feel like a playful road-trip detour inspired by the legend and architecture of the Winchester Mansion / Winchester Mystery House idea, but it should not copy real layouts, copyrighted tour material, real tragedies, or exact branding.

---

### 1. Design Goals

The mansion zone must add:

```text
deeper exploration
architectural puzzles
a maze-like feeling
clear clues
no unfair guessing
one required mansion quest item
one mansion boss
one deeper optional secret
one upgraded true ending
```

The player should feel:

```text
curious
slightly disoriented
rewarded for inspecting
clever for solving it
not lost
not punished
not trapped
```

The mansion should not feel like horror.

Use a tone like:

```text
mysterious
odd
playful
retro
family-friendly
road-trip weird
```

---

### 2. Where This Zone Fits

Roadside Realm should have this progression structure:

```text
Layer 1: Main Dungeon
Layer 2: Forgotten Underpass
Layer 3: Never-Finished Mansion
Layer 4: Hidden Conservatory
```

#### Normal Ending

Requires:

```text
Mapstone
Exit reached
```

Does **not** require the mansion.

#### Secret Star Ending

Requires:

```text
Mapstone
Moon Toll Token
Exit reached
```

#### Impossible Route Ending

Requires:

```text
Mapstone
Moon Toll Token
Star Map Fragment
Exit reached
```

#### Deepest Secret Ending Line

Requires:

```text
Mapstone
Moon Toll Token
Star Map Fragment
Glass Rose
Exit reached
```

This does not need to be a separate ending screen. It can be an extra line added to the Impossible Route Ending.

---

### 3. Mansion Unlock Flow

The mansion should unlock only after the player reaches the Forgotten Underpass and finds the **Moon Toll Token**.

#### Required Item

```text
Moon Toll Token
```

#### Required Location

Forgotten Underpass, near a painted door or impossible wall.

#### Unlock Event

When the player has the Moon Toll Token and inspects the painted door:

```text
The Moon Toll Token grows cold near a door painted directly onto the wall.
```

Then:

```text
The painted door becomes real. A hallway unfolds behind it, longer than the wall should allow.
```

Set:

```js
flags.neverFinishedMansionUnlocked = true;
flags.neverFinishedMansionEntered = true;
```

Move player to the mansion map entry tile.

---

### 4. Anti-Soft-Lock Rules

The mansion must be designed so the player can never get permanently stuck.

#### Required Rules

1. The mansion must always have a valid return path to the Forgotten Underpass.
2. The mansion must not require the player to consume a one-use item incorrectly.
3. The player must not be able to lose the Moon Toll Token.
4. The player must not be able to lose the Blueprint Key before using it.
5. The Star Map Fragment must not become unreachable after boss defeat.
6. The repeating hallway must not loop forever.
7. The hidden conservatory must be optional.
8. The main game ending must still work if the player ignores the mansion.
9. Save/load must preserve mansion flags.
10. If a save loads into an invalid mansion tile, move the player to the mansion entry tile.

#### Emergency Recovery

If the player is in the mansion and something is invalid after load:

```js
if (!isWalkableTile(state.activeMapId, state.player.x, state.player.y)) {
  state.activeMapId = 'never-finished-mansion';
  state.player.x = 1;
  state.player.y = 1;
  state.player.facing = 'east';
  addLog('The mansion rearranged itself and placed you back in the entry hall.', 'info');
}
```

If the mansion map itself fails validation:

```text
Show a clear error message in the game status.
Do not crash.
Return player to Forgotten Underpass entry.
```

---

### 5. Mansion Required Player Flow

The mansion must have a clear progression chain.

#### Full Required Mansion Chain

```text
1. Enter Never-Finished Mansion.
2. Inspect Door-to-Nowhere.
3. Learn that fake doors point toward real passages.
4. Inspect Staircase That Forgot.
5. Press hidden stair button.
6. Repeating Hall becomes solvable.
7. Reach Number Thirteen Room.
8. Find Blueprint Key.
9. Defeat Blueprint Warden.
10. Open Blueprint Study.
11. Claim Star Map Fragment.
12. Return to Forgotten Underpass or main exit.
13. Finish with Impossible Route Ending.
```

#### Optional Deep Secret Chain

```text
1. Claim Star Map Fragment.
2. Return to Wallpaper Maze.
3. Inspect upside-down wallpaper.
4. Hidden Conservatory opens.
5. Claim Glass Rose.
6. Finish game with extra ending line.
```

---

### 6. Mansion Flags

Add these flags to the game state.

```js
flags.neverFinishedMansionUnlocked = false;
flags.neverFinishedMansionEntered = false;

flags.doorToNowhereInspected = false;
flags.stairButtonPressed = false;
flags.repeatingHallSolved = false;

flags.blueprintKeyFound = false;
flags.blueprintWardenDefeated = false;
flags.blueprintStudyUnlocked = false;
flags.starMapFragmentFound = false;

flags.wallpaperSeamFound = false;
flags.hiddenConservatoryOpen = false;
flags.glassRoseFound = false;

flags.impossibleRouteEndingUnlocked = false;
```

#### Required Save/Load Behavior

These flags must be saved and restored.

If the player reloads after solving the stair button:

```text
The repeating hall must stay solved.
```

If the player reloads after defeating the Blueprint Warden:

```text
The Warden must stay defeated.
```

If the player reloads after getting the Star Map Fragment:

```text
The Star Map Fragment must stay in inventory and must not respawn.
```

---

### 7. Mansion Items

Add these items to the item data.

#### Blueprint Key

```js
{
  id: 'blueprint-key',
  name: 'Blueprint Key',
  type: 'key',
  description: 'A flat brass key shaped like a folded floor plan.',
  secret: true
}
```

Purpose:

```text
Opens the Blueprint Study.
```

Can it be consumed?

```text
No. Keep it in inventory.
```

---

#### Star Map Fragment

```js
{
  id: 'star-map-fragment',
  name: 'Star Map Fragment',
  type: 'quest',
  description: 'A torn piece of map showing a road through a mansion hallway.',
  secret: true
}
```

Purpose:

```text
Unlocks the Impossible Route Ending.
```

Required for:

```text
best ending
```

Can it be consumed?

```text
No.
```

---

#### Mansion Postcard

```js
{
  id: 'mansion-postcard',
  name: 'Mansion Postcard',
  type: 'collectible',
  description: 'A postcard of a house with too many windows.',
  score: 150,
  secret: true
}
```

Purpose:

```text
Optional score / summary flavor.
```

---

#### Glass Rose

```js
{
  id: 'glass-rose',
  name: 'Glass Rose',
  type: 'collectible',
  description: 'A glass rose from a conservatory that should not exist.',
  score: 300,
  secret: true
}
```

Purpose:

```text
Deepest optional mansion secret.
```

Ending effect:

```text
Adds extra ending line.
```

---

#### Brass Door Handle

Optional item.

```js
{
  id: 'brass-door-handle',
  name: 'Brass Door Handle',
  type: 'puzzle',
  description: 'A door handle looking for the door it belongs to.',
  secret: true
}
```

Recommended V1.0 decision:

```text
Do not require this item for progression.
Use it only as optional flavor or skip it for V1.0.
```

This prevents unnecessary complexity.

---

### 8. Mansion Enemies

Add these enemies.

#### Door Goblin

```js
{
  id: 'door-goblin',
  name: 'Door Goblin',
  hp: 9,
  attack: 3,
  defense: 0,
  xp: 3,
  gold: 2,
  text: 'A Door Goblin peeks through a keyhole that is not attached to a door.'
}
```

Role:

```text
Basic mansion enemy.
```

Messages:

```text
The Door Goblin slams a tiny door.
The Door Goblin hides behind a hinge.
The Door Goblin rattles the wrong key.
```

---

#### Wallpaper Wisp

```js
{
  id: 'wallpaper-wisp',
  name: 'Wallpaper Wisp',
  hp: 7,
  attack: 4,
  defense: 0,
  xp: 3,
  gold: 2,
  text: 'A Wallpaper Wisp peels itself from the wall.'
}
```

Role:

```text
Weak but slightly higher attack.
```

Messages:

```text
The Wallpaper Wisp rustles around you.
The Wallpaper Wisp repeats the room.
The Wallpaper Wisp flutters into the ceiling.
```

---

#### Staircase Mimic

```js
{
  id: 'staircase-mimic',
  name: 'Staircase Mimic',
  hp: 14,
  attack: 4,
  defense: 1,
  xp: 5,
  gold: 4,
  text: 'The staircase was pretending to be furniture. It was not very good at it.'
}
```

Role:

```text
Optional tougher enemy near the staircase puzzle.
```

Messages:

```text
The Staircase Mimic creaks aggressively.
The Staircase Mimic trips over itself.
The Staircase Mimic tries to become a hallway.
```

---

#### Blueprint Warden

```js
{
  id: 'blueprint-warden',
  name: 'Blueprint Warden',
  hp: 22,
  attack: 5,
  defense: 2,
  xp: 8,
  gold: 7,
  boss: true,
  secret: true,
  text: 'The Blueprint Warden guards the room that was never finished.'
}
```

Role:

```text
Mansion boss / required guardian.
```

Special move:

```text
Rearrange Hall
```

Simple V1.0 behavior:

```text
Every third monster turn, after dealing damage, the Warden turns the player left or right.
```

Special message:

```text
The Blueprint Warden redraws the hallway. Your sense of direction slips.
```

Anti-frustration rule:

```text
Do not teleport the player.
Do not change the map.
Do not remove items.
Only rotate the player, and only if this is easy to implement.
```

If this special behavior is risky, skip the rotation and only show the special message.

---

### 9. Mansion Map

Use a separate map:

```text
never-finished-mansion
```

Recommended size:

```text
10x10
```

#### Tile Legend Additions

```text
R = return / mansion entry
N = Door-to-Nowhere
A = Staircase That Forgot
L = Repeating Hall
Q = Number Thirteen Room
Y = Blueprint Study
W = Blueprint Warden
C = Hidden Conservatory wall/entrance
M = normal mansion monster
T = treasure
E = return exit
# = wall
. = floor
```

#### Suggested Concept Map

Use this as a starting point, then verify and adjust for solvability.

```js
tiles: [
  '##########',
  '#R..N...Y#',
  '#.##.###.#',
  '#..A..#..#',
  '###.#.#W##',
  '#...#....#',
  '#.L###.###',
  '#..Q..C..#',
  '#..M..T.E#',
  '##########'
]
```

#### Coordinate Notes

```text
R entry: x=1, y=1
N Door-to-Nowhere: x=4, y=1
Y Blueprint Study: x=8, y=1
A Staircase That Forgot: x=3, y=3
W Blueprint Warden: x=7, y=4
L Repeating Hall: x=2, y=6
Q Number Thirteen Room: x=3, y=7
C Hidden Conservatory clue/entrance: x=6, y=7
M normal monster: x=3, y=8
T optional treasure: x=6, y=8
E exit back to underpass: x=8, y=8
```

#### Important Map Warning

The agent must validate the final map.

If this exact map is not solvable because of walls or event placement, adjust it.

The final mansion map must satisfy:

```text
R can reach N.
R can reach A.
A can unlock L.
L can reach Q after solved.
Q can grant Blueprint Key.
Blueprint Key path can reach W.
W defeat allows Y.
Y grants Star Map Fragment.
C is optional after Star Map Fragment.
E can always be reached from main mansion path.
```

---

### 10. Mansion Event Schema

Events should be explicit, not only encoded in the tile character.

Use coordinates as keys.

Example:

```js
events: {
  '1,1': {
    id: 'mansion-entry',
    type: 'entry',
    title: 'Crooked Entry Hall',
    text: 'The hallway bends slightly, even though the floorboards are straight.'
  },

  '4,1': {
    id: 'door-to-nowhere',
    type: 'mansionPuzzle',
    puzzleType: 'doorToNowhere',
    flag: 'doorToNowhereInspected',
    title: 'Door-to-Nowhere Landing',
    text: 'A polished door opens onto a brick wall.',
    inspectText: 'The door opens to nowhere, but the handle points toward a real passage.'
  },

  '3,3': {
    id: 'staircase-that-forgot',
    type: 'mansionPuzzle',
    puzzleType: 'stairButton',
    flag: 'stairButtonPressed',
    title: 'Staircase That Forgot',
    text: 'A staircase climbs halfway up and then stops at the ceiling.',
    inspectText: 'Under the last step, you find a tiny brass button. Somewhere, a hallway shifts.'
  },

  '2,6': {
    id: 'repeating-hall',
    type: 'mansionPuzzle',
    puzzleType: 'repeatingHall',
    requiredFlag: 'stairButtonPressed',
    solvedFlag: 'repeatingHallSolved',
    title: 'Repeating Hall',
    blockedText: 'The hallway folds back on itself.',
    solvedText: 'The hallway finally agrees to be a hallway.'
  },

  '3,7': {
    id: 'number-thirteen-room',
    type: 'item',
    itemId: 'blueprint-key',
    flag: 'blueprintKeyFound',
    title: 'Number Thirteen Room',
    text: 'The thirteenth window shows a road instead of the room outside. A Blueprint Key rests on the sill.'
  },

  '7,4': {
    id: 'blueprint-warden',
    type: 'monster',
    monsterId: 'blueprint-warden',
    requiredItem: 'blueprint-key',
    defeatFlag: 'blueprintWardenDefeated',
    blockedText: 'The Blueprint Warden blocks the unfinished study.'
  },

  '8,1': {
    id: 'blueprint-study',
    type: 'item',
    itemId: 'star-map-fragment',
    requiredItem: 'blueprint-key',
    requiredFlag: 'blueprintWardenDefeated',
    flag: 'starMapFragmentFound',
    title: 'Blueprint Study',
    lockedText: 'The study drawer will not open until the Blueprint Warden is defeated.',
    text: 'The Blueprint Key unlocks a drawer full of impossible maps. You found the Star Map Fragment.'
  },

  '6,7': {
    id: 'hidden-conservatory',
    type: 'hiddenRoom',
    requiredItem: 'star-map-fragment',
    openFlag: 'hiddenConservatoryOpen',
    rewardItemId: 'glass-rose',
    rewardFlag: 'glassRoseFound',
    title: 'Hidden Conservatory',
    hiddenText: 'The wallpaper pattern is upside down here.',
    openText: 'The wallpaper peels back, revealing a hidden conservatory.',
    rewardText: 'Moonlight shines through windows that should face underground. You found the Glass Rose.'
  },

  '8,8': {
    id: 'mansion-return',
    type: 'mapTransition',
    targetMapId: 'forgotten-underpass',
    targetX: 1,
    targetY: 1,
    targetFacing: 'south',
    text: 'The mansion hallway folds back into the Forgotten Underpass.'
  }
}
```

The final data structure can vary, but it must contain equivalent logic.

---

### 11. Exact Mansion Puzzle Logic

#### Puzzle A: Door-to-Nowhere

##### Purpose

Teaches the player that mansion weirdness gives clues.

##### Trigger

Player stands near or faces Door-to-Nowhere and presses Inspect.

##### Before Inspect

Status:

```text
A polished door opens onto a brick wall.
```

##### On Inspect

Message:

```text
The door opens to nowhere, but the handle points toward a real passage.
```

Set:

```js
flags.doorToNowhereInspected = true;
```

##### Gameplay Effect

This can be mostly a clue. It does not need to unlock a door.

Optional effect:

```text
Adds a hint to objective text: "The mansion rewards inspecting impossible things."
```

##### Error-Proofing

If the player never inspects this, they should still be able to complete the mansion by inspecting other clues.

Do not make this a hidden required flag unless clearly indicated.

---

#### Puzzle B: Staircase That Forgot

##### Purpose

Primary switch puzzle.

##### Trigger

Player inspects the staircase tile.

##### Before Inspect

```text
A staircase climbs halfway up and then stops at the ceiling.
```

##### On Inspect

```text
Under the last step, you find a tiny brass button. Somewhere, a hallway shifts.
```

Set:

```js
flags.stairButtonPressed = true;
```

Update objective:

```text
Objective: Find the hallway that changed.
```

##### Gameplay Effect

Enables the Repeating Hall to be solved.

##### Error-Proofing

If player presses button twice:

```text
The brass button is already pressed. Somewhere, the hallway is still waiting.
```

Do not toggle the puzzle off.

---

#### Puzzle C: Repeating Hall

##### Purpose

Maze trick that must not be frustrating.

##### Before Stair Button

If player tries to move through the repeating hall:

```text
The hallway folds back on itself.
```

Effect:

```text
Do not trap the player.
Either block movement or move player back one tile.
```

Recommended:

```js
block movement and show message
```

Do **not** teleport the player repeatedly.

##### After Stair Button

If:

```js
flags.stairButtonPressed === true
```

Then Repeating Hall becomes passable.

Set:

```js
flags.repeatingHallSolved = true;
```

Message:

```text
The hallway finally agrees to be a hallway.
```

##### Error-Proofing

The hall must never create an infinite loop.

Do not use automatic movement that triggers itself repeatedly.

Do not move the player between two loop tiles automatically.

Use a simple blocked/unblocked rule.

---

#### Puzzle D: Number Thirteen Room

##### Purpose

Gives Blueprint Key.

##### Trigger

Player enters or inspects room.

##### First Time

```text
Thirteen small windows glow along the wall. The thirteenth shows a road instead of the room outside. A Blueprint Key rests on the sill.
```

Add item:

```js
addItem('blueprint-key');
flags.blueprintKeyFound = true;
```

##### Revisit

```text
The thirteenth window still shows a road, but the Blueprint Key is already yours.
```

##### Error-Proofing

Blueprint Key must not respawn.

If save/load occurs after collection, keep it collected.

If player somehow reaches Blueprint Study without key:

```text
The study drawer needs a flat brass key shaped like a floor plan.
```

---

#### Puzzle E: Blueprint Warden

##### Purpose

Required mansion boss.

##### Trigger

Player faces Warden and presses Attack.

##### Requirement

Player should have Blueprint Key before reaching Warden if possible.

If not:

```text
The Blueprint Warden points to an empty keyhole. You may need a key shaped like a floor plan.
```

##### Combat

Use normal combat.

After defeat:

```text
The Blueprint Warden folds into a neat stack of floor plans.
```

Set:

```js
flags.blueprintWardenDefeated = true;
```

##### Error-Proofing

If defeated, Warden must not respawn.

If player reloads after defeat, Warden tile should become walkable.

---

#### Puzzle F: Blueprint Study

##### Purpose

Gives Star Map Fragment.

##### Requirements

```js
hasItem('blueprint-key') === true
flags.blueprintWardenDefeated === true
```

##### If Requirements Missing

No Blueprint Key:

```text
The study drawer is locked with a flat brass keyhole.
```

Warden Not Defeated:

```text
The Blueprint Warden’s seal keeps the study drawer shut.
```

##### If Requirements Met

```text
The Blueprint Key unlocks a drawer full of impossible maps. You found the Star Map Fragment.
```

Add item:

```js
addItem('star-map-fragment');
flags.starMapFragmentFound = true;
flags.impossibleRouteEndingUnlocked = true;
```

##### Revisit

```text
The study drawer is open. The impossible map is already in your pack.
```

##### Error-Proofing

Star Map Fragment must not respawn.

Star Map Fragment must be saved.

If player has Star Map Fragment but flag is false after load, repair state:

```js
if (hasItem('star-map-fragment')) {
  flags.starMapFragmentFound = true;
  flags.impossibleRouteEndingUnlocked = true;
}
```

---

#### Puzzle G: Hidden Conservatory

##### Purpose

Deepest optional mansion secret.

##### Requirements

```js
hasItem('star-map-fragment') === true
```

##### Clue Before Star Map Fragment

```text
The wallpaper pattern is upside down here.
```

No opening yet.

##### After Star Map Fragment

If player inspects:

```text
The wallpaper peels back, revealing a hidden conservatory.
```

Set:

```js
flags.hiddenConservatoryOpen = true;
```

Reward:

```text
Glass Rose
```

Message:

```text
Moonlight shines through windows that should face underground. You found the Glass Rose.
```

Set:

```js
flags.glassRoseFound = true;
```

##### Revisit

```text
The hidden conservatory glows quietly. The Glass Rose is already yours.
```

##### Error-Proofing

The conservatory is optional.

Do not block any ending if it is missed.

---

### 12. Mansion Objective State Machine

Add objective updates.

#### Objective State: Mansion Locked

Condition:

```js
!flags.neverFinishedMansionUnlocked
```

Text:

```text
Secret: The Moon Toll Token may open a stranger road.
```

#### Objective State: Mansion Entered

Condition:

```js
flags.neverFinishedMansionEntered && !flags.stairButtonPressed
```

Text:

```text
Mansion Objective: Inspect impossible rooms.
```

#### Objective State: Stair Button Pressed

Condition:

```js
flags.stairButtonPressed && !flags.blueprintKeyFound
```

Text:

```text
Mansion Objective: Find the hallway that changed.
```

#### Objective State: Blueprint Key Found

Condition:

```js
flags.blueprintKeyFound && !flags.blueprintWardenDefeated
```

Text:

```text
Mansion Objective: Face the Blueprint Warden.
```

#### Objective State: Warden Defeated

Condition:

```js
flags.blueprintWardenDefeated && !flags.starMapFragmentFound
```

Text:

```text
Mansion Objective: Open the Blueprint Study.
```

#### Objective State: Star Map Fragment Found

Condition:

```js
flags.starMapFragmentFound && !flags.glassRoseFound
```

Text:

```text
Mansion Objective: Return to the exit, or search for one deeper secret.
```

#### Objective State: Glass Rose Found

Condition:

```js
flags.glassRoseFound
```

Text:

```text
Mansion Objective: Return to the exit for the fullest ending.
```

---

### 13. Mansion Room Entry Text

Show room names and flavor when entering important tiles for the first time.

#### Crooked Entry Hall

```text
Crooked Entry Hall
The hallway bends slightly, even though the floorboards are straight.
```

#### Door-to-Nowhere Landing

```text
Door-to-Nowhere Landing
A polished door opens onto a brick wall.
```

#### Staircase That Forgot

```text
Staircase That Forgot
A staircase climbs halfway up and then stops at the ceiling.
```

#### Repeating Hall

```text
Repeating Hall
You are almost sure you have seen this portrait before.
```

#### Number Thirteen Room

```text
Number Thirteen Room
Thirteen small windows glow along the wall.
```

#### Builder’s Gallery

```text
Builder’s Gallery
Blueprints hang like banners from the ceiling.
```

#### Blueprint Study

```text
Blueprint Study
None of the floor plans match the room you are standing in.
```

#### Hidden Conservatory

```text
Hidden Conservatory
Moonlight shines through windows that should face underground.
```

---

### 14. Mansion Rendering Requirements

The mansion should look visually different from the dungeon and underpass.

#### Mansion Palette

Use:

```text
dark red wood
dusty gold
deep brown
green glass lamp glow
moonlit blue shadows
cream wallpaper
black outlines
```

#### Mansion Canvas Elements

When in mansion map, draw:

```text
wood panel walls
wallpaper pattern
floorboards
picture frames
odd doors
lamps
thin moonlit windows
```

#### Special Drawings

##### Door-to-Nowhere

Draw:

```text
a polished door
brick wall visible when inspected
slightly crooked handle
```

##### Staircase That Forgot

Draw:

```text
short staircase ending at ceiling
small brass button under top stair after inspect clue
```

##### Repeating Hall

Draw:

```text
same portrait repeated
subtle loop symbol
```

##### Number Thirteen Room

Draw:

```text
row of tiny windows
one glowing brighter than the others
```

##### Blueprint Study

Draw:

```text
desk
blueprints
locked drawer
star-shaped map piece glow after unlocked
```

##### Hidden Conservatory

Draw:

```text
glass windows
moonlight
plants
glass rose
```

---

### 15. Mansion Log Message Library

Use varied messages so the zone feels polished.

#### Entry

```text
The painted door becomes real.
The mansion smells like dust, old wood, and impossible directions.
The hallway unfolds longer than the wall should allow.
```

#### Movement

```text
The floorboards creak politely.
The mansion seems to be listening.
A portrait watches you pass.
The hallway is longer than it was a moment ago.
```

#### Walls

```text
The wallpaper hides old route lines.
This wall feels newer than the room.
A draft slips through the wallpaper.
```

#### Door-to-Nowhere

```text
The door opens onto a brick wall.
The handle points toward a real passage.
The mansion likes jokes with hinges.
```

#### Staircase

```text
The staircase stops at the ceiling.
A tiny brass button hides under the last step.
The button clicks like a polite little secret.
```

#### Repeating Hall

```text
The hallway folds back on itself.
The portrait winks the second time you pass.
The hallway finally agrees to be a hallway.
```

#### Blueprint Key

```text
The thirteenth window shows a road instead of the room outside.
You found the Blueprint Key.
```

#### Blueprint Warden

```text
The Blueprint Warden raises a ruler like a royal scepter.
The Blueprint Warden redraws the hallway.
The Blueprint Warden folds into a neat stack of floor plans.
```

#### Star Map Fragment

```text
The Blueprint Key unlocks the study drawer.
You found the Star Map Fragment.
A road appears on the map where no road should fit.
```

#### Conservatory

```text
The wallpaper peels back.
A hidden conservatory opens.
You found the Glass Rose.
```

---

### 16. Mansion Combat Balance

The mansion is a late secret area, but it should still be beatable.

Recommended balancing:

```text
Player likely has Level 2 or Level 3.
Player likely has Mapstone or Moon Toll Token.
Player may have 1 healing item.
```

#### Enemy Counts

Recommended:

```text
1 Door Goblin
1 Wallpaper Wisp
0 or 1 Staircase Mimic
1 Blueprint Warden
```

Do not overfill mansion with combat.

The mansion should be puzzle-first.

#### Healing

Add one optional healing item in mansion.

Recommended item:

```text
Trail Mix Packet
```

Location:

```text
Window Room or Lost Sitting Room
```

Message:

```text
You found a Trail Mix Packet tucked behind a dusty cushion.
```

---

### 17. Mansion Save/Load Invariants

After saving and reloading, these must remain true.

#### If Door-to-Nowhere inspected

```js
flags.doorToNowhereInspected === true
```

#### If Stair Button pressed

```js
flags.stairButtonPressed === true
```

Repeating hall must be passable.

#### If Blueprint Key found

```js
hasItem('blueprint-key') === true
flags.blueprintKeyFound === true
```

The key must not respawn.

#### If Blueprint Warden defeated

```js
flags.blueprintWardenDefeated === true
defeatedMonsters['blueprint-warden'] === true
```

The Warden tile must be walkable.

#### If Star Map Fragment found

```js
hasItem('star-map-fragment') === true
flags.starMapFragmentFound === true
flags.impossibleRouteEndingUnlocked === true
```

The study must not grant duplicate fragments.

#### If Glass Rose found

```js
hasItem('glass-rose') === true
flags.glassRoseFound === true
```

The conservatory reward must not respawn.

---

### 18. Mansion Error-Proof Event Helpers

Implement events defensively.

#### Safe item grant

```js
function grantItemOnce(itemId, flagName, message) {
  if (!itemId || !DATA.items[itemId]) {
    addLog('Something should be here, but the mansion misplaced it.', 'danger');
    return false;
  }

  if (state.flags[flagName] || hasItem(itemId)) {
    addLog('You already found this.', 'info');
    return false;
  }

  state.player.inventory.push(itemId);
  state.flags[flagName] = true;
  addLog(message, 'item');
  saveGame();
  renderAll();
  return true;
}
```

#### Safe flag set

```js
function setFlagOnce(flagName, message, type = 'info') {
  if (!flagName) return false;

  if (state.flags[flagName]) {
    return false;
  }

  state.flags[flagName] = true;
  if (message) addLog(message, type);
  saveGame();
  renderAll();
  return true;
}
```

#### Safe map transition

```js
function transitionToMap(targetMapId, x, y, facing) {
  const map = DATA.maps[targetMapId];

  if (!map) {
    addLog('The route tries to open, but the map is missing.', 'danger');
    return false;
  }

  if (!isWalkableTile(targetMapId, x, y)) {
    addLog('The destination rearranged itself. You stay where you are.', 'danger');
    return false;
  }

  state.activeMapId = targetMapId;
  state.player.mapId = targetMapId;
  state.player.x = x;
  state.player.y = y;
  state.player.facing = facing || 'north';

  markDiscovered(targetMapId, x, y);
  saveGame();
  renderAll();
  return true;
}
```

---

### 19. Mansion Event Handling Pseudocode

Add specific mansion handling inside inspect or event resolver.

```js
function resolveMansionInspect(event) {
  if (!event) {
    addLog('The mansion offers no answer here.', 'info');
    return;
  }

  switch (event.puzzleType) {
    case 'doorToNowhere':
      state.flags.doorToNowhereInspected = true;
      addLog('The door opens to nowhere, but the handle points toward a real passage.', 'secret');
      break;

    case 'stairButton':
      if (!state.flags.stairButtonPressed) {
        state.flags.stairButtonPressed = true;
        addLog('Under the last step, you find a tiny brass button. Somewhere, a hallway shifts.', 'secret');
      } else {
        addLog('The brass button is already pressed.', 'info');
      }
      break;

    case 'repeatingHall':
      if (!state.flags.stairButtonPressed) {
        addLog('The hallway folds back on itself. Something else in the mansion may need to move first.', 'info');
      } else {
        state.flags.repeatingHallSolved = true;
        addLog('The hallway finally agrees to be a hallway.', 'secret');
      }
      break;

    default:
      addLog(event.inspectText || event.text || 'The mansion stays quiet.', 'info');
      break;
  }

  saveGame();
  renderAll();
}
```

---

### 20. Mansion Movement Handling

Special movement logic for Repeating Hall.

```js
function canMoveIntoMansionTile(tile, event) {
  if (!event) return true;

  if (event.puzzleType === 'repeatingHall') {
    if (!state.flags.stairButtonPressed) {
      addLog('The hallway folds back on itself. You cannot make progress yet.', 'info');
      return false;
    }

    if (!state.flags.repeatingHallSolved) {
      state.flags.repeatingHallSolved = true;
      addLog('The hallway finally agrees to be a hallway.', 'secret');
    }

    return true;
  }

  return true;
}
```

Important:

```text
Do not teleport the player for the repeating hallway unless absolutely necessary.
Blocking until solved is safer.
```

---

### 21. Mansion Ending Logic

Update ending calculation.

```js
function getEndingType() {
  const hasMapstone = hasItem('mapstone');
  const hasMoonToken = hasItem('moon-toll-token');
  const hasStarFragment = hasItem('star-map-fragment');
  const hasGlassRose = hasItem('glass-rose');

  if (hasMapstone && hasMoonToken && hasStarFragment && hasGlassRose) {
    return 'impossible-route-plus-conservatory';
  }

  if (hasMapstone && hasMoonToken && hasStarFragment) {
    return 'impossible-route';
  }

  if (hasMapstone && hasMoonToken) {
    return 'secret-star';
  }

  if (hasMapstone) {
    return 'normal';
  }

  return null;
}
```

#### Ending Text

##### Normal

```text
Route Restored
You escaped the Roadside Realm with the Mapstone. The old kiosk clicks shut, the road lines settle back onto the map, and the car’s route is restored.
```

##### Secret Star

```text
Secret Star Ending
You escaped with the Mapstone and the Moon Toll Token. The Roadside Realm stamps your map with a silver star.
```

##### Impossible Route

```text
Impossible Route Ending
You escaped with the Mapstone, the Moon Toll Token, and the Star Map Fragment. The old road map unfolds one final time, revealing a route that should not fit on paper.
```

##### Impossible Route + Conservatory

```text
Impossible Route Ending
You escaped with the Mapstone, the Moon Toll Token, and the Star Map Fragment. The old road map unfolds one final time, revealing a route that should not fit on paper. The Glass Rose glows on the dashboard, proof that one impossible room came home with you.
```

---

### 22. Mansion Summary Requirements

If mansion was never entered:

```text
Mansion: Not discovered
```

If mansion was entered but not completed:

```text
Mansion: Entered
```

If Star Map Fragment found:

```text
Mansion: Completed
```

If Glass Rose found:

```text
Mansion: Deep secret found
```

#### Summary Lines

Add these conditionally:

```text
The painted door became real.
The Door-to-Nowhere was inspected.
The Repeating Hall was solved.
The Blueprint Warden was defeated.
The Star Map Fragment was recovered.
The Hidden Conservatory was found.
```

#### Hint Lines

If player got normal ending only:

```text
Hint: The Mapstone hums toward a moonlit road below the kiosk.
```

If player got Secret Star but not mansion:

```text
Hint: The Moon Toll Token grows cold near painted doors.
```

If player entered mansion but missed Glass Rose:

```text
Hint: One wallpaper pattern still refuses to face the right way.
```

---

### 23. Mansion Badges

Add local-only badges.

#### Mansion Wanderer

Condition:

```js
flags.neverFinishedMansionEntered
```

Label:

```text
Mansion Wanderer
```

Description:

```text
Entered the Never-Finished Mansion.
```

---

#### Door to Nowhere

Condition:

```js
flags.doorToNowhereInspected
```

Label:

```text
Door to Nowhere
```

Description:

```text
Inspected a door that had no business opening.
```

---

#### Hallway Negotiator

Condition:

```js
flags.repeatingHallSolved
```

Label:

```text
Hallway Negotiator
```

Description:

```text
Convinced the Repeating Hall to become normal.
```

---

#### Blueprint Breaker

Condition:

```js
flags.blueprintWardenDefeated
```

Label:

```text
Blueprint Breaker
```

Description:

```text
Defeated the Blueprint Warden.
```

---

#### Impossible Route

Condition:

```js
flags.starMapFragmentFound
```

Label:

```text
Impossible Route
```

Description:

```text
Recovered the Star Map Fragment.
```

---

#### Conservatory Secret

Condition:

```js
flags.glassRoseFound
```

Label:

```text
Conservatory Secret
```

Description:

```text
Found the Glass Rose.
```

---

### 24. Exact QA Script for Mansion

The agent must manually test this path.

#### QA Path A: Mansion Unlock

1. Start game.
2. Reach Forgotten Underpass.
3. Collect Moon Toll Token.
4. Inspect painted door.
5. Confirm mansion unlock message appears.
6. Confirm player transitions to mansion.
7. Confirm `flags.neverFinishedMansionUnlocked = true`.
8. Confirm `flags.neverFinishedMansionEntered = true`.

Expected result:

```text
Player enters Crooked Entry Hall.
```

---

#### QA Path B: Door-to-Nowhere

1. Move to Door-to-Nowhere.
2. Press Inspect.
3. Confirm message appears.
4. Confirm flag set.
5. Save.
6. Reload.
7. Confirm flag remains.

Expected message:

```text
The door opens to nowhere, but the handle points toward a real passage.
```

---

#### QA Path C: Staircase Button

1. Move to Staircase That Forgot.
2. Press Inspect.
3. Confirm stair button message.
4. Confirm `flags.stairButtonPressed = true`.
5. Press Inspect again.
6. Confirm it does not toggle off.

Expected second message:

```text
The brass button is already pressed.
```

---

#### QA Path D: Repeating Hall Before Solved

1. Reset to before stair button if possible.
2. Try Repeating Hall before pressing stair button.
3. Confirm movement is blocked or harmless.
4. Confirm no infinite loop.
5. Confirm player can turn around and leave.

Expected message:

```text
The hallway folds back on itself. You cannot make progress yet.
```

---

#### QA Path E: Repeating Hall After Solved

1. Press stair button.
2. Return to Repeating Hall.
3. Move through.
4. Confirm passable.
5. Confirm `flags.repeatingHallSolved = true`.

Expected message:

```text
The hallway finally agrees to be a hallway.
```

---

#### QA Path F: Blueprint Key

1. Reach Number Thirteen Room.
2. Inspect or enter event.
3. Confirm Blueprint Key added.
4. Confirm `flags.blueprintKeyFound = true`.
5. Leave and return.
6. Confirm key does not duplicate.
7. Save and reload.
8. Confirm key remains.

Expected message:

```text
The thirteenth window shows a road instead of the room outside. A Blueprint Key rests on the sill.
```

---

#### QA Path G: Blueprint Warden

1. Reach Blueprint Warden.
2. Attack.
3. Confirm combat works.
4. Confirm player can defeat Warden.
5. Confirm `flags.blueprintWardenDefeated = true`.
6. Confirm Warden does not respawn after reload.

Expected defeat message:

```text
The Blueprint Warden folds into a neat stack of floor plans.
```

---

#### QA Path H: Blueprint Study

1. Try opening study before Warden defeated.
2. Confirm blocked.
3. Defeat Warden.
4. Open study with Blueprint Key.
5. Confirm Star Map Fragment added.
6. Confirm `flags.starMapFragmentFound = true`.
7. Confirm `flags.impossibleRouteEndingUnlocked = true`.
8. Confirm no duplicate fragment.

Expected reward message:

```text
The Blueprint Key unlocks a drawer full of impossible maps. You found the Star Map Fragment.
```

---

#### QA Path I: Hidden Conservatory

1. Find Star Map Fragment.
2. Return to upside-down wallpaper.
3. Inspect.
4. Confirm Hidden Conservatory opens.
5. Confirm Glass Rose added.
6. Confirm `flags.glassRoseFound = true`.
7. Reload.
8. Confirm Glass Rose remains and does not duplicate.

Expected message:

```text
The wallpaper peels back, revealing a hidden conservatory.
```

---

#### QA Path J: Return Path

1. From every mansion region, confirm the player can return to Forgotten Underpass.
2. Confirm no one-way trap.
3. Confirm return tile works after save/load.

Expected:

```text
Player returns safely to Forgotten Underpass.
```

---

#### QA Path K: Ending Integration

Test all endings.

##### Normal Ending

Inventory:

```text
Mapstone only
```

Expected:

```text
Route Restored
```

##### Secret Star Ending

Inventory:

```text
Mapstone
Moon Toll Token
```

Expected:

```text
Secret Star Ending
```

##### Impossible Route Ending

Inventory:

```text
Mapstone
Moon Toll Token
Star Map Fragment
```

Expected:

```text
Impossible Route Ending
```

##### Conservatory Extra Line

Inventory:

```text
Mapstone
Moon Toll Token
Star Map Fragment
Glass Rose
```

Expected:

```text
Impossible Route Ending with Glass Rose line
```

---

### 25. Automated Validation Requirements

Update the audit script if practical.

The audit should check:

```text
Mansion map exists.
Mansion map rows are rectangular.
Mansion map has entry tile R.
Mansion map has return tile E.
Mansion map has Door-to-Nowhere event.
Mansion map has Staircase event.
Mansion map has Repeating Hall event.
Mansion map has Number Thirteen Room event.
Mansion map has Blueprint Warden event.
Mansion map has Blueprint Study event.
Mansion map has Hidden Conservatory event.
Blueprint Key item exists.
Star Map Fragment item exists.
Glass Rose item exists.
Blueprint Warden monster exists.
Required flags are initialized.
Mansion can be entered only after Moon Toll Token.
Star Map Fragment can be found only after Blueprint Warden defeated.
Glass Rose can be found only after Star Map Fragment.
```

If audit cannot prove pathing, at least warn:

```text
Manual path QA required for mansion solvability.
```

---

### 26. Agent Implementation Order for Mansion

Do not build all mansion features randomly.

Follow this order.

#### Step 1: Add Mansion Data

Add:

```text
mansion map
mansion items
mansion monsters
mansion events
mansion flags
```

Do not wire gameplay yet.

#### Step 2: Add Mansion Unlock

Add:

```text
Moon Toll Token checks
painted door inspect event
transition to mansion map
return tile back to underpass
```

Test this before adding puzzles.

#### Step 3: Add Basic Mansion Movement

Confirm:

```text
entry works
return works
walls block movement
map renders differently
minimap works
save/load works
```

#### Step 4: Add Puzzle Chain

Add in order:

```text
Door-to-Nowhere
Staircase Button
Repeating Hall
Number Thirteen Room
Blueprint Key
```

Test each before next.

#### Step 5: Add Blueprint Warden

Add:

```text
Warden enemy
combat
defeat flag
boss tile unlock
```

#### Step 6: Add Blueprint Study

Add:

```text
Star Map Fragment
Impossible Route Ending unlock
summary line
```

#### Step 7: Add Hidden Conservatory

Add:

```text
upside-down wallpaper
Glass Rose
extra ending line
deep secret badge
```

#### Step 8: Add QA and Audit

Add:

```text
manual QA doc
audit checks
service worker cache update
version bump
```

---

### 27. Mansion Definition of Done

The Winchester-inspired mansion zone is complete only when:

```text
Mansion is optional.
Mansion unlocks from Forgotten Underpass using Moon Toll Token.
Mansion has a separate map.
Mansion has unique visual style.
Player can enter mansion.
Player can return from mansion.
Door-to-Nowhere works.
Staircase button works.
Repeating Hall cannot infinite-loop.
Number Thirteen Room gives Blueprint Key.
Blueprint Key cannot duplicate.
Blueprint Warden can be defeated.
Blueprint Warden does not respawn after save/load.
Blueprint Study gives Star Map Fragment.
Star Map Fragment unlocks Impossible Route Ending.
Hidden Conservatory is optional.
Glass Rose is optional.
Glass Rose adds extra ending line.
Save/load preserves all mansion state.
Normal ending still works without mansion.
Secret Star ending still works without mansion completion.
Impossible Route ending works with mansion completion.
No soft locks exist.
No console errors during mansion path.
Manual QA checklist passes.
```

---

### 28. Final Mansion Design Rule

Every strange mansion feature must either:

```text
teach
hint
unlock
reward
challenge
or deepen the secret path
```

Do not add weird rooms that do nothing.

The player should always have a clue, a next step, or a reward.

The mansion should feel impossible, but the implementation should be predictable.

---

## 8. Source Cleanup Log

The original file contained several overlapping drafts and repeated sections. This organized version keeps the usable design material while removing repetition.

Removed or merged:

- Duplicate technical appendix copies from the original beginning and middle of the file.
- Superseded older agent prompt headed **AI Agent Prompt: Build a V1.0 First-Person Dungeon Crawler Mini-Game**.
- Repeated heading sequences that restated the same state machine, render loop, save schema, dialogue banks, art specs, and QA scripts.

Kept:

- The latest V1.0 implementation prompt.
- The expanded game content add-on.
- The concrete build-detail spec with maps and tables.
- One complete technical appendix.





