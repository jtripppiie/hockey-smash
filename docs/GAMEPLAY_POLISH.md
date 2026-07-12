# Gameplay Polish Systems

This document explains the small systems that make Hockey Smash feel responsive and readable. Each one is intentionally data-driven and lives in the existing world → systems → renderer loop.

## Fair Salmon Spawning

Before a salmon appears, the spawn helper compares its horizontal position with active salmon. It retries up to five times when the new fish would be within 120 world pixels of another fish. This reduces impossible-looking clusters without making every drop predictable.

Missing a salmon clears the current combo and shows a short `MISSED` cue. Catching still rewards quick movement, while the player can immediately begin a new streak.

## Particle Bursts

Temporary visual feedback stays in `world.effects`. A burst records only its center, color, particle count, spread, and lifetime. The renderer derives particle positions from those values, so no DOM nodes or independent animation timers are needed.

Bursts currently communicate:

- salmon catches;
- perfect catches;
- hard landings;
- player damage;
- completion of the opening 20-salmon run.

These effects do not affect collision or scoring. They are visual confirmation that an action worked.

## Direction Pad Contract

The circular pad visibly includes up, down, left, and right. Left and right drive the current side-scrolling movement. Up and down are deliberately reserved, so a future feature can activate them without redesigning the control.

## Sprite Proportions

Static human cameo art is fitted inside its entity box while preserving the source image aspect ratio. The image is centered horizontally and aligned to the bottom of the box. Gameplay collision boxes remain stable even when source art has different proportions.

## Where To Tweak

- Salmon separation: `spawnHarnessSalmon` in `hockey-smash-systems-v2.js`.
- Catch and landing bursts: `world.effects.push` calls in the systems file.
- Burst appearance: `renderBurst` in `hockey-smash-renderer-v2.js`.
- Direction-pad appearance: `.v2-dpad` styles in `index.html`.

After any change, run `npm run verify` and `npm run test:browser`, then play one full opening salmon run yourself.
