# Hockey Smash Design

## Title And Version

**Hockey Smash v0.5.3**

Hockey Smash is now the primary playable mode in this static HTML/CSS/JavaScript repo. The public launch screen should present Hockey Smash clearly, with the local splash sprite and Soldotna-inspired background sequence.

## Launch Flow

1. Splash screen shows `Hockey Smash`.
2. Visible version reads `Hockey Smash v0.5.3`.
3. Play shows a 2-3 second transition: `Entering Hockey Smash...`.
4. Gameplay opens in a full browser-viewport screen.
5. The page/body does not scroll while gameplay is active.

## Layout

- Fixed-screen side-scroller.
- Landscape-first 16:9 canvas.
- Internal canvas size: `1024x576`.
- Ground line: `groundY = canvasHeight * 0.82`.
- The hockey player and all major characters align to the visible sidewalk in the background art.
- Bottom-left controls are for left/right movement.
- Bottom-right controls are Jump, Slide, and Stick.

## Hockey Player

The player is a kid hockey character with shoes, a stick, and masked street-hockey vigilante energy.

Current prototype rules:

- Single large static player sprite path.
- Temporary debug marker/ring makes the player easy to spot while movement is being stabilized.
- Faces right by default.
- Moving left flips the sprite in code.
- Left/right movement, jump, slide, and stick swing are all wired.
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
- No lives system in v0.5.3.
- Hazards reduce health.
- Daniel gains brief invincibility after damage.
- At zero health, show Try Again instead of instantly restarting.

## First Level

The first level is a summer Soldotna, Alaska-inspired street scene. The background is visual only. Collision uses the invisible ground line; the game no longer draws a gray sidewalk or ground layer over the background art.

## Hazards And Characters

- Bears: large stick-clearable wildlife obstacles.
- Moose: heavier, more dangerous stick-clearable wildlife obstacles.
- Salmon: fly/jump across the screen and can be knocked away.
- Major salmon run: a short chaotic sequence before the boss.
- Mom: appears with an interruption bubble such as `Daniel, clean your room!`.
- Sister: appears with a playful warning bubble such as `Daniel, heads up!`.
- Dad: enters after salmon run and attacks with dad-joke hazards.

## Dad Boss

Dad has a small health bar above his character. Dad joke attacks are actual hazards and can be destroyed with stick swings. Combo hits do more damage.

## Asset List

```text
assets/hockey-smash/backgrounds/soldotna_cityscape_background_01_1920x1080.png
assets/hockey-smash/backgrounds/soldotna_cityscape_background_02_1920x1080.png
assets/hockey-smash/backgrounds/soldotna_cityscape_background_03_1920x1080.png
assets/hockey-smash/backgrounds/soldotna_cityscape_background_04_1920x1080.png
assets/hockey-smash/backgrounds/soldotna_cityscape_background_05_1920x1080.png
assets/hockey-smash/sprites/hockey-player.png
assets/hockey-smash/sprites/splash.png
assets/hockey-smash/sprites/salmon.png
assets/hockey-smash/sprites/bear.png
assets/hockey-smash/sprites/moose.png
assets/hockey-smash/sprites/dad.png
assets/hockey-smash/sprites/mom.png
assets/hockey-smash/sprites/mom_text.png
assets/hockey-smash/sprites/sister.png
assets/hockey-smash/sprites/sister_text.png
```

## Prototype Scope

v0.5.3 is a playable prototype, not a finished content-complete game. It should prove launch flow, canvas layout, sidewalk-aligned player visibility, left/right movement, jump, slide, stick attack, debug/computer mode, health, no-scroll controls, placeholders, stick-clearable obstacles, family interruptions, salmon run, and Dad boss.

## Future Upgrades

- Real sprite sheets and animation states.
- Tuned enemy waves.
- Better hit sparks and sound.
- Longer level/camera.
- More Daniel moves.
- Better Dad boss joke variety.
