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

The circular pad includes four active directions. Left and right move, up triggers the same buffered jump as the keyboard, and down holds the shared slide/duck action. Dragging through the pad changes actions without requiring a new touch.

Touch presses request a tiny vibration on devices that support the Vibration API. Unsupported browsers simply ignore the request.

## Audio Without Asset Downloads

The browser synthesizes short cues with the Web Audio API after the player presses Start. No sound autoplays before a user gesture. The mute button stores its preference in local storage, and the game remains fully playable when Web Audio is unavailable.

## Golden Salmon And Victory

Each spawned salmon has a small chance to become golden. A golden catch has a 50-point base value and distinct light, particles, text, and audio. After the opening catch goal, the encounter stage announces difficulty levels. Surviving 90 encounter seconds advances world state to `victory`, saves the best score, and shows the championship results panel.

## Sprite Proportions

Static human cameo art is fitted inside its entity box while preserving the source image aspect ratio. The image is centered horizontally and aligned to the bottom of the box. Gameplay collision boxes remain stable even when source art has different proportions.

Bear, moose, and eagle art uses clean six-frame transparent sheets. Each frame has measured alpha bounds in `SPRITE_SHEETS`, allowing the renderer to crop unused transparent space without stretching or exposing background artifacts. The moose's sixth pose is reserved for grazing. Salmon deliberately uses one clean static image to avoid sheet-boundary and frame-transition artifacts; entity facing flips the whole image horizontally.

## Full-Field Projectiles

Pucks and shoes travel right until they hit a valid target or pass beyond the right edge. Their lifetime is long enough to cross the entire 1024-pixel playfield from the far-left firing position, so shots no longer disappear halfway across an empty screen.

## Where To Tweak

- Salmon separation: `spawnHarnessSalmon` in `hockey-smash-systems-v2.js`.
- Catch and landing bursts: `world.effects.push` calls in the systems file.
- Burst appearance: `renderBurst` in `hockey-smash-renderer-v2.js`.
- Direction-pad appearance: `.v2-dpad` styles in `index.html`.

After any change, run `npm run verify` and `npm run test:browser`, then play one full opening salmon run yourself.
