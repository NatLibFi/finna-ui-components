// Copies assets from dependencies.

const fs = require('fs-extra');
const config = require('../compile-config.json');

if (!config.assets) {
  console.log(`Compile-config missing assets`);
}
for (const[key, value] of Object.entries(config.assets)) {
    value.forEach((file) => fs.copySync(...file));
}

