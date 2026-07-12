# Hockey Smash V2 Parallax Placeholder Assets

These files describe the active parallax art contract. Editable SVG files are
used directly where practical; the city layer uses a WebP runtime export to
keep detailed sign text stable while scrolling.

| File | Exact dimensions | Intended layer | Renderer speed |
|---|---:|---|---:|
| `hockey-smash-parallax-kenai-mountains-bg-1536x576.svg` | 1536x576 | editable snow-capped Alaska mountains / spruce tree line / sky | 0.08 |
| `hockey-smash-parallax-nelson-engineering-sign-1536x320.svg` | 1536x320 | deterministic Nelson Engineering sign overlay | 0.24 |
| `hockey-smash-parallax-soldotna-city-nelson-engineering-mid-1536x320.svg` | 1536x320 | editable Soldotna city storefront layer with Nelson Engineering | 0.24 |
| `hockey-smash-parallax-soldotna-city-nelson-engineering-mid-1536x320.webp` | 1536x320 | runtime raster Soldotna city layer with Nelson Engineering | 0.24 |
| `hockey-smash-parallax-sidewalk-soldotna-front-1536x170.svg` | 1536x170 | runtime/editable tileable Soldotna sidewalk / snowbank / street foreground with asphalt edge detail | 0.55 |
| `hockey-smash-parallax-skyline-far-1536x576.svg` | 1536x576 | far mountains / skyline | 0.08 |

The v2 renderer also uses:

| File | Purpose |
|---|---|
| `../../sun.webp` | daytime sky orb |
| `../../moon.webp` | nighttime sky orb |

Future parallax art should preserve transparent backgrounds for each layer.
