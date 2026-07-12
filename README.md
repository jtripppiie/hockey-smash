# Hockey Smash

Hockey Smash is a side-scrolling hockey game set in Soldotna, Alaska.

You pick Daniel or Sofie, type a player name, catch falling salmon, then survive funny family and wildlife encounters. The current game uses the v2 architecture, which means almost everything you see in the play area is drawn by one canvas renderer from one game world.

Current version:

```text
2.1.3
```

## Quick Start

You do not need a build step.

1. Open a terminal in this project folder.
2. Start a local web server:

```bash
python3 -m http.server 8000
```

3. Open this in a browser:

```text
http://localhost:8000/
```

That URL is the game. The old dev URL still redirects here for compatibility.

## How To Play

Goal:

```text
catch 20 salmon -> unlock encounters -> keep playing
```

Controls:

```text
A / Left Arrow   move left
D / Right Arrow  move right
W / Up / Space   jump
S / Shift        slide / duck low
F / Enter        stick / throw
P / Escape       pause / resume
```

On phones and tablets, use the circular pad: left/right moves, up jumps, and down slides or ducks. Projectiles always fire to the right. Sliding or ducking low avoids eagle flybys.

## What Is In The Game Now

- Splash screen with name input.
- Daniel and Sofie character selection.
- Fullscreen button.
- Keyboard and touch controls.
- Salmon run with animated landing markers.
- Smoother player movement with acceleration, friction, jump buffering, coyote time, double jump, and short-hop jumps.
- Catch counter and health bar.
- Score combos and a personal best saved in the browser.
- Golden salmon worth 50 base points, with a bright visual and sound cue.
- Synthesized game sounds with a persistent mute preference and no downloaded audio files.
- Level announcements and a real victory after surviving 90 encounter seconds.
- Pause/resume controls; switching tabs pauses automatically.
- Day/night sky with sun and moon.
- Parallax-style Soldotna background.
- Daniel hockey puck projectile.
- Sofie dancer shoe projectile.
- Mom cameo: one at a time, stays still, says the room-cleaning line, then disappears.
- Dad mower encounter: one at a time, tells a complete joke, damages the player on contact, and can be cleared with a projectile.
- Alaska boy/girl cameo: appears once per run, says `Hi, you're cute`, gives a speed boost when close, and disappears after 5 seconds.
- Six-frame WebP sheet animation for salmon swimming, bear walking, moose walking/grazing, and eagle flying.
- Bear, moose, eagle, and dance instructor encounters.
- Bear currently only walks on the ground. Bear rise/charge behavior is saved for future development.
- Eagle flies with a flapping sheet, bob, and slight tilt. Daniel can duck under it, and Sofie can slide under it.

## Main Files

These are the files to know first:

```text
index.html
js/games/hockey-smash-world-v2.js
js/games/hockey-smash-renderer-v2.js
assets/hockey-smash/ASSET_MANIFEST.md
```

What they do:

- `index.html` is the main game page.
- `js/games/hockey-smash-world-v2.js` creates the game world, player, salmon, Mom, Dad, cameos, and tuning values.
- `js/games/hockey-smash-renderer-v2.js` draws the world on the canvas.
- `js/games/hockey-smash-systems-v2.js` updates player movement, salmon spawning/catches, encounter spawning, and projectiles.
- `assets/hockey-smash/ASSET_MANIFEST.md` lists the important art files.
- `docs/LEARNING_GUIDE.md` is a guided code tour with safe first projects.

## The Simple Game Loop

The game tries to keep one clean path:

```text
input -> world state -> update systems -> canvas renderer
```

That means:

- input remembers which buttons are pressed
- world state stores where everything is
- update systems move things and check collisions
- renderer draws the current world

Try not to add gameplay as floating HTML on top of the canvas. If something moves, collides, expires, or affects the player, it should usually be a world entity.

## How The Code Works

Think of the game like four jobs that happen over and over:

```text
1. read input
2. update the world
3. remove dead or expired entities
4. draw the world
```

The player is stored in:

```text
world.player
```

Salmon, Dad, Mom, wildlife, projectiles, and cameos are stored in:

```text
world.entities
```

Each entity has simple values:

```text
x, y        where it is
vx, vy      how fast it moves
width       how wide it is
height      how tall it is
ttl         how many seconds it lives
damage      how much it hurts the player
nonContact  true means it cannot hurt the player
```

When you want to learn a system, search for its function name:

```text
updatePlayer
updateSalmonLoop
spawnNextEncounter
canSpawnEncounter
collideProjectile
renderWorld
```

## Asset Naming

Use clear lowercase names with dashes.

Good:

```text
daniel-hockey-idle.webp
projectile-hockey-puck.webp
bear-walk-01.webp
```

Avoid:

```text
image1.png
new-final-final.webp
thing.webp
```

Active sprite assets live here:

```text
assets/hockey-smash/sprites/
```

Background and parallax assets live here:

```text
assets/hockey-smash/backgrounds/
assets/hockey-smash/backgrounds/parallax/
```

## Adding A New Sprite

1. Put the image in `assets/hockey-smash/sprites/`.
2. Give it a clear name, like `dad-lawn-mower.webp`.
3. Add it to `SPRITES` in `js/games/hockey-smash-world-v2.js`.
4. For sprite sheets, add frame trim metadata to `SPRITE_SHEETS` in `js/games/hockey-smash-renderer-v2.js`.
5. Use that sprite key in an entity.
6. Add the file to `assets/hockey-smash/ASSET_MANIFEST.md`.
7. Run the verify command.

## Testing

Run this first:

```bash
npm run verify
```

This checks that important files exist and that the v2 world still makes sense.

The version badge reads `package.json`, so bump `package.json` and `package-lock.json` when you make a real game update. Also update the fallback version in `index.html`.

For browser automation, run:

```bash
npm run test:browser
```

Before calling a version “ready,” test these by hand too:

- Start screen fits on desktop and phone.
- Daniel and Sofie both start correctly.
- Salmon are possible to catch.
- 20 salmon unlocks encounters.
- Mom does not stay forever.
- Dad joke bubble is readable and Dad can damage the player.
- Only one Mom and one Dad are on screen at a time.
- Alaska boy/girl says `Hi, you're cute` and disappears after 5 seconds.
- Fullscreen works.
- Touch controls work on mobile size.

## Debug Mode

Debug mode is off by default.

Open:

```text
http://localhost:8000/?debug=1
```

Debug keys:

```text
~  show/hide debug panel
H  show/hide hitboxes
G  toggle god mode
```

## Current Tuning

Important starting values:

```text
walkSpeed: 360
slideSpeed: 575
groundAcceleration: 4200
airAcceleration: 2500
airJumps: 1
salmonSpawnSeconds: 1.12
salmonFallVelocity: 235
salmonFallVelocityRange: 45
salmonFallGravity: 275
player health: 100
salmon target: 20
```

Encounter rules:

```text
max active Mom: 1
max active Dad: 1
max active wildlife: 1
max active damage threat at level 1: 1
```

## More Docs

Useful extra notes:

- `docs/hockey-smash-v2-architecture.md`
- `docs/hockey-smash-sprite-sheet-port.md`
- `docs/GAMEPLAY_POLISH.md`

Start with this README first. Historical release details live in `CHANGELOG.md`.
