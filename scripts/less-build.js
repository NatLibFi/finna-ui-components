// Compiles Less files.

const fs = require('fs-extra');
const less = require('less');
const path = require('path');
const config = require('../compile-config.json');

if (!config.lessBuild) {
  console.log(`Compile-config missing lessBuild`);
  return;
}
function renderLess(source, destination) {
  const options = {
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
    (error, output) => {
      const mapUrl = `/*# sourceMappingURL=${path.basename(destination)}.map */`;
      fs.writeFileSync(destination, `${output.css}\n${mapUrl}`);
      if (output.map) {
        fs.writeFileSync(`${destination}.map`, output.map);
      }
    }
  );
}

fs.ensureDirSync('public/css/styleguide');
config.lessBuild.forEach((file) => renderLess(...file));
