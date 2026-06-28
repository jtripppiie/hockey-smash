# Roadside Realmo

Roadside Realmo is a first-person, tile-based road-fantasy dungeon crawler concept. It is inspired by classic grid movement, turn-by-turn exploration, strange roadside landmarks, and compact adventures that can run in a browser.

The working name is temporary, but the mood is clear: gas-station castles, motel labyrinths, neon ruins, vending-machine sages, and monsters that feel like they wandered out from the edge of a highway map.

## Current Status

This repository is only a planning scaffold for now. No playable code has been added yet.

## Game Pillars

- First-person exploration with simple grid movement.
- Quick sessions that work well on desktop and mobile web.
- Roadside fantasy instead of traditional medieval fantasy.
- Readable, family-friendly encounters.
- Offline-friendly static web app architecture.
- Original art, names, maps, enemies, and mechanics.

## Early Gameplay Idea

Players explore roadside "realms" one tile at a time:

- Turn left or right.
- Step forward.
- Inspect signs, doors, trunks, vending machines, ruins, and odd landmarks.
- Find map scraps, snacks, charms, and keys.
- Battle or outwit strange road creatures.
- Return to the road with new routes unlocked.

## Possible Realms

- The Motel of Many Doors
- The Neon Marsh Rest Stop
- The Overpass Catacombs
- The Cornfield Roundabout
- The Snowplow Shrine
- The Desert Pump Kingdom

## Tech Direction

The likely first implementation will be a static browser game:

- HTML
- CSS
- Vanilla JavaScript or TypeScript
- Canvas for the first-person view
- Local storage for saves/settings
- Optional service worker for offline play

## Repository Contents

- `README.md`: project overview
- `docs/game-design.md`: early design notes
- `docs/technical-plan.md`: implementation direction
- `CONTRIBUTING.md`: contribution guidelines
- `LICENSE`: project license placeholder

## Development

No build system exists yet. The first playable milestone should add the smallest useful loop:

1. Render one realm.
2. Move on a small grid.
3. Inspect objects.
4. Resolve one encounter.
5. Save basic progress locally.

