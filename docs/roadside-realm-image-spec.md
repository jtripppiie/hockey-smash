# Roadside Realm Optional Image Asset Spec

This document is only needed if Roadside Realm uses hand-built, generated, or exported image assets instead of drawing everything directly with canvas primitives.

The default V1.0 plan still prefers canvas-drawn shapes because they are lightweight, local, and easy to recolor for high contrast. If images are used, this file defines exactly what to build so there is no guesswork.

Generated starter assets live under `assets/roadside-realm/`. See `assets/roadside-realm/ASSET_MANIFEST.md` for the current inventory, frame order, item order, transparency notes, and cleanup recommendations.

## Important Web DPI Rule

For browser games, **pixel dimensions are the real size**. DPI/PPI metadata does not control how large an image appears on screen. CSS pixels, image pixel dimensions, and canvas scaling do.

Use this rule:

```text
Build/export exact pixel dimensions for the game.
Set source artwork to 300 DPI if your art tool asks.
Export web PNG/WebP assets at the pixel sizes listed here.
Do not rely on DPI metadata for browser sizing.
```

Recommended source settings:

- Source files: 300 DPI/PPI, RGB color.
- Web exports: 72 or 96 DPI metadata is fine, but pixel dimensions must match this spec.
- Color profile: sRGB.
- Transparent assets: PNG-24 with alpha.
- Non-transparent background art: PNG or WebP.
- Pixel art exports: nearest-neighbor scaling, no blur.
- Painterly exports: normal antialiasing allowed.

## Asset Folder

If image assets are added, place them here:

```text
assets/roadside-realm/
```

Recommended folders:

```text
assets/roadside-realm/
  sprites/
  items/
  tiles/
  ui/
  backgrounds/
  endings/
  source/
```

Use `source/` only for editable originals if the repo wants to keep them. If source files are large, confirm before committing them.

## Naming Rules

Use lowercase kebab-case:

```text
realm-sprite-dust-goblin-idle.png
realm-item-mapstone.png
realm-ui-dpad-arrow-up.svg
realm-bg-map-kiosk-dungeon.png
```

Rules:

- Prefix every file with `realm-`.
- Include category: `sprite`, `item`, `tile`, `ui`, `bg`, `ending`.
- Include state when relevant: `idle`, `hit`, `attack`, `defeated`, `telegraph`.
- Do not use spaces.
- Do not use version suffixes like `final-final-2`.

## Required Export Scale

Build images at 2x resolution so they stay crisp on high-density screens.

| Intended Display Size | Export Size |
|---:|---:|
| 24x24 | 48x48 |
| 32x32 | 64x64 |
| 48x48 | 96x96 |
| 64x64 | 128x128 |
| 96x96 | 192x192 |
| 160x160 | 320x320 |
| 240x180 | 480x360 |
| 720x420 | 1440x840 |

Use CSS/canvas to draw exports at half size unless the implementation intentionally uses full-resolution canvas coordinates.

## Image Asset Decision Tree

Only build images when they improve the result:

| Need | Use Images? | Preferred Approach |
|---|---|---|
| Simple walls, doors, route lines | No | Canvas primitives |
| D-pad arrows and tiny UI icons | Usually no | CSS text icons or inline SVG |
| Highly expressive monster sprites | Maybe | PNG sprites or sprite sheet |
| Ending illustration | Maybe | Single background/ending image |
| Text labels | No | Real HTML text |
| Accessibility-critical information | No | HTML text plus canvas visual |
| High contrast variant | Avoid separate images | Recolor canvas or provide alternate SVG/CSS |

## Canvas Coordinate System

The game uses a 720x420 design canvas.

If images are exported at 2x:

```text
Design canvas: 720x420
High-density background export: 1440x840
Draw at canvas size: 720x420
```

If using an image for a monster at distance 1:

```text
Design display box: about 180x180
2x export box: 360x360
```

Keep transparent padding consistent so sprites do not jump between poses.

## Master Asset List

### Backgrounds

These are optional. Canvas-rendered backgrounds are preferred.

| Asset | Display Size | Export Size | Format | Transparent | Notes |
|---|---:|---:|---|---|---|
| Map Kiosk Dungeon backdrop | 720x420 | 1440x840 | PNG/WebP | No | Base wall/floor/ceiling mood if not canvas-drawn. |
| Forgotten Underpass backdrop | 720x420 | 1440x840 | PNG/WebP | No | Blue-gray concrete, moon glow, damp pavement. |
| Normal ending panel art | 720x420 | 1440x840 | PNG/WebP | No | Kiosk closing, route restored. |
| True ending panel art | 720x420 | 1440x840 | PNG/WebP | No | Moonlit route, secret star stamp. |

Background requirements:

- No embedded readable text. Use HTML for text.
- Leave center focus readable for sprites/items.
- Avoid dark muddy contrast.
- Keep road-trip motifs visible: map folds, route lines, sign bolts, kiosk frame.

### Monster Sprites

Use one sprite sheet per monster if using raster sprites.

Recommended sprite sheet layout:

```text
6 columns x 1 row
Frame order: idle, alert, hit, attack, defeated, special
Each frame: 360x360 export pixels
Full sheet: 2160x360 export pixels
Displayed per frame: 180x180 design pixels
```

Use transparent PNG.

| Monster | Display Frame | Export Frame | Sheet Size | Required Frames | Special Frame |
|---|---:|---:|---:|---|---|
| Dust Goblin | 180x180 | 360x360 | 2160x360 | idle, alert, hit, attack, defeated, special | dust puff |
| Map Bat | 180x180 | 360x360 | 2160x360 | idle, alert, hit, attack, defeated, special | wing flap/miss |
| Toll Troll | 190x190 | 380x380 | 2280x380 | idle, alert, hit, attack, defeated, special | barrier swing |
| Cone Imp | 170x170 | 340x340 | 2040x340 | idle, alert, hit, attack, defeated, special | cone hop |
| Snack Mimic | 180x180 | 360x360 | 2160x360 | idle, alert, hit, attack, defeated, special | disguise open |
| Signpost Ogre | 240x220 | 480x440 | 2880x440 | idle, alert, hit, attack, defeated, special | Big Spin telegraph |
| Moonlit Warden | 220x220 | 440x440 | 2640x440 | idle, alert, hit, attack, defeated, special | crescent flare |

Monster sprite rules:

- Keep every monster centered in its frame.
- Keep feet/base aligned across frames.
- Leave 12-20 export pixels of transparent padding.
- Use thick dark outlines.
- Silhouette must be recognizable without color.
- Do not include combat text in the image.
- Do not include gore, blood, horror, or realistic injury.

### Monster Design Notes

Dust Goblin:

- Squat dusty body.
- Torn map-scrap shield.
- Bright little eyes.
- Dust puff special frame.

Map Bat:

- Folded-paper wings.
- Tiny map-pin body.
- Crease lines on wings.
- Special frame is a dodge/miss wing flare.

Toll Troll:

- Toll-booth post body.
- Striped barrier arm club.
- Square sign-face head.
- Special frame raises the barrier arm.

Cone Imp:

- Traffic-cone body.
- White reflective stripe.
- Bent sign-pole spear.
- Special frame hops or tilts.

Snack Mimic:

- Crinkled snack bag body.
- Zipper teeth.
- Crumb eyes.
- Special frame opens from treasure disguise.

Signpost Ogre:

- Stacked road signs as torso.
- Route-shield head.
- Arrow-sign arms.
- Special frame shows circular Big Spin arcs.

Moonlit Warden:

- Tall underpass shadow robe.
- Crescent halo.
- Toll-token eye.
- Special frame opens crescent gate.

### Item Glyphs

Use individual transparent PNGs or SVGs.

| Item | Display Size | Export Size | Format | Notes |
|---|---:|---:|---|---|
| Rusty Road Key | 64x64 | 128x128 | PNG/SVG | Motel key tag and tooth. |
| Mapstone | 72x72 | 144x144 | PNG/SVG | Folded map tile with glowing center. |
| Moon Toll Token | 72x72 | 144x144 | PNG/SVG | Coin with crescent cutout. |
| Apple Juice Potion | 64x64 | 128x128 | PNG/SVG | Tiny bottle, apple label. |
| Snack Charm | 64x64 | 128x128 | PNG/SVG | Wrapped snack with charm loop. |
| Postcard Shield | 64x64 | 128x128 | PNG/SVG | Postcard rectangle with shield crease. |
| Compass Sticker | 64x64 | 128x128 | PNG/SVG | Round sticker, compass needle. |
| Lucky Toll Coin | 64x64 | 128x128 | PNG/SVG | Coin with toll booth icon. |

Item rules:

- Transparent background.
- Strong outline.
- Readable at 32x32.
- No text smaller than 10 display pixels.
- Glow should be a separate canvas effect if possible, not baked into every icon.

### Tile And Prop Images

These are optional overlays if canvas primitives are not enough.

| Asset | Display Size | Export Size | Format | Transparent | Use |
|---|---:|---:|---|---|---|
| Wall texture patch | 240x180 | 480x360 | PNG | Yes | Repeating stone/cardboard scuffs. |
| Underpass texture patch | 240x180 | 480x360 | PNG | Yes | Concrete cracks, moss, moon stains. |
| Locked toll gate | 320x180 | 640x360 | PNG/SVG | Yes | Door overlay at distance 1. |
| Open toll gate | 320x180 | 640x360 | PNG/SVG | Yes | Open/raised barrier. |
| Hidden moon scratch | 128x128 | 256x256 | PNG/SVG | Yes | Hidden wall clue overlay. |
| Underpass stairs | 220x160 | 440x320 | PNG/SVG | Yes | Transition glyph. |
| Exit route glow | 320x180 | 640x360 | PNG/SVG | Yes | Final exit route overlay. |

Prop rules:

- Build at front-distance size.
- Scale down for distance 2 and 3.
- Use transparent overlays for doors/props, not full-scene replacements.
- Keep collision/state logic in data, not in image names alone.

### UI Images

Most UI should be CSS/HTML. Images are optional.

| Asset | Display Size | Export Size | Format | Notes |
|---|---:|---:|---|---|
| D-pad up arrow | 32x32 | 64x64 | SVG preferred | Can also use text arrow. |
| D-pad down arrow | 32x32 | 64x64 | SVG preferred | Use same stroke weight as up. |
| D-pad left arrow | 32x32 | 64x64 | SVG preferred | Mirror of right. |
| D-pad right arrow | 32x32 | 64x64 | SVG preferred | Mirror of left. |
| Inspect icon | 32x32 | 64x64 | SVG preferred | Magnifier/map pin. |
| Attack icon | 32x32 | 64x64 | SVG preferred | Soft sign-bonk symbol, not weapon-gory. |
| Item icon | 32x32 | 64x64 | SVG preferred | Snack pouch or key ring. |
| Map icon | 32x32 | 64x64 | SVG preferred | Folded map. |
| Save icon | 32x32 | 64x64 | SVG preferred | Small postcard stamp or disk-like symbol. |

UI rules:

- Buttons must have real text labels or `aria-label`.
- Icons must not be the only accessible name.
- Icons should be single-color or two-color so high contrast is easy.
- Do not bake disabled states into separate images; use CSS.

### Badges

Badges appear on the summary screen only.

| Badge | Display Size | Export Size | Format | Visual |
|---|---:|---:|---|---|
| Route Restored | 48x48 | 96x96 | PNG/SVG | connected yellow route line |
| Secret Star | 48x48 | 96x96 | PNG/SVG | moon-blue star stamp |
| No Defeats | 48x48 | 96x96 | PNG/SVG | clean road shield |
| Snack Saver | 48x48 | 96x96 | PNG/SVG | unopened snack charm |
| Wall Whisperer | 48x48 | 96x96 | PNG/SVG | moon-scratch wall |
| Ogre Bonker | 48x48 | 96x96 | PNG/SVG | drooping signpost arrows |
| Underpass Explorer | 48x48 | 96x96 | PNG/SVG | stair and crescent |

Badge rules:

- Badges are decorative plus labeled in HTML.
- Each badge must have a text title.
- Locked/unearned badges are optional; if shown, use CSS opacity rather than separate gray images.

## Sprite Sheet JSON Metadata

If sprite sheets are used, keep frame metadata in JS data rather than hardcoding magic numbers everywhere.

Example:

```js
const SPRITE_SHEETS = {
  'dust-goblin': {
    src: 'assets/roadside-realm/sprites/realm-sprite-dust-goblin.png',
    frameWidth: 360,
    frameHeight: 360,
    displayWidth: 180,
    displayHeight: 180,
    frames: {
      idle: 0,
      alert: 1,
      hit: 2,
      attack: 3,
      defeated: 4,
      special: 5,
    },
  },
};
```

## Export Checklist

Before an image asset is considered ready:

- Correct filename.
- Correct pixel dimensions.
- sRGB color profile.
- Transparent background where required.
- No accidental white/black matte around transparent edges.
- Looks clear at intended display size.
- Looks acceptable at 50% size.
- Works on dark and light UI backgrounds.
- Does not contain critical text.
- Does not duplicate information that must be accessible in HTML.
- File size is reasonable for a static app.

## File Size Budgets

Keep the whole game lightweight.

| Asset Type | Target Max Per File | Notes |
|---|---:|---|
| Item/icon PNG | 20 KB | SVG may be smaller. |
| Badge/icon PNG | 20 KB | Prefer SVG for simple shapes. |
| Prop overlay | 60 KB | Use PNG compression. |
| Monster sprite sheet | 180 KB | Fewer colors compress better. |
| Boss sprite sheet | 260 KB | Larger frame allowed. |
| Background image | 350 KB | Prefer WebP if repo supports it. |
| Ending image | 350 KB | One or two images max. |

If images exceed these budgets, simplify colors, reduce texture, or return to canvas primitives.

## Accessibility Requirements For Images

- Do not put essential words inside images.
- Do not use image color as the only clue.
- Every meaningful image needs nearby HTML text or an `aria-label`.
- Canvas image states must also be reflected in status/log text.
- High contrast mode must either recolor assets, swap to high-contrast variants, or draw canvas outlines over them.
- Reduced motion must not depend on animated sprite frames to communicate danger.

## High Contrast Image Strategy

Preferred:

```text
Use canvas primitives and CSS colors for high contrast.
```

If raster images are used:

- Add dark outlines to every sprite and item.
- Avoid low-contrast texture-only details.
- Draw a high-contrast canvas outline around active monsters/items.
- Use HTML labels/status for critical state.
- Avoid separate high-contrast image sets unless absolutely necessary.

## Source File Guidance

Recommended editable source sizes:

| Asset | Source Canvas |
|---|---:|
| Monster frame | 720x720 at 300 DPI |
| Boss frame | 960x880 at 300 DPI |
| Item glyph | 512x512 at 300 DPI |
| Badge | 512x512 at 300 DPI |
| Background | 2880x1680 at 300 DPI |
| Ending art | 2880x1680 at 300 DPI |

Then export down to the web sizes in this document.

Do not commit giant layered source files unless the repo owner wants them. A practical compromise is to commit optimized PNG/SVG/WebP exports and keep source files outside the repo or in a separate asset archive.

## Minimum Image Set If You Choose Images

If you only want the most impact for the least work, build this set:

1. `realm-sprite-signpost-ogre.png` sprite sheet.
2. `realm-sprite-moonlit-warden.png` sprite sheet.
3. `realm-item-mapstone.svg`.
4. `realm-item-moon-toll-token.svg`.
5. `realm-tile-hidden-moon-scratch.svg`.
6. `realm-ending-true-route.webp`.

Everything else can still be canvas-drawn.

## Full Image Set If You Want Maximum Polish

Full optional set:

- 7 monster sprite sheets.
- 8 item glyphs.
- 7 badges.
- 2 background images.
- 2 ending images.
- 7 prop/tile overlays.
- 8 UI icons.

Total target:

```text
39 image files maximum.
Prefer fewer if canvas drawing already looks good.
```

## Final Image QA

Open the game on:

- desktop at normal size
- desktop at 200% browser zoom
- mobile portrait
- mobile landscape
- high contrast mode
- reduced motion mode

Confirm:

- sprites are crisp
- items are readable
- D-pad icons are clear
- no asset looks blurry from bad scaling
- no transparent asset has a halo
- no text is trapped inside images
- total load remains fast
- offline cache includes every image asset
