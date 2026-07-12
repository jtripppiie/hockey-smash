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

You need a code editor (such as VS Code), a web browser, and a terminal. A terminal is a window where you type commands instead of clicking buttons.

1. Open the `roadside-realm` folder in your code editor.
2. Open a terminal in that folder. In VS Code, choose **Terminal > New Terminal**.
3. Type this command and press Enter:

```bash
python3 -m http.server 8000
```

4. Open `http://localhost:8000/` in your browser.
5. Leave the terminal running while you work. To stop the server, click the terminal and press **Ctrl+C**.

After a change, save the file and refresh the browser. If the old version still appears, use a hard refresh: **Ctrl+Shift+R** on Windows/Linux or **Command+Shift+R** on a Mac.

Use `http://localhost:8000/?debug=1` to see game state. Press `H` for hitboxes or `G` for god mode.

## Your First Change: Jump Higher

This experiment changes one number. It is safe, easy to see, and easy to undo.

1. Start the game by following **Run the Game** above.
2. In your editor, open `js/games/hockey-smash-world-v2.js`.
3. Search for `jumpVelocity`. In most editors, press **Ctrl+F** or **Command+F** and type the word.
4. You will find this line inside `DEFAULT_TUNING`:

```js
jumpVelocity: 810,
```

5. Change `810` to `950`:

```js
jumpVelocity: 950,
```

6. Save the file, refresh the browser, start a run, and press Jump. The player should jump higher.

Why it works: `jumpVelocity` is the upward push given to the player. A larger number means a stronger jump. Try `700` for a lower jump or `1100` for a very high one. Change only this number so you know what caused the result.

To undo the experiment, change the number back to `810`. If the game shows a blank page, check that the comma after the number is still there.

## Your Second Change: Restyle the Direction Pad

The direction pad is HTML styled with CSS. CSS is the part of a web page that controls colors, sizes, spacing, and shapes.

1. Open `index.html`.
2. Search for `.v2-dpad`.
3. You will see a block like this:

```css
.v2-dpad {
  width: 6.5rem;
  height: 6.5rem;
  border: 2px solid rgba(255, 255, 255, 0.28);
  border-radius: 50%;
  background: rgba(10, 20, 33, 0.72);
}
```

4. Make one small change, save, and refresh. Here are safe experiments:

| What you want | What to change | Example |
| --- | --- | --- |
| A bigger pad | `width` and `height` | `7.5rem` |
| Make it square | `border-radius` | `18px` |
| A blue pad | `background` | `rgba(20, 70, 120, 0.72)` |
| Move the thumb farther | `1.45rem` in the knob transforms | `1.8rem` |

`rgba` colors contain red, green, blue, and transparency. The final number goes from `0` (invisible) to `1` (solid).

Do not remove the braces `{ }`, colons `:`, or semicolons `;`. They are punctuation the browser uses to understand CSS. If something looks wrong, undo once with **Ctrl+Z** or **Command+Z**, save, and refresh again.

The line `-webkit-tap-highlight-color: transparent` elsewhere in the control styles prevents a blue rectangle from flashing over a button on some phones. Leave it in place unless you are deliberately experimenting with touch feedback.

## Check Your Work

Play the game first. Try both left and right controls, jump several times, and check both portrait and landscape orientation if you have a phone.

Then run:

```bash
npm run verify
```

If it says `Hockey Smash v2 verification passed`, the basic checks succeeded. For the full browser test, run:

```bash
npm run test:browser
```

If a command fails, read the first error—not all the errors at once. The first one is usually the useful clue. You can always undo your last edit and try a smaller change.

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

The first command catches missing files, syntax errors, version drift, and important architecture mistakes. The second opens a real browser and checks player-visible behavior. Tests are a safety net, not a replacement for playing. If this is your first lesson, the longer **Check Your Work** section above explains these commands more gently.

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
