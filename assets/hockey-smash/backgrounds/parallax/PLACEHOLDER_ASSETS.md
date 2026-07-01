# Hockey Smash V2 Parallax Placeholder Assets

These files describe the parallax art contract for v2. The generated PNG
layers are the current in-game art. The SVG files remain useful deterministic
placeholder/overlay assets when exact text is needed.

| File | Exact dimensions | Intended layer | Renderer speed |
|---|---:|---|---:|
| `hockey-smash-parallax-mountains-bg-1536x576.png` | 1536x576 | generated snow-capped mountains / sky | 0.08 |
| `hockey-smash-parallax-kenai-mountains-bg-1536x576.svg` | 1536x576 | editable snow-capped Alaska mountains / spruce tree line / sky | 0.08 |
| `hockey-smash-parallax-soldotna-storefronts-mid-1536x320.png` | 1536x320 | generated storefronts / town sign | 0.24 |
| `hockey-smash-parallax-nelson-engineering-sign-1536x320.svg` | 1536x320 | deterministic Nelson Engineering sign overlay | 0.24 |
| `hockey-smash-parallax-soldotna-city-nelson-engineering-mid-1536x320.svg` | 1536x320 | editable Soldotna city storefront layer with Nelson Engineering | 0.24 |
| `hockey-smash-parallax-soldotna-city-nelson-engineering-mid-1536x320.webp` | 1536x320 | runtime raster Soldotna city layer with Nelson Engineering | 0.24 |
| `hockey-smash-parallax-sidewalk-front-1536x170.png` | 1536x170 | generated sidewalk / street foreground | 0.55 |
| `hockey-smash-parallax-sidewalk-soldotna-front-1536x170.svg` | 1536x170 | editable tileable Soldotna sidewalk / snowbank / street foreground | 0.55 |
| `hockey-smash-parallax-sidewalk-soldotna-front-1536x170.png` | 1536x170 | raster export of the editable sidewalk foreground | 0.55 |
| `hockey-smash-parallax-skyline-far-1536x576.svg` | 1536x576 | far mountains / skyline | 0.08 |
| `hockey-smash-parallax-trees-mid-1536x320.svg` | 1536x320 | mid trees / neighborhood | 0.24 |
| `hockey-smash-parallax-snowbank-front-1536x170.svg` | 1536x170 | front snowbank / ground edge | 0.55 |

The v2 renderer also uses:

| File | Purpose |
|---|---|
| `../assets/hockey-smash/backgrounds/sun.webp` | daytime sky orb |
| `../assets/hockey-smash/backgrounds/moon.webp` | nighttime sky orb |

Future parallax art should preserve transparent backgrounds for each layer.
