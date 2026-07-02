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
- Some production assets are now loaded by the canvas renderer with runtime chroma-key cleanup.

## Generated Assets

### V2 Backgrounds

| File | Purpose | Dimensions | Notes |
|---|---|---:|---|
| `backgrounds/sun.webp` | Daytime sky orb | art source dimensions | Loaded by v2 renderer. |
| `backgrounds/moon.webp` | Nighttime sky orb | art source dimensions | Loaded by v2 renderer. |
| `backgrounds/parallax/hockey-smash-parallax-mountains-bg-1536x576.png` | Generated background mountains/sky layer | 1536x576 | Pixel-art Soldotna/Kenai-style distant landscape. |
| `backgrounds/parallax/hockey-smash-parallax-kenai-mountains-bg-1536x576.svg` | Editable background mountains/sky layer | 1536x576 | Snow-capped Alaska mountain ridges, sky, clouds, haze, and spruce tree line. |
| `backgrounds/parallax/hockey-smash-parallax-soldotna-storefronts-mid-1536x320.png` | Generated midground storefront/town-sign layer | 1536x320 | Includes readable `Soldotna, Alaska` and `Population 4,342` sign. |
| `backgrounds/parallax/hockey-smash-parallax-nelson-engineering-sign-1536x320.svg` | Deterministic storefront sign overlay | 1536x320 | Adds readable `Nelson Engineering` text. |
| `backgrounds/parallax/hockey-smash-parallax-soldotna-city-nelson-engineering-mid-1536x320.svg` | Editable Soldotna city storefront layer | 1536x320 | Includes `Nelson Engineering`, nearby local storefronts, snow banners, street posts, and a `Soldotna, Alaska` town sign. |
| `backgrounds/parallax/hockey-smash-parallax-soldotna-city-nelson-engineering-mid-1536x320.webp` | Runtime Soldotna city storefront layer | 1536x320 | Lossless WebP export of the editable SVG. Loaded by the game to keep sign text stable while scrolling. |
| `backgrounds/parallax/hockey-smash-parallax-sidewalk-front-1536x170.png` | Generated foreground sidewalk/street layer | 1536x170 | Sidewalk, snowbank, curb, and street strip. |
| `backgrounds/parallax/hockey-smash-parallax-sidewalk-soldotna-front-1536x170.svg` | Runtime/editable foreground sidewalk/street layer | 1536x170 | Tileable SVG sidewalk, snowbank, curb, street strip, and asphalt edge detail. Loaded directly by the game. |
| `backgrounds/parallax/hockey-smash-parallax-sidewalk-soldotna-front-1536x170.png` | Raster foreground sidewalk/street layer | 1536x170 | Older PNG export kept as a fallback/reference. |
| `backgrounds/parallax/hockey-smash-parallax-town-foreground-1536x526.png` | Combined rendered town foreground layer | 1536x526 | Composites storefronts, Nelson Engineering overlay, snowbank, sidewalk, curb, and extended street so they move as one layer. |
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
| `sprites/salmon-falling.webp` | Falling salmon collectible | source dimensions | Active v2 salmon sprite. |
| `sprites/bear-walk-01.webp` through `sprites/bear-walk-06.webp` | Bear walk animation frames | source dimensions | Active v2 bear encounter frames. |
| `sprites/moose-walk-01.webp` through `sprites/moose-walk-03.webp` | Moose walk animation frames | source dimensions | Active v2 moose encounter frames. |
| `sprites/eagle-flap-mid.webp` | Eagle encounter sprite | source dimensions | Active v2 duckable eagle encounter; rendered as one image, not a flap animation. |
| `sprites/dad-cameo.webp` | Dad mower encounter | source dimensions | Active v2 joke encounter with contact damage. |
| `sprites/mom-cameo.webp` | Mom cameo | source dimensions | Active v2 non-contact passing cameo. |
| `sprites/alaska-boy-cameo.webp` | Alaska boy cameo | source dimensions | Active v2 boost cameo. |
| `sprites/alaska-girl-cameo.webp` | Alaska girl cameo | source dimensions | Active v2 boost cameo. |
| `sprites/projectile-hockey-puck.webp` | Daniel projectile | 32x24 | Generated transparent WebP. |
| `sprites/projectile-dancer-shoe.webp` | Sofie projectile | 40x28 | Generated transparent WebP. |

## Transparency Notes

The current runtime sprite assets are WebP files. New generated projectile sprites were produced from green-screen sources using `ffmpeg` and the `colorkey` filter, then exported as transparent WebP files.

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

## Next Recommended Asset Work

If these become production assets, do this before final implementation:

1. Replace placeholder/source-derived cameo art with final character-specific sprites.
2. Keep active sprite filenames descriptive, kebab-case, and state-specific.
3. Add any used files to the service worker cache list if a service worker returns.
4. Test high contrast mode with image outlines or canvas overlays.
