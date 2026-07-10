# Learn Game Development With Hockey Smash

This guide is the best place to begin. You do not need to understand the whole game before changing it. Make one tiny change, test it, and then make another.

## The Four-Part Loop

Every frame follows the same path:

```text
input -> world -> systems -> renderer
```

- **Input** records held keys and buttons in `index.html`.
- **World** is the game's memory in `js/games/hockey-smash-world-v2.js`.
- **Systems** change that memory in `js/games/hockey-smash-systems-v2.js`.
- **Renderer** draws the memory in `js/games/hockey-smash-renderer-v2.js`.

This separation is important. A salmon's position belongs in the world, its falling rule belongs in a system, and its picture belongs in the renderer.

## Run the Game

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`. After a change, refresh the page. Use `http://localhost:8000/?debug=1` to see game state and press `H` for hitboxes or `G` for god mode.

## Read the Code in This Order

1. Find `DEFAULT_TUNING` in the world file. These numbers control the feel of the game.
2. Find `createPlayer` and `createEntity`. These show what game objects remember.
3. Find `updatePlayer` and `collectSalmon` in the systems file. These are small examples of rules changing state.
4. Find `renderWorld` in the renderer. Follow the calls it makes to see how layers are drawn.
5. Find `function loop` in `index.html`. This connects all the pieces.

## Safe First Experiments

Change only one value at a time and write down what happened.

| Goal | File | Try changing |
| --- | --- | --- |
| Jump higher | world file | `jumpVelocity` |
| Run faster | world file | `walkSpeed` |
| Drop more salmon | world file | `salmonSpawnSeconds` |
| Make combos last longer | systems file | `player.comboTimer = 2.1` |
| Change a Dad joke | `index.html` | one string in `DAD_JOKES` |
| Change sky speed | world file | `cycleSeconds` |

Use Git after each experiment:

```bash
git status
git diff
git add path/to/file
git commit -m "Describe the change"
```

## Build a Small Feature

Use this checklist for any new idea:

1. Say the player rule in one sentence.
2. Decide what new memory the world needs.
3. Write one system function that changes that memory.
4. Draw it only after the rule works.
5. Add a test for the important behavior.
6. Run both test commands and play it yourself.

Example: "A golden salmon gives 50 points." It needs a `golden` value on a salmon, a scoring branch in `collectSalmon`, and a gold tint or sprite in the renderer.

## Tests

```bash
npm run verify
npm run test:browser
```

The first command catches missing files, syntax errors, version drift, and important architecture mistakes. The second opens a real browser and checks player-visible behavior. Tests are a safety net, not a replacement for playing.

## When Something Breaks

- Blank page: open the browser developer console and read the first red error.
- Old code still runs: hard refresh; script URLs use the package version as a cache key.
- Sprite does not appear: check its path in `SPRITES` and the asset manifest.
- Collision feels unfair: turn on debug hitboxes and adjust the inset before changing the art.
- Test fails: read the first failure, make the smallest correction, and rerun that command.

## Next Projects

Start small and stop when each project works:

1. Add another Dad joke.
2. Tune jump height and explain your choice in a commit.
3. Add a different score value for a special salmon.
4. Add sound with a mute button and no autoplay.
5. Add a new encounter using an original drawing.

The goal is not to write the most code. The goal is to understand every line you add.
