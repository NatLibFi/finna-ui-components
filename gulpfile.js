require('dotenv').config();
const config = require('./patternlab-config.json');
const helpers = require('./gulp-helpers');

const gulp = require('gulp');
const browserSync = require('browser-sync');
const fs = require('fs');
const exec = require('child_process').exec;
const glob = require('glob');
const path = require('path');
const through = require('through2').obj;
const { argv } = require('yargs');

const pipeExec = require('gulp-exec');
const less = require('gulp-less');
const lessGlob = require('less-plugin-glob');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const replace = require('gulp-replace');

const themesRootPath = path.resolve(process.env.THEMES_ROOT);
const themeDirectoryPath = path.resolve(process.env.THEME_DIRECTORY);
const componentsSourcePath = path.resolve(config.paths.source.patterns);

// Tasks
const cleanPublic = () => helpers.cleanDir(config.paths.public.root);
gulp.task(cleanPublic);

const patternLab = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(pipeExec('patternlab build --config ./patternlab-config.json'))
    .pipe(browserSync.stream());

};
gulp.task(patternLab);

const fonts = () => {
  const bootstrapFonts = `${themesRootPath}/bootstrap3/css/fonts`;
  const finnaFonts = `${themeDirectoryPath}/css/fonts`;

  const dest = config.paths.public.fonts;

  return gulp
    .src([`${bootstrapFonts}/*`, `${finnaFonts}/*`])
    .pipe(gulp.dest(dest));
};
gulp.task(fonts);

const styles = () => {
  const source = config.paths.source.styles;
  const dest = config.paths.public.styles;

  return gulp
    .src(`${source}/*.less`)
    .pipe(sourcemaps.init())
    .pipe(less({
      modifyVars: {
        '@themePath': themesRootPath
      },
      plugins: [lessGlob]
    }))
    .pipe(autoprefixer())
    .pipe(replace('../../../themes/finna2/css/fonts', '../fonts'))
    .pipe(minify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
};
gulp.task(styles);

const themeScriptImports = async () => {
  try {
    const source = `${config.paths.source.root}/components/**/*.js`

    glob(source, async (err, files) => {
      if (err) {
        throw err;
      }

      await helpers.importScripts(files);
    });


  } catch (error) {
    throw error;
  }
};
gulp.task(themeScriptImports);

const scripts = () => {
  const source = config.paths.source.root;
  const dest = config.paths.public.js;

  return gulp
    .src([
      `${source}/js/finna.js`,
      `!${source}/js/vendor/*.js`,
      `${source}/components/**/*.js`,
      `${source}/js/patternlab/*.js`,
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dest))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
};
gulp.task(scripts);

const vendorScripts = () => {
  const vendor = `${config.paths.source.js}/vendor`;
  const dest = `${config.paths.public.js}/vendor`;

  return gulp
    .src(`${vendor}/*.js`)
    .pipe(gulp.dest(dest))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
};
gulp.task(vendorScripts);

const watchTask = () => {
  browserSync.init({
    server: {
      baseDir: config.paths.public.root
    },
    ghostMode: true,
    open: 'external',
    snippetOptions: {
      blacklist: ['/index.html', '/']
    }
  });

  gulp.watch([
    `${config.paths.source.styles}/**/*.less`,
    `${config.paths.source.patterns}**/*.less`
  ], styles);

  gulp.watch([
    `${config.paths.source.js}/**/*.js`,
    `${config.paths.source.patterns}**/*.js`
  ], scripts);

  gulp.watch([
    `${config.paths.source.patterns}**/*.phtml`,
    `${config.paths.source.patterns}**/*.json`,
    `${config.paths.source.patterns}**/*.md`
  ], patternLab);
};
gulp.task(watchTask);

const themeLessImports = async () => {
  try {
    const source = `${config.paths.source.root}/components/**/*.less`

    glob(source, async (err, files) => {
      if (err) {
        throw err;
      }

      await helpers.importLess(files);
    })
  } catch (error) {
    throw error;
  }
};
gulp.task(themeLessImports);

const unlinkPatterns = () => new Promise((resolve, reject) => {
  exec(`rm -rf ${themeDirectoryPath}/templates/components`, (err) => {
    if (err) {
      reject(err);
    }

    resolve();
  });
});

const unlinkStyles = () => new Promise((resolve, reject) => {
  exec(`rm -rf ${themeDirectoryPath}/less/components`, (err) => {
    if (err) {
      reject(err);
    }

    resolve();
  });
});

const unlinkScripts = () => new Promise((resolve, reject) => {
  exec(`rm -rf ${themeDirectoryPath}/js/components`, (err) => {
    if (err) {
      reject(err);
    }

    resolve();
  });
});

const unlinkTheme = gulp.series(unlinkPatterns, unlinkStyles, unlinkScripts);

const symLinkPatterns = () => {
  const sourceRelPath = path.relative(`${themeDirectoryPath}/templates`, componentsSourcePath);

  return exec(`cd ${themeDirectoryPath}/templates && ln -fs ${sourceRelPath}`, (err) => {
    if (err) {
      throw err;
    }
  });
};
gulp.task(symLinkPatterns);

const symLinkStyles = () => {
  const sourceRelPath = path.relative(`${themeDirectoryPath}/less`, componentsSourcePath);

  return exec(`cd ${themeDirectoryPath}/less && ln -fs ${sourceRelPath}`, (err) => {
    if (err) {
      throw err;
    }
  });
};
gulp.task(symLinkStyles);

const symLinkScripts = () => {
  const sourceRelPath = path.relative(`${themeDirectoryPath}/js`, componentsSourcePath);

  return exec(`cd ${themeDirectoryPath}/js && ln -fs ${sourceRelPath}`, (err) => {
    if (err) {
      throw err;
    }
  });
};
gulp.task(symLinkScripts);

const preSymlinkTheme = async () => {
  const shouldRemove = await helpers.checkForComponents();

  if (shouldRemove) {
    await Promise.all([unlinkPatterns(), unlinkStyles(), unlinkScripts()]);
  }

  Promise.resolve();
};
gulp.task(preSymlinkTheme);

const symLinkTheme = gulp.series(
  preSymlinkTheme,
  symLinkPatterns,
  symLinkStyles,
  symLinkScripts,
  themeLessImports,
  themeScriptImports
);

const copyPatterns = () => {
  const source = config.paths.source.patterns;
  let state = 'complete';

  if (argv.state && helpers.patternStates.includes(argv.state)) {
    state = argv.state;
  }

  return gulp
    .src(`${source}**/*.phtml`)
    .pipe(through((file, _, callback) => {
      return helpers.filterPatternByState(file, state, callback)
    }))
    .pipe(gulp.dest(`${themeDirectoryPath}/templates/components`));
};
gulp.task(copyPatterns);

const copyStyles = () => {
  const source = config.paths.source.patterns;
  let state = 'complete';

  if (argv.state && helpers.patternStates.includes(argv.state)) {
    state = argv.state;
  }

  return gulp
    .src(`${source}**/*.less`)
    .pipe(through((file, _, callback) => {
      return helpers.filterPatternByState(file, state, callback)
    }))
    .pipe(gulp.dest(`${themeDirectoryPath}/less/components`))
    .pipe(through((file, _, callback) => {
      const importPath = path.relative(`${themeDirectoryPath}/less`, file.path)
      const importString = `@import "${importPath}";\n`

      fs.appendFile(`${themeDirectoryPath}/less/components.less`, importString, (err) => {
        if (err) {
          callback(err);
        }

        callback(null);
      });
    }));
};
gulp.task(copyStyles);

const copyScripts = () => {
  const source = config.paths.source.patterns;
  let state = 'complete';

  if (argv.state && helpers.patternStates.includes(argv.state)) {
    state = argv.state;
  }

  return gulp
    .src(`${source}**/*.js`)
    .pipe(through((file, _, callback) => {
      return helpers.filterPatternByState(file, state, callback)
    }))
    .pipe(gulp.dest(`${themeDirectoryPath}/js/components`))
    .pipe(through((file, _, callback) => {
      const importPath = path.relative(`${themeDirectoryPath}/js`, file.path);
      const importString = `$config['js'][] = '${importPath}';\n`

      fs.appendFile(`${themeDirectoryPath}/components.config.php`, importString, (err) => {
        if (err) {
          callback(err);
        }

        callback(null);
      });
    }));
};
gulp.task(copyScripts);

const preCopyTheme = async () => {
  const shouldUnlink = await helpers.checkForSymlinks();

  if (shouldUnlink) {
    await Promise.all([unlinkPatterns(), unlinkStyles(), unlinkScripts()]);
  }

  // Clear Less imports
  fs.writeFile(`${themeDirectoryPath}/less/components.less`, '', (err) => {
    if (err) {
      throw err;
    }

    return;
  });

  // Clear JS imports
  fs.writeFile(`${themeDirectoryPath}/components.config.php`, '<?php\n', (err) => {
    if (err) {
      throw err;
    }

    return;
  });

  Promise.resolve();
};
gulp.task(preCopyTheme);

const copyTheme = gulp.series(
  preCopyTheme,
  copyPatterns,
  copyStyles,
  copyScripts
);

const defaultTask = gulp.series(
  cleanPublic,
  gulp.parallel(patternLab, fonts, styles, scripts, vendorScripts)
);

const watch = gulp.series(defaultTask, watchTask);

// Descriptions
cleanPublic.description = "Clear all files under public directory";

patternLab.description = "Build PatternLab to public directory";

fonts.description = "Copy font files from theme directory";

styles.description = "Build styles and sourcemaps.";

scripts.description = "Build and uglify Javascript into main.js";

vendorScripts.description = "Build and uglify vendor Javascript";

watchTask.description = "Initialize BrowserSync instance and watch for changes";

themeLessImports.description = "Inject component Less imports to dedicated files";

themeScriptImports.description = "Inject component JS imports to working theme config";

preSymlinkTheme.description = "Check if existing components in working theme should be removed";

symLinkPatterns.description = "Create patterns symbolic link";

symLinkStyles.description = "Create styles symbolic link";

symLinkScripts.description = "Create scripts symbolic link";

preCopyTheme.description = "Check for existing symlinks, clear component imports.";

copyPatterns.description = "Create patterns copy";

copyStyles.description = "Create styles copy";

copyScripts.description = "Create Javascript scripts copy";

defaultTask.description = "Clear public directory and build patterns, CSS and Javascript from the source directory";

watch.description = 'Build PatternLab from source files and watch for changes.';

symLinkTheme.description = "Create symbolic links to working theme";

unlinkTheme.description = "Unlink/remove components from working theme";

copyTheme.description = "Copy components to working theme";
copyTheme.flags = {
  '--state': 'Copy components with given state. Defaults to complete'
}

// Exports
exports.default = defaultTask;
exports.watch = watch;
exports.symLinkTheme = symLinkTheme;
exports.copyTheme = copyTheme;
exports.unlinkTheme = unlinkTheme;
