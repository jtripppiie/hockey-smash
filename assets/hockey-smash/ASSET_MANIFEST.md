# Hockey Smash Asset Manifest

Generated starter asset set for Hockey Smash.

The game design still supports canvas-drawn art. These files are optional production assets that can be used when image-based sprites or illustrations are desired.

## Current Standing

The game is currently in **playable preview plus starter asset** state:

- Design plan: strong and build-ready.
- Summary docs: maintained.
- Optional image spec: complete.
- Starter image assets: generated and placed in project folders.
- Playable implementation: underway on `main`.
- Production sprite sheets use transparent PNG/WebP and are loaded by the canvas renderer.

## Generated Assets

### V2 Backgrounds

| File | Purpose | Dimensions | Notes |
|---|---|---:|---|
| `backgrounds/sun.webp` | Daytime sky orb | art source dimensions | Loaded by v2 renderer. |
| `backgrounds/moon.webp` | Nighttime sky orb | art source dimensions | Loaded by v2 renderer. |
| `backgrounds/parallax/hockey-smash-parallax-kenai-mountains-bg-1536x576.svg` | Editable background mountains/sky layer | 1536x576 | Snow-capped Alaska mountain ridges, sky, clouds, haze, and spruce tree line. |
| `backgrounds/parallax/hockey-smash-parallax-nelson-engineering-sign-1536x320.svg` | Deterministic storefront sign overlay | 1536x320 | Adds readable `Nelson Engineering` text. |
| `backgrounds/parallax/hockey-smash-parallax-soldotna-city-nelson-engineering-mid-1536x320.svg` | Editable Soldotna city storefront layer | 1536x320 | Includes `Nelson Engineering`, nearby local storefronts, snow banners, street posts, and a `Soldotna, Alaska` town sign. |
| `backgrounds/parallax/hockey-smash-parallax-soldotna-city-nelson-engineering-mid-1536x320.webp` | Runtime Soldotna city storefront layer | 1536x320 | Lossless WebP export of the editable SVG. Loaded by the game to keep sign text stable while scrolling. |
| `backgrounds/parallax/hockey-smash-parallax-sidewalk-soldotna-front-1536x170.svg` | Runtime/editable foreground sidewalk/street layer | 1536x170 | Tileable SVG sidewalk, snowbank, curb, street strip, and asphalt edge detail. Loaded directly by the game. |
| `backgrounds/parallax/hockey-smash-parallax-skyline-far-1536x576.svg` | Far parallax skyline placeholder | 1536x576 | Filename and dimensions are visible in the SVG. |

### Sprites

Active v2 sprite filenames use descriptive kebab-case names:

```text
character-or-entity-action-or-state-frame.webp
```

| File | Purpose | Dimensions | Notes |
|---|---|---:|---|
| `sprites/daniel-hockey-idle.webp` | Daniel player idle/run pose | source dimensions | Active v2 player sprite. |
| `sprites/daniel-hockey-slide.webp` | Daniel slide pose | source dimensions | Active v2 slide sprite. |
| `sprites/daniel-hockey-duck.webp` | Daniel duck pose | source dimensions | Used for Daniel eagle dodge. |
| `sprites/daniel-splash.webp` | Daniel splash/start image | source dimensions | Used on the v2 start screen. |
| `sprites/sofie-dancer-idle.webp` | Sofie player idle/run pose | source dimensions | Active v2 player sprite. |
| `sprites/sofie-dance-spin.webp` | Sofie spin/slide pose | source dimensions | Also reused for Daniel sister support until dedicated art exists. |
| `sprites/sofie-dance-instructor.webp` | Sofie dance instructor encounter | source dimensions | Active v2 instructor/teacher encounter. |
| `sprites/bear-walk-sheet-v2.png` | Clean six-frame bear walk sheet | 2172x724 | Transparent artifact-free bear encounter animation. |
| `sprites/moose-walk-sheet-v2.png` | Clean six-frame moose walk/graze sheet | 2172x724 | Five walk poses plus a head-lowered grazing pose. |
| `sprites/eagle-fly-sheet-v2.png` | Clean six-frame eagle flight sheet | 2172x724 | Transparent full wing-flap cycle. |
| `sprites/salmon-static-v2.png` | Clean static salmon | 390x195 | Single transparent collectible image; horizontally flipped by entity facing. |
| `sprites/bear-walk-01.webp` through `sprites/bear-walk-06.webp` | Bear walk animation frames | source dimensions | Legacy fallback if sheet loading fails. |
| `sprites/moose-walk-01.webp` through `sprites/moose-walk-03.webp` | Moose walk animation frames | source dimensions | Legacy fallback if sheet loading fails. |
| `sprites/eagle-flap-mid.webp` | Eagle encounter sprite | source dimensions | Legacy fallback if sheet loading fails. |
| `sprites/dad-cameo.webp` | Dad mower encounter | source dimensions | Legacy fallback if sheet loading fails. |
| `sprites/mom-cameo.webp` | Mom cameo | source dimensions | Legacy fallback if sheet loading fails. |
| `sprites/alaska-boy-cameo.webp` | Alaska boy cameo | source dimensions | Active v2 boost cameo. |
| `sprites/alaska-girl-cameo.webp` | Alaska girl cameo | source dimensions | Active v2 boost cameo. |
| `sprites/projectile-hockey-puck.webp` | Daniel projectile | 32x24 | Generated transparent WebP. |
| `sprites/projectile-dancer-shoe.webp` | Sofie projectile | 40x28 | Generated transparent WebP. |

## Transparency Notes

Runtime sprites use transparent WebP or PNG. Projectile sprites were produced from green-screen sources using `ffmpeg` and the `colorkey` filter. The current wildlife and salmon sheets were generated as consistent six-frame chroma-key sheets, converted locally to alpha with a soft matte and despill, and validated at original resolution. They replace retired sheets whose magenta/purple matte corruption was baked into the pixels.

PNG files are retained only where they are still used by the parallax background pipeline. Source-only sprite copies and unused alternate background variants are intentionally removed so the asset folder stays easy to understand.

## Generation Prompts

The assets were generated with the built-in image generation tool during earlier Hockey Smash art passes. This manifest is now the maintained inventory for generated asset notes.

Prompt themes:

- handmade roadside fantasy arcade panel
- thick dark outlines
- family-friendly, cozy weird, not horror
- no readable text
- no watermark
- no real brands
- chroma-key green only for generated source sprites/icons
- for AI-generated sprite sheets, use high-contrast removable matte colors and document the matte thresholds

## Next Recommended Asset Work

If these become production assets, do this before final implementation:

1. Replace placeholder/source-derived cameo art with final character-specific sprites.
2. Keep active sprite filenames descriptive, kebab-case, and state-specific.
3. Add any used files to the service worker cache list if a service worker returns.
4. Test high contrast mode with image outlines or canvas overlays.
