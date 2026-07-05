# Hockey Smash Sprite Sheet Port

Date: 2026-07-05

## What Changed

Hockey Smash v1.4.0 ports the generated Alaska sprite-sheet work into the v2 canvas renderer.

New runtime sheets live in `assets/hockey-smash/sprites/`:

```text
player-run-headless-sheet.webp
dad-run-sheet.webp
mom-run-sheet.webp
bear-walk-sheet.webp
moose-walk-sheet.webp
eagle-fly-sheet.webp
salmon-swim-sheet.webp
```

The older one-frame and per-frame WebP files remain as fallbacks.

## Source Assets

The source sheets came from the Android project:

```text
app/src/main/res/drawable-nodpi/sheet_player_run_headless.png
app/src/main/res/drawable-nodpi/sheet_dad_run.png
app/src/main/res/drawable-nodpi/sheet_mom_run.png
app/src/main/res/drawable-nodpi/sheet_bear_walk.png
app/src/main/res/drawable-nodpi/sheet_moose_walk.png
app/src/main/res/drawable-nodpi/sheet_eagle_fly.png
app/src/main/res/drawable-nodpi/sheet_salmon_swim.png
```

Each sheet is treated as six horizontal frames.

## Conversion Recipe

The generated PNG sources used magenta/purple and some green matte areas. A plain `colorkey` pass left visible artifacts, so the final WebP export used a dual matte expression:

```bash
ffmpeg -y -i SOURCE.png \
  -vf "format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(gt(r(X,Y),max(60,g(X,Y)*1.25))*gt(b(X,Y),max(60,g(X,Y)*1.15))*lt(g(X,Y),175)+gt(g(X,Y),max(80,r(X,Y)*1.15))*gt(g(X,Y),max(80,b(X,Y)*1.15))*lt(r(X,Y),170),0,255)',format=bgra" \
  -lossless 1 -quality 100 OUTPUT.webp
```

Use a composited preview before accepting the result:

```bash
ffmpeg -y -f lavfi -i color=c=lightblue:s=WIDTHxHEIGHT \
  -i OUTPUT.webp \
  -filter_complex "[0][1]overlay=format=auto" \
  -frames:v 1 preview.png
```

## Renderer Wiring

`js/games/hockey-smash-world-v2.js` owns the asset paths in `SPRITES`.

`js/games/hockey-smash-renderer-v2.js` owns:

```text
SPRITE_SHEETS
drawAnimatedSheetSprite()
getEntitySheetOptions()
renderPlayerHead()
```

`SPRITE_SHEETS` stores frame count, frame rate, display scale, and per-frame alpha trim bounds. The trim bounds keep the animal/person from rendering tiny inside a large transparent frame.

## Behavior Notes

- Player run uses the headless body sheet and a canvas-drawn Daniel/Sofie head overlay.
- Salmon uses the swim sheet plus wiggle and tilt.
- Eagle uses the fly sheet plus bob and tilt.
- Moose pauses on its grazing frame when the existing grazing state is active.
- Dad and Mom now animate from run sheets instead of static cameo art.
