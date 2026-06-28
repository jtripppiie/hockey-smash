# Technical Plan

## Target

Roadside Realmo should start as a static web game that can be hosted on GitHub Pages or any plain static host.

## Proposed Stack

- HTML for the app shell
- CSS for layout and interface styling
- JavaScript for game logic
- Canvas for the first-person view
- Local storage for settings and save data

TypeScript can be introduced later if the model/state layer grows.

## Suggested File Structure

```text
roadside-realmo/
  index.html
  src/
    main.js
    game-state.js
    renderer.js
    input.js
    data/
      realms.js
      encounters.js
  styles/
    main.css
  assets/
  docs/
```

## Data Model Sketch

Realm data can start as plain objects:

```js
{
  id: "motel-many-doors",
  name: "The Motel of Many Doors",
  width: 5,
  height: 5,
  start: { x: 2, y: 4, facing: "north" },
  tiles: {
    "2,4": { floor: "carpet", wall: "motel", exits: ["north"] }
  }
}
```

## Rendering Plan

Start simple:

1. Draw a fixed first-person corridor/card view.
2. Use tile metadata to choose walls, doors, signs, and props.
3. Add depth layers after movement feels good.
4. Add animation sparingly.

## Input Plan

Support:

- Keyboard arrows or WASD
- On-screen buttons for mobile
- Click/tap Inspect

Avoid requiring fast reactions.

## Persistence

Use local storage for:

- Current realm
- Position/facing
- Inventory
- Completed encounters
- Settings

## First Milestone

Build a playable vertical slice:

- One static HTML page
- One canvas view
- One realm
- Movement
- Inspect action
- One item
- One ending

