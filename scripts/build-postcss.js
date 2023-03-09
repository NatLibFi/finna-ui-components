const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');

function processPcss(name) {
  const pcssFile = 'source/pcss/' + name + '.pcss';
  const cssFile = 'public/css/' + name + '.css';
  console.log('Processing ' + pcssFile + '...');
  fs.readFile(pcssFile, (err, css) => {
    postcss([
      postcssImport,
      postcssPresetEnv({
        stage: 3,
        preserve: false,
        features: {
          'custom-media-queries': true,
          'nesting-rules': true
        }
      })
    ])
      .process(
        css,
        {
          from: pcssFile,
          to: cssFile,
          map: {
            inline: false
          }
        }
      )
      .then(result => {
        fs.writeFile(cssFile, result.css, () => true);
        if (result.map) {
          fs.writeFile(cssFile + '.map', result.map.toString(), () => true);
        }
      });
  });
}

fs.ensureDirSync('public/css');
if (process.argv[2]) {
} else {
}
processPcss('admin-overrides');
processPcss('component');
console.log('Done.');
