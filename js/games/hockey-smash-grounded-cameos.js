(function () {
  const DISPLAY_VERSION = 'Hockey Smash v0.14.6 Grounded Cameos';
  const DESIGN_WIDTH = 1024;
  const DESIGN_HEIGHT = 576;
  const GROUND_Y = DESIGN_HEIGHT * 0.82;
  const CAMEO_WORLD_X = 720;
  const CAMEO_WIDTH = 84;
  const CAMEO_HEIGHT = 96;

  function canvasRect() {
    return document.getElementById('hockey-canvas')?.getBoundingClientRect?.() || null;
  }

  function syncBuildBadge() {
    const text = 'Hockey Smash v0.14.6 · Build 2026-06-30.62';
    const badge = document.getElementById('hockey-build-badge');
    if (badge && badge.textContent !== text) badge.textContent = text;
    const api = window.RTA_HOCKEY_SMASH;
    if (api?.getVersion) api.getVersion = () => 'Hockey Smash v0.14.6';
  }

  function groundedPositionFor(node) {
    const rect = canvasRect();
    if (!rect?.width || !rect?.height || !node) return null;
    const scaleX = rect.width / DESIGN_WIDTH;
    const scaleY = rect.height / DESIGN_HEIGHT;
    const width = Math.max(62, CAMEO_WIDTH * scaleX);
    const height = Math.max(72, CAMEO_HEIGHT * scaleY);
    return {
      left: rect.left + CAMEO_WORLD_X * scaleX,
      top: rect.top + (GROUND_Y - CAMEO_HEIGHT) * scaleY,
      width,
      height,
    };
  }

  function groundAlaskaCameo() {
    document.querySelectorAll('.hockey-sideline-cameo').forEach((node) => {
      const pos = groundedPositionFor(node);
      if (!pos) return;

      // The release layer creates the Alaska boy/girl as a sideline cameo.
      // Keep that behavior, but place it on the same ground baseline as Mom and the player.
      Object.assign(node.style, {
        position: 'fixed',
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        right: 'auto',
        bottom: 'auto',
        width: `${pos.width}px`,
        height: `${pos.height}px`,
        zIndex: '32',
        transform: 'translateY(0)',
        pointerEvents: 'none',
      });

      const sprite = node.querySelector('img');
      if (sprite) {
        Object.assign(sprite.style, {
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        });
      }

      const label = node.querySelector('span');
      if (label) label.textContent = "Hey, you're cute";
    });
  }

  function loop() {
    syncBuildBadge();
    groundAlaskaCameo();
    window.requestAnimationFrame(loop);
  }

  window.requestAnimationFrame(loop);
})();
