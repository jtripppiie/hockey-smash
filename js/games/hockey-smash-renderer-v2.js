/*
 * Hockey Smash Renderer v2.
 *
 * Renders a Hockey Smash v2 world object onto a canvas context. The renderer
 * owns drawing only: no DOM, no input listeners, and no animation loop.
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
    renderBackground(ctx, world, imageCache, width, height, options);
    renderEntities(ctx, world, imageCache);
    renderPlayer(ctx, world, imageCache);
    renderEffects(ctx, world);
    renderWorldDebug(ctx, world, options);
  }

  function renderBackground(ctx, world, imageCache, width, height, options) {
    if (options.parallaxLayers?.length) {
      renderParallaxBackground(ctx, world, imageCache, width, height, options);
      return;
    }

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

  function renderParallaxBackground(ctx, world, imageCache, width, height, options) {
    const environment = world.environment || {};
    const nightAmount = getNightAmount(environment);
    renderSkyGradient(ctx, width, height, nightAmount);
    renderStars(ctx, width, height, nightAmount);
    renderSunMoon(ctx, imageCache, width, height, environment, nightAmount, options);

    options.parallaxLayers.forEach((layer) => {
      renderParallaxLayer(ctx, imageCache, layer, width, height, environment);
    });

    renderNightFilter(ctx, width, height, nightAmount);
  }

  function renderSkyGradient(ctx, width, height, nightAmount) {
    const dayTop = [100, 180, 226];
    const dayBottom = [202, 235, 245];
    const nightTop = [9, 18, 42];
    const nightBottom = [33, 46, 77];
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, rgb(mixColor(dayTop, nightTop, nightAmount)));
    gradient.addColorStop(0.58, rgb(mixColor(dayBottom, nightBottom, nightAmount)));
    gradient.addColorStop(1, rgb(mixColor([107, 133, 91], [34, 57, 61], nightAmount)));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function renderStars(ctx, width, height, nightAmount) {
    if (nightAmount <= 0.08) return;
    ctx.save();
    ctx.globalAlpha = Math.min(0.72, (nightAmount - 0.08) * 0.95);
    ctx.fillStyle = '#fff8df';
    for (let i = 0; i < 42; i += 1) {
      const x = (i * 97) % width;
      const y = 22 + ((i * 53) % Math.floor(height * 0.42));
      const radius = i % 5 === 0 ? 1.8 : 1.1;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function renderSunMoon(ctx, imageCache, width, height, environment, nightAmount, options) {
    const progress = getCycleProgress(environment);
    const sun = getCachedImage(imageCache, 'sun', options.sunSrc);
    const moon = getCachedImage(imageCache, 'moon', options.moonSrc);
    const sunX = width * (0.12 + 0.76 * progress);
    const sunY = height * (0.28 - Math.sin(progress * Math.PI) * 0.18);
    const moonProgress = (progress + 0.5) % 1;
    const moonX = width * (0.12 + 0.76 * moonProgress);
    const moonY = height * (0.28 - Math.sin(moonProgress * Math.PI) * 0.18);

    drawOrb(ctx, sun, sunX, sunY, 86, 1 - nightAmount, '#ffd75a');
    drawOrb(ctx, moon, moonX, moonY, 74, nightAmount, '#f2f0dc');
  }

  function renderParallaxLayer(ctx, imageCache, layer, width, height, environment) {
    const image = getCachedImage(imageCache, layer.key, layer.src);
    const layerWidth = Number(layer.width || width);
    const layerHeight = Number(layer.height || height);
    const y = Number(layer.y || 0);
    const speed = Number(layer.speed || 0);
    const offset = positiveModulo((environment.scrollX || 0) * speed, layerWidth);

    if (image?.complete && image.naturalWidth) {
      for (let x = -offset - layerWidth; x < width + layerWidth; x += layerWidth) {
        ctx.drawImage(image, x, y, layerWidth, layerHeight);
      }
      return;
    }

    ctx.save();
    ctx.fillStyle = layer.fallback || 'rgba(255, 242, 122, 0.22)';
    for (let x = -offset - layerWidth; x < width + layerWidth; x += layerWidth) {
      ctx.fillRect(x, y, layerWidth, layerHeight);
    }
    ctx.restore();
  }

  function renderNightFilter(ctx, width, height, nightAmount) {
    if (nightAmount <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = 0.48 * nightAmount;
    ctx.fillStyle = '#07142d';
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 0.18 * nightAmount;
    ctx.fillStyle = '#6fb7ff';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
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
      if (entity.type === 'salmonMarker') {
        renderSalmonMarker(ctx, entity);
        return;
      }
      drawSpriteOrPlaceholder(ctx, imageCache, entity.sprite || entity.type, entity, entity.type || 'ENTITY');
      if (entity.bubble) renderBubble(ctx, entity, entity.bubble);
    });
  }

  function renderSalmonMarker(ctx, entity) {
    const x = entity.x || 0;
    const y = entity.y || 0;
    const width = entity.width || 74;
    const height = entity.height || 10;
    const life = entity.ttl ? 1 - ((entity.age || 0) / entity.ttl) : 1;
    const alpha = Math.max(0.28, Math.min(0.85, life + 0.15));

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(255, 242, 122, 0.24)';
    ctx.strokeStyle = '#fff27a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(21, 32, 44, 0.82)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + width * 0.32, y + height / 2);
    ctx.lineTo(x + width * 0.68, y + height / 2);
    ctx.moveTo(x + width / 2, y + height * 0.12);
    ctx.lineTo(x + width / 2, y + height * 0.88);
    ctx.stroke();
    ctx.restore();
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

  function getCachedImage(imageCache, key, src) {
    if (!key || !src) return imageCache.get(key);
    let image = imageCache.get(key);
    if (!image) {
      image = new Image();
      image.decoding = 'async';
      image.src = src;
      imageCache.set(key, image);
    }
    return image;
  }

  function getCycleProgress(environment) {
    const cycleSeconds = Math.max(1, environment.cycleSeconds || 96);
    return positiveModulo(environment.clock || 0, cycleSeconds) / cycleSeconds;
  }

  function getNightAmount(environment) {
    if (typeof environment.nightAmount === 'number') return Math.max(0, Math.min(1, environment.nightAmount));
    const progress = getCycleProgress(environment);
    return Math.max(0, Math.min(1, (Math.cos(progress * Math.PI * 2) + 1) / 2));
  }

  function drawOrb(ctx, image, x, y, size, alpha, fallbackColor) {
    if (alpha <= 0.02) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    if (image?.complete && image.naturalWidth) {
      ctx.drawImage(image, x - size / 2, y - size / 2, size, size);
    } else {
      ctx.fillStyle = fallbackColor;
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function positiveModulo(value, modulo) {
    if (!modulo) return 0;
    return ((value % modulo) + modulo) % modulo;
  }

  function mixColor(a, b, amount) {
    return a.map((value, index) => Math.round(value + (b[index] - value) * amount));
  }

  function rgb(parts) {
    return `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`;
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
    renderParallaxBackground,
    renderPlayer,
    renderEntities,
    renderEffects,
    getPlayerSpriteKey,
  });
})();
