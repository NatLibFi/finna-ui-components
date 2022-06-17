
// Concatenates and minifies JavaScript files.
/* jshint ignore:start */
// Ignore jshint as this does run in es8 (ES6 is only in the component library).
const fs = require('fs-extra');
const { minify } = require('terser');
const path = require('path');
const config = require('../scripts-config.json');

if (!config.minifyJs) {
  console.log(`minifyJs key missing from scripts-config.json`);
  return;
}

async function minifyJs(sources) {
  let files = {};
  sources.forEach((source) => files[source] = fs.readFileSync(source).toString());
  const options = {
    compress: false,
    mangle: false,
    format: false,
    sourceMap: {
      filename: path.basename(destination),
      url: `${path.basename(destination)}.map`
    }
  };
  const result = await minify(files, options);
  fs.writeFileSync(destination, result.code);
  fs.writeFileSync(`${destination}.map`, result.map);
}

minifyJs(
  ...config.minifyJs,
  'dist/js/components.min.js'
);
/* jshint ignore:end */