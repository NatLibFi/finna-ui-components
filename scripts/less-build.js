// Compiles Less files.

const fs = require('fs-extra');
const less = require('less');
const path = require('path');

function renderLess(source, destination) {
  let options = {
    filename: path.resolve(source),
    paths: [
      path.resolve(__dirname, '../source'),
      path.resolve(__dirname, '../../NDL-VuFind2/themes/finna2/less')
    ],
    sourceMap: {}
  };
  less.render(
    fs.readFileSync(source).toString(),
    options,
    function callback(error, output) {
      let sourceMappingUrl = '/*# sourceMappingURL=' + path.basename(destination) + '.map' + ' */';
      fs.writeFileSync(destination, output.css + "\n" + sourceMappingUrl);
      if (output.map) {
        fs.writeFileSync(destination + '.map', output.map);
      }
    }
  );
}

fs.ensureDirSync('public/css/styleguide');

renderLess('source/less/theme.less', 'public/css/styleguide/theme.css');
renderLess('source/less/styleguide.less', 'public/css/styleguide/styleguide.css');
renderLess('source/less/components.less', 'public/css/components.css');
