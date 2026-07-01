/*
 * Hockey Smash Renderer v2 scaffold.
 *
 * This file is intentionally not loaded by index.html.
 * It renders a Hockey Smash v2 world object onto a canvas context when a future
 * dev harness or migration step explicitly calls it.
 *
 * Current-game safety rules:
 * - Do not start a requestAnimationFrame loop here.
 * - Do not query or mutate current game state.
 * - Do not append DOM nodes.
 * - Do not register input listeners.
 * - Do not load this from index.html yet.
 */
(function () {
  const DEFAULT_BACKGROUND = 'assets/hockey-smash/backgrounds/soldotna_cityscape_background_01_1280x720.webp?v=20260630.84';

  function createImageCache(spriteMap = {}) {
    const cache = new Map();
    Object.entries(spriteMap).forEach(([key, src]) => {
      if (!src) return;
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
      cache.set(key, image);
    });
    return cache;
  }

  function renderWorld(ctx, world, imageCache = new Map(), options = {}) {
    if (!ctx || !world) return;
    const width = Number(world.designWidth || options.designWidth || 1024);
    const height = Number(world.designHeight || options.designHeight || 576);

    ctx.clearRect(0, 0, width, height);
    renderBackground(ctx, imageCache, width, height, options);
    renderEntities(ctx, world, imageCache);
    renderPlayer(ctx, world, imageCache);
    renderEffects(ctx, world);
    renderWorldDebug(ctx, world, options);
  }

  function renderBackground(ctx, imageCache, width, height, options) {
    const backgroundKey = options.backgroundKey || 'background';
    let image = imageCache.get(backgroundKey);
    if (!image && options.backgroundSrc) {
      image = new Image();
      image.decoding = 'async';
      image.src = options.backgroundSrc;
      imageCache.set(backgroundKey, image);
    }
    if (!image && DEFAULT_BACKGROUND) {
      image = new Image();
      image.decoding = 'async';
      image.src = DEFAULT_BACKGROUND;
      imageCache.set(backgroundKey, image);
    }

    if (image?.complete && image.naturalWidth) {
      drawCoverImage(ctx, image, 0, 0, width, height);
      return;
    }

    ctx.fillStyle = '#7ec9f2';
    ctx.fillRect(0, 0, width, height);
  }

  function renderPlayer(ctx, world, imageCache) {
    const player = world.player;
    if (!player) return;
    const spriteKey = getPlayerSpriteKey(player);
    drawSpriteOrPlaceholder(ctx, imageCache, spriteKey, player, player.name || player.character || 'PLAYER');
  }

  function renderEntities(ctx, world, imageCache) {
    (world.entities || []).forEach((entity) => {
      if (!entity || entity.dead) return;
      drawSpriteOrPlaceholder(ctx, imageCache, entity.sprite || entity.type, entity, entity.type || 'ENTITY');
      if (entity.bubble) renderBubble(ctx, entity, entity.bubble);
    });
  }

  function renderEffects(ctx, world) {
    (world.effects || []).forEach((effect) => {
      if (!effect || effect.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, effect.life / 0.8));
      ctx.fillStyle = '#fff27a';
      ctx.font = '800 20px system-ui, sans-serif';
      ctx.fillText(String(effect.text || ''), effect.x || 0, effect.y || 0);
      ctx.restore();
    });
  }

  function renderWorldDebug(ctx, world, options) {
    if (!options.debug) return;
    ctx.save();
    ctx.fillStyle = 'rgba(5, 8, 13, 0.72)';
    ctx.fillRect(12, 12, 360, 78);
    ctx.fillStyle = '#fff8df';
    ctx.font = '700 13px system-ui, sans-serif';
    ctx.fillText(`phase: ${world.phase}`, 24, 36);
    ctx.fillText(`salmon: ${world.salmonCaught || 0}/${world.salmonTarget || 0}`, 24, 56);
    ctx.fillText(`entities: ${(world.entities || []).length}`, 24, 76);
    ctx.restore();
  }

  function getPlayerSpriteKey(player) {
    if (player.slideActive) return `${player.character}Slide`;
    return player.sprite || player.character || 'daniel';
  }

  function drawSpriteOrPlaceholder(ctx, imageCache, spriteKey, box, label) {
    const image = imageCache.get(spriteKey);
    if (image?.complete && image.naturalWidth) {
      ctx.save();
      if (box.facing < 0) {
        ctx.translate((box.x || 0) + (box.width || 0), box.y || 0);
        ctx.scale(-1, 1);
        ctx.drawImage(image, 0, 0, box.width || 48, box.height || 48);
      } else {
        ctx.drawImage(image, box.x || 0, box.y || 0, box.width || 48, box.height || 48);
      }
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.fillStyle = 'rgba(255, 242, 122, 0.42)';
    ctx.strokeStyle = '#15202c';
    ctx.lineWidth = 3;
    ctx.fillRect(box.x || 0, box.y || 0, box.width || 48, box.height || 48);
    ctx.strokeRect(box.x || 0, box.y || 0, box.width || 48, box.height || 48);
    ctx.fillStyle = '#15202c';
    ctx.font = '800 12px system-ui, sans-serif';
    ctx.fillText(String(label || spriteKey || 'ITEM').toUpperCase(), (box.x || 0) + 6, (box.y || 0) + 20);
    ctx.restore();
  }

  function renderBubble(ctx, entity, text) {
    const x = (entity.x || 0) + (entity.width || 0) / 2 - 94;
    const y = Math.max(18, (entity.y || 0) - 54);
    ctx.save();
    ctx.fillStyle = 'rgba(255, 247, 214, 0.96)';
    ctx.strokeStyle = '#15202c';
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, 188, 44, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#15202c';
    ctx.font = '800 12px system-ui, sans-serif';
    wrapText(ctx, String(text), x + 10, y + 18, 168, 14);
    ctx.restore();
  }

  function drawCoverImage(ctx, image, x, y, width, height) {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const sw = width / scale;
    const sh = height / scale;
    const sx = (image.naturalWidth - sw) / 2;
    const sy = (image.naturalHeight - sh) / 2;
    ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    words.forEach((word, index) => {
      const test = `${line}${word} `;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line.trim(), x, y);
        line = `${word} `;
        y += lineHeight;
      } else {
        line = test;
      }
      if (index === words.length - 1) ctx.fillText(line.trim(), x, y);
    });
  }

  window.HOCKEY_SMASH_RENDERER_V2 = Object.freeze({
    createImageCache,
    renderWorld,
    renderBackground,
    renderPlayer,
    renderEntities,
    renderEffects,
    getPlayerSpriteKey,
  });
})();
