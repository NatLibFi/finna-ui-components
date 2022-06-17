// Copies assets from dependencies.

const config = require('../scripts-config.json');
const fs = require('fs-extra');

if (!config.copyAssets) {
  console.log(`copyAssets key missing from scripts-config.json`);
  return;
}
for (const [_key, value] of Object.entries(config.copyAssets)) {
  value.forEach((file) => fs.copySync(...file));
}
