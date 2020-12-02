const fs = require('fs');
const prompts = require('prompts');
const path = require('path');

const gulp = require('gulp');
const clean = require('gulp-clean');

const themeDirectoryPath = path.resolve(process.env.THEME_DIRECTORY);

const cleanDir = (dir) => gulp.src(`${dir}/*`).pipe(clean({ force: true }));;

const componentsExist = (paths) => {
  return paths.filter((path) => {
    return fs.existsSync(path);
  }).length > 0;
};

const symlinksExist = (paths) => {
  return paths.filter((path) => {
    try {
      return fs.lstatSync(path).isSymbolicLink();
    } catch (err) {
      return false;
    }
  }).length > 0;
}

const checkForComponents = async () => {
  const sources = [
    `${themeDirectoryPath}/templates/components`,
    `${themeDirectoryPath}/less/components`,
    `${themeDirectoryPath}/js/components`
  ];

  if (componentsExist(sources) && !symlinksExist(sources)) {
    const response = await prompts({
      type: 'confirm',
      name: 'remove',
      message: 'The working theme has pre-existing components. Would you like to remove the components and link instead?',
      initial: false
    })

    return response.remove;
  }

  return false;
};

const checkForSymlinks = async () => {
  const sources = [
    `${themeDirectoryPath}/templates/components`,
    `${themeDirectoryPath}/less/components`,
    `${themeDirectoryPath}/js/components`
  ];

  if (componentsExist(sources) && symlinksExist(sources)) {
    const response = await prompts({
      type: 'confirm',
      name: 'unlink',
      message: 'The working theme has pre-existing linked components. Would you like to unlink the components?',
      initial: false
    })

    return response.unlink;
  }

  return false;
};

const importScripts = async (files) => {
  try {
    const cleanPaths = files.map((file) => file.replace('./source/', ''));

    const phpString = `<?php\n${cleanPaths.map((path) => {
      return `$config['js'][] = '${path}'`
    }).join(';\n')};`;

    return fs.writeFile(`${themeDirectoryPath}/components.config.php`,
      phpString, (err) => {
        if (err) {
          throw err;
        }

        return;
      })
  } catch (error) {
    return error;
  }
};

const importLess = (files) => {
  try {
    const cleanPaths = files.map((file) => file.replace('./source/', ''));

    const lessString = `${cleanPaths.map((path) => {
      return `@import "${path}"`
    }).join(';\n')};`

    return fs.writeFile(`${themeDirectoryPath}/less/components.less`, lessString, (err) => {
      if (err) {
        throw err;
      }

      return;
    })
  } catch (error) {
    return error;
  }
};

module.exports = {
  cleanDir,
  checkForComponents,
  checkForSymlinks,
  importScripts,
  importLess
}
