# Contributing

Hockey Smash is a playable static browser game and a learning project. Contributions should keep it small, original, and easy to understand.

## Guidelines

- Keep assets and writing original.
- Prefer readable code over clever abstractions.
- Preserve offline-friendly behavior.
- Keep family-friendly content.
- Document new systems in `docs/`.

## A Good First Change

1. Read `docs/LEARNING_GUIDE.md`.
2. Pick one small change.
3. Change one tuning value or one focused function.
4. Run `npm run verify` and `npm run test:browser`.
5. Play both Daniel and Sofie before committing.

## Design Rules

- Put game memory in `world`.
- Put movement and collision rules in `hockey-smash-systems-v2.js`.
- Put canvas drawing in `hockey-smash-renderer-v2.js`.
- Keep page buttons, accessibility, and the main loop in `index.html`.
- Add a browser test when a player-visible rule changes.

Avoid adding frameworks or build tools until the game truly needs them. Readable code beats clever code here.
