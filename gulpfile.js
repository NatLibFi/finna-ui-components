require('dotenv').config();
const config = require('./patternlab-config.json');
const helpers = require('./gulp-helpers');

const gulp = require('gulp');
const less = require('gulp-less');
const shell = require('gulp-shell');
const browserSync = require('browser-sync');
const fs = require('fs');
const chalk = require('chalk');

const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const inject = require('gulp-inject');

// Tasks
const cleanPublic = () => helpers.cleanDir(config.paths.public.root);
gulp.task(cleanPublic);

const patternLab = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell(['patternlab build --config ./patternlab-config.json']))
    .pipe(browserSync.stream());
};
gulp.task(patternLab);

const styles = () => {
  const source = config.paths.source.styles;
  const dest = config.paths.public.styles;

  return gulp
    .src(`${source}/*.less`)
    .pipe(less({
      modifyVars: {
        '@themePath': `../../../${process.env.THEMES_ROOT}`
      }
    }))
    .pipe(autoprefixer())
    .pipe(minify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
};
gulp.task(styles);

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
      baseDir: config.paths.public.root,
      routes: {
        '/fonts': `${process.env.THEMES_ROOT}/bootstrap3/css/fonts`,
        '/themes/finna2/css/fonts': `${process.env.THEME_DIRECTORY}/css/fonts`
      }
    },
    ghostMode: true,
    open: 'external',
    snippetOptions: {
      blacklist: ['/index.html', '/']
    }
  });

  gulp.watch(`${config.paths.source.styles}/**/*.less`, styles);
  gulp.watch(`${config.paths.source.patterns}**/*.less`, styles);

  gulp.watch(`${config.paths.source.js}/**/*.js`, scripts);
  gulp.watch(`${config.paths.source.patterns}**/*.js`, scripts);

  gulp.watch(`${config.paths.source.patterns}**/*.phtml`, patternLab);
  gulp.watch(`${config.paths.source.patterns}**/*.json`, patternLab);
};
gulp.task(watchTask);

const validateImportTargetFile = (file) => {
  return fs.readFile(file, (error, data) => {
    if (error) {
      throw error;
    }

    if (data.indexOf('Component imports start here') == -1 && data.indexOf('Component imports end here') == -1) {
      const errorMessage = `Not able to import to target file: ${file}. Make sure that file has required starting comment /* Component imports start here */ and ending comment /* Component imports end here */`;

      console.log(chalk.red(errorMessage));

      throw Error(errorMessage);
    }
  });
};

const checkImportTargetFile = async (file) => new Promise((resolve, reject) => {
  return fs.access(file, (error) => {
    if (error) {
      console.log(chalk.yellow(`${file} does not exist. Trying to create.`));

      const componentsFileContent = '/* Component imports start here */ \r\n/* Component imports end here */';

      return fs.writeFile(file, componentsFileContent, (err) => {
        if (err) {
          reject(err);
        }

        console.log(chalk.green(`${file} created successfully. Proceeding..`));

        resolve(validateImportTargetFile(file));
      });
    } else {
      resolve(validateImportTargetFile(file));
    }
  });
});
;


const componentImports = async () => {
  const less = `${process.env.THEME_DIRECTORY}/less`;

  try {
    await checkImportTargetFile(`${less}/components.less`);

    return gulp.src(`${less}/components.less`)
      .pipe(inject(
        gulp.src(`${less}/components/**/*.less`, { read: false }),
        {
          starttag: '/* Component imports start here */',
          endtag: '/* Component imports end here */',
          ignorePath: `/${process.env.THEME_DIRECTORY}/less/`,
          addRootSlash: false,
          transform: (filepath) => `@import "${filepath}";`
        }))
      .pipe(gulp.dest(less));
  }
  catch (err) {
    throw err;
  }
};
gulp.task(componentImports);

const unlinkPatterns = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell([`rm -rf ${process.env.THEME_DIRECTORY}/templates/components`]))
};
gulp.task(unlinkPatterns);

const unlinkStyles = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell([`rm -rf ${process.env.THEME_DIRECTORY}/less/components`]))
};
gulp.task(unlinkStyles);

const unlinkScripts = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell([`rm -rf ${process.env.THEME_DIRECTORY}/js/components`]))
};
gulp.task(unlinkScripts);

const unlinkTheme = gulp.series(unlinkPatterns, unlinkStyles, unlinkScripts);

const symLinkPatterns = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell([
      `cd ${process.env.THEME_DIRECTORY}/templates && ln -fs ../../../../ui-component-library-proto/source/components`
    ]));
};
gulp.task(symLinkPatterns);

const symLinkStyles = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell([`cd ${process.env.THEME_DIRECTORY}/less && ln -fs ../../../../ui-component-library-proto/source/components`]));
};
gulp.task(symLinkStyles);

const symLinkScripts = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell([`cd ${process.env.THEME_DIRECTORY}/js && ln -fs ../../../../ui-component-library-proto/source/components`]));
};
gulp.task(symLinkScripts);

const shouldRemoveComponents = async (callback) => {
  const shouldRemove = await helpers.checkForComponents();

  if (shouldRemove) {
    return unlinkTheme();
  }

  return callback();
};
gulp.task(shouldRemoveComponents);

const symLinkTheme = gulp.series(
  shouldRemoveComponents,
  symLinkPatterns,
  symLinkStyles,
  symLinkScripts,
  componentImports
);

const copyPatterns = () => {
  const source = config.paths.source.patterns;

  return gulp
    .src(`${source}**/*.phtml`)
    .pipe(gulp.dest(`${process.env.THEME_DIRECTORY}/templates/components`));
};
gulp.task(copyPatterns);

const copyStyles = () => {
  const source = config.paths.source.patterns;

  return gulp
    .src(`${source}**/*.less`)
    .pipe(gulp.dest(`${process.env.THEME_DIRECTORY}/less/components`));
};
gulp.task(copyStyles);

const copyScripts = () => {
  const source = config.paths.source.patterns;

  return gulp
    .src(`${source}**/*.js`)
    .pipe(gulp.dest(`${process.env.THEME_DIRECTORY}/js/components`));
};
gulp.task(copyScripts);

const shouldUnlinkTheme = async (callback) => {
  const shouldUnlink = await helpers.checkForSymlinks();

  if (shouldUnlink) {
    return unlinkTheme();
  }

  return callback();
};
gulp.task(shouldUnlinkTheme);

const copyTheme = gulp.series(
  shouldUnlinkTheme,
  copyPatterns,
  copyStyles,
  copyScripts,
  componentImports
);

const defaultTask = gulp.series(
  cleanPublic,
  gulp.parallel(patternLab, styles, scripts, vendorScripts)
);

const watch = gulp.series(defaultTask, watchTask);

// Descriptions
cleanPublic.description = "Clear all files under public directory";

patternLab.description = "Build PatternLab to public directory";

styles.description = "Convert and minify Less to CSS";

scripts.description = "Build and uglify Javascript into main.js";

vendorScripts.description = "Build and uglify vendor Javascript";

watchTask.description = "Initialize BrowserSync instance and watch for changes";

componentImports.description = "Inject component imports to dedicated files";

shouldUnlinkTheme.description = "Ask if linked components should be unlinked";

symLinkPatterns.description = "Create patterns symbolic link";

symLinkStyles.description = "Create styles symbolic link";

symLinkScripts.description = "Create scripts symbolic link";

unlinkPatterns.description = "Remove symbolic link from working patterns";

unlinkStyles.description = "Remove symbolic link from working styles";

unlinkScripts.description = "Remove symbolic link from working scripts";

shouldRemoveComponents.description = "Ask if existing components in theme directory should be removed";

copyPatterns.description = "Create patterns copy";

copyStyles.description = "Create styles copy";

copyScripts.description = "Create Javascript scripts copy";

defaultTask.description = "Clear public directory and build patterns, CSS and Javascript from the source directory";

watch.description = 'Build PatternLab from source files and watch for changes.';

symLinkTheme.description = "Create symbolic links to working theme";

unlinkTheme.description = "Unlink/remove components from working theme";

copyTheme.description = "Copy components to working theme";

// Exports
exports.watch = watch;
exports.symLinkTheme = symLinkTheme;
exports.copyTheme = copyTheme;
exports.unlinkTheme = unlinkTheme;
