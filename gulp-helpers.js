const fs = require('fs');
const prompts = require('prompts');

const gulp = require('gulp');
const clean = require('gulp-clean');

const cleanDir = (dir) => gulp.src(`${dir}/*`).pipe(clean({ force: true }));;

const componentsExist = (paths) => {
  return paths.filter((path) => {
    return fs.existsSync(path);
  }).length > 0;
};

const symlinksExist = (paths) => {
  return paths.filter((path) => {
    const stats = fs.lstatSync(path);

    return stats.isSymbolicLink();
  }).length > 0;
}

const checkForComponents = async () => {
  const sources = [
    `${process.env.THEME_DIRECTORY}/templates/components`,
    `${process.env.THEME_DIRECTORY}/less/components`,
    `${process.env.THEME_DIRECTORY}/js/components`
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
    `${process.env.THEME_DIRECTORY}/templates/components`,
    `${process.env.THEME_DIRECTORY}/less/components`,
    `${process.env.THEME_DIRECTORY}/js/components`
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

module.exports = {
  cleanDir,
  checkForComponents,
  checkForSymlinks
}
