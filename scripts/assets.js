// Copies assets from dependencies.

const fs = require('fs-extra');
const config = require('../compile-config.json');

if (config.assets) {
  config.assets.forEach((format) => {
    format.forEach((file) => fs.copySync(...file));
  });
}
