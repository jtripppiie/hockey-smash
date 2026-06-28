(function () {
  window.RTA_ROADSIDE_REALM_ART = {
    version: '0.2.6',
    sprites: {
      'rusty-road-key': { icon: 'key', label: 'Rusty Road Key', kind: 'quest' },
      'apple-juice-potion': { icon: 'juice', label: 'Apple Juice Potion', kind: 'consumable' },
      mapstone: { icon: 'mapstone', label: 'Mapstone', kind: 'quest' },
      'moon-toll-token': { icon: 'moon-token', label: 'Moon Toll Token', kind: 'quest' },
      'blueprint-key': { icon: 'blueprint-key', label: 'Blueprint Key', kind: 'quest' },
      'star-map-fragment': { icon: 'star-map', label: 'Star Map Fragment', kind: 'quest' },
      'glass-rose': { icon: 'glass-rose', label: 'Glass Rose', kind: 'collectible' },
    },
    monsterSprites: {
      'dust-goblin': { icon: 'dust-goblin', label: 'Dust Goblin', frames: 2 },
      'map-bat': { icon: 'map-bat', label: 'Map Bat', frames: 2 },
      'toll-troll': { icon: 'toll-troll', label: 'Toll Troll', frames: 2 },
      'signpost-ogre': { icon: 'signpost-ogre', label: 'Signpost Ogre', frames: 6 },
      'moonlit-warden': { icon: 'moonlit-warden', label: 'Moonlit Warden', frames: 6 },
      'blueprint-warden': { icon: 'blueprint-warden', label: 'Blueprint Warden', frames: 2 },
    },
    layers: [
      'ceiling',
      'floor',
      'far-walls',
      'side-walls',
      'front-wall',
      'door-or-stairs',
      'monster',
      'item',
      'vignette',
      'compass',
      'hud',
    ],
  };
})();
