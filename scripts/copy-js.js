// Copies component JavaScript files.

const config = require('../scripts-config.json');
const fs = require('fs-extra');

if (!config.copyJs) {
  console.log(`copyJs key missing from scripts-config.json`);
  return;
}
config.copyJs.forEach((file) => fs.copySync(...file));
