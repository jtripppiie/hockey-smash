# Hockey Smash Design

## Title And Version

**Hockey Smash v0.5.0**

Hockey Smash is now the primary playable mode in this existing static HTML/CSS/JavaScript repo. The old Roadside Realm files remain available as background infrastructure, but the public launch screen should only present Hockey Smash.

## Launch Flow

1. Splash screen shows `Hockey Smash`.
2. Visible version reads `Hockey Smash v0.5.0`.
3. Play shows a 2-3 second transition: `Entering Hockey Smash...`.
4. Gameplay opens in a full browser-viewport screen.
5. The page/body does not scroll while gameplay is active.

## Layout

- Fixed-screen side-scroller.
- Landscape-first 16:9 canvas.
- Internal canvas size: `1024x576`.
- Ground line: `groundY = canvasHeight * 0.60`.
- Daniel and all major characters align to the ground line.
- Bottom-left controls are for left/right movement.
- Bottom-right controls are Jump, Slide, and Stick.

## Daniel

Daniel is a kid hockey character with shoes, a stick, and masked street-hockey vigilante energy.

Current prototype rules:

- Single 96x96 player sprite path.
- Faces right by default.
- Moving left flips the sprite in code.
- Left/right movement only.
- No up/down lanes.
- No platforms, pits, or camera-follow level yet.

## Movement And Combat

- Walk speed: normal side movement.
- Slide speed: faster movement while holding Slide.
- Jump: grounded Mario-style jump with gravity.
- Hockey stick combo:
  - first tap: basic swing
  - second quick tap: stronger second swing
  - third quick tap: finisher
  - combo resets after the timing window

The hockey stick clears hazards, salmon, interruption bubbles, Dad jokes, and damages Dad.

## Health

- Daniel has one health bar.
- No lives system in v0.5.0.
- Hazards reduce health.
- Daniel gains brief invincibility after damage.
- At zero health, show Try Again instead of instantly restarting.

## First Level

The first level is a summer Soldotna, Alaska-inspired street/sidewalk scene. The background is visual only. Collision uses the ground line and sidewalk/ground layer, not the background art.

## Hazards And Characters

- Bears: sudden but fair wildlife pressure.
- Moose: heavier, more dangerous wildlife pressure.
- Salmon: fly/jump across the screen and can be knocked away.
- Major salmon run: a short chaotic sequence before the boss.
- Mom: appears with an interruption bubble such as `Daniel, clean your room!`.
- Sister: appears with a playful teasing bubble such as `Daniel, you smell!`.
- Dad: enters after salmon run and attacks with dad-joke hazards.

## Dad Boss

Dad has a small health bar above his character. Dad joke attacks are actual hazards and can be destroyed with stick swings. Combo hits do more damage.

## Asset List

```text
assets/player_hockey_sprite_96x96.png
assets/salmon_sprite_96x96.png
assets/bear_sprite_96x96.png
assets/moose_sprite_96x96.png
assets/dad_mower_sprite_96x96.png
assets/dad_sprite_96x96.png
assets/mom_sprite_96x96.png
assets/mom_sprite_text_96x96.png
assets/sister_sprite_96x96.png
assets/sister_sprite_text_96x96.png
assets/soldotna_background_01.png
assets/sidewalk_tile_96x32.png
assets/soldotna_background_placeholder.png
assets/soldotna_sidewalk_placeholder.png
```

## Prototype Scope

v0.5.0 is a playable prototype, not a finished content-complete game. It should prove launch flow, canvas layout, Daniel movement, jump, slide, combo attack, health, no-scroll controls, placeholders, hazards, family interruptions, salmon run, and Dad boss.

## Future Upgrades

- Real sprite sheets and animation states.
- Tuned enemy waves.
- Better hit sparks and sound.
- Longer level/camera.
- More Daniel moves.
- Better Dad boss joke variety.
