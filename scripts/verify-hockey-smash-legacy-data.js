const fs = require('fs');
const vm = require('vm');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/games/hockey-smash-data.js', 'utf8'), context);

const data = context.window.RTA_HOCKEY_SMASH_LEGACY_DATA;
const errors = [];

if (!data) errors.push('Missing RTA_HOCKEY_SMASH_LEGACY_DATA.');
if (data.version !== '0.8.0') errors.push(`Expected game data version 0.8.0, got ${data.version}.`);

Object.values(data.maps || {}).forEach((map) => {
  if (!map.id) errors.push('A map is missing an id.');
  if (!Array.isArray(map.tiles) || !map.tiles.length) errors.push(`${map.id} has no tile rows.`);
  if (map.tiles.length !== map.height) errors.push(`${map.id} height mismatch.`);
  map.tiles.forEach((row, index) => {
    if (row.length !== map.width) errors.push(`${map.id} row ${index} width mismatch.`);
  });

  Object.entries(map.events || {}).forEach(([coord, event]) => {
    const [x, y] = coord.split(',').map(Number);
    if (!Number.isFinite(x) || !Number.isFinite(y)) errors.push(`${map.id}:${coord} has an invalid coordinate.`);
    if (x < 0 || y < 0 || x >= map.width || y >= map.height) errors.push(`${map.id}:${coord} is out of bounds.`);
    if (event.itemId && !data.items[event.itemId]) errors.push(`${map.id}:${coord} missing item ${event.itemId}.`);
    if (event.monsterId && !data.monsters[event.monsterId]) errors.push(`${map.id}:${coord} missing monster ${event.monsterId}.`);
    if (event.mapId && !data.maps[event.mapId]) errors.push(`${map.id}:${coord} missing target map ${event.mapId}.`);
  });
});

['map-kiosk-dungeon', 'forgotten-underpass', 'never-finished-mansion', 'hidden-conservatory', 'soldotna-wayside'].forEach((id) => {
  if (!data.maps?.[id]) errors.push(`Missing required map ${id}.`);
});

['rusty-road-key', 'apple-juice-potion', 'mapstone', 'moon-toll-token', 'star-map-fragment', 'glass-rose'].forEach((id) => {
  if (!data.items?.[id]) errors.push(`Missing required item ${id}.`);
});

['signpost-ogre-1', 'moonlit-warden-1', 'blueprint-warden-1'].forEach((id) => {
  if (!data.monsters?.[id]) errors.push(`Missing required monster ${id}.`);
});

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Hockey Smash data validation passed for ${data.version}.`);
