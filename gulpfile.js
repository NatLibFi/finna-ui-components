require('dotenv').config();
const config = require('./patternlab-config.json');

const gulp = require('gulp');
const less = require('gulp-less');
const shell = require('gulp-shell');
const browserSync = require('browser-sync');

const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const minify = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');

// Helpers
const cleanDir = (dir) => gulp.src(`${dir}/*`).pipe(clean({ force: true }));;

// Tasks
const cleanPublic = () => cleanDir(config.paths.public.root);
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
    .pipe(less())
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
    .src([`${source}/js/finna.js`, `!${source}/js/vendor/*.js`, `${source}/_patterns/**/*.js`])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dest))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
};
gulp.task(scripts);

const vendorScripts = () => {
  const source = config.paths.source.js;
  const dest = `${config.paths.public.js}/vendor`;

  return gulp
    .src(`${source}/vendor/*.js`)
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

  gulp.watch(`${config.paths.source.styles}/**/*.less`, styles);
  gulp.watch(`${config.paths.source.patterns}**/*.less`, styles);

  gulp.watch(`${config.paths.source.js}/**/*.js`, scripts);
  gulp.watch(`${config.paths.source.patterns}**/*.js`, scripts);

  gulp.watch(`${config.paths.source.patterns}**/*.phtml`, patternLab);
  gulp.watch(`${config.paths.source.patterns}**/*.json`, patternLab);
};
gulp.task(watchTask);

const cleanDist = () => cleanDir('dist/*');
gulp.task(cleanDist);

const distPatterns = () => {
  const source = `${config.paths.source.patterns}`;
  const dest = './dist/_patterns';

  return gulp.src(`${source}/**/*.phtml`).pipe(gulp.dest(dest));
};

gulp.task(distPatterns);

const distStyles = () => {
  const source = config.paths.source.patterns;
  const dest = './dist/less';

  return gulp
    .src(`${source}/**/*.less`)
    .pipe(gulp.dest(dest));
};
gulp.task(distStyles);

const distScripts = () => {
  const source = config.paths.source.patterns;
  const dest = './dist/js';

  return gulp.src(`${source}/**/*.js`)
    .pipe(rename({ prefix: 'finna-' }))
    .pipe(gulp.dest(dest));
};
gulp.task(distScripts);

const buildTheme = gulp.series(
  cleanDist,
  distPatterns,
  distStyles,
  distScripts
);

const symLinkPatterns = () => {
  return gulp
    .src('dist/_patterns/**/*.phtml',)
    .pipe(gulp.symlink(`${process.env.THEME_DIRECTORY}/templates/_patterns`, { overwrite: true }));
};
gulp.task(symLinkPatterns);

const symLinkStyles = () => {
  return gulp
    .src('dist/less/**/*.less')
    .pipe(gulp.symlink(`${process.env.THEME_DIRECTORY}/less/components`, { overwrite: true }));
};
gulp.task(symLinkStyles);

const symLinkScripts = () => {
  return gulp
    .src('dist/js/**/*.js')
    .pipe(gulp.symlink(`${process.env.THEME_DIRECTORY}/js/components`, { overwrite: true }));
};
gulp.task(symLinkScripts);

const symLinkTheme = gulp.series(
  symLinkPatterns,
  symLinkStyles,
  symLinkScripts
);

const copyPatterns = () => {
  return gulp
    .src('dist/_patterns/**/*.phtml',)
    .pipe(gulp.dest(`${process.env.THEME_DIRECTORY}/templates/_patterns`));
};
gulp.task(copyPatterns);

const copyStyles = () => {
  return gulp
    .src('dist/less/**/*.less')
    .pipe(gulp.dest(`${process.env.THEME_DIRECTORY}/less/components`));
};
gulp.task(copyStyles);

const copyScripts = () => {
  return gulp
    .src('dist/js/**/*.js')
    .pipe(gulp.dest(`${process.env.THEME_DIRECTORY}/js/components`));
};
gulp.task(copyScripts);

const copyTheme = gulp.series(copyPatterns, copyStyles, copyScripts);

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

cleanDist.description = "Clear all files under dist directory";

distPatterns.description = "Distribute patterns";

distStyles.description = "Distribute Less components";

distScripts.description = "Distribute Javascript components";

buildTheme.description = 'Distribute patterns, Less and Javascript from source directory'

symLinkPatterns.description = "Create patterns symbolic link";

symLinkStyles.description = "Create styles symbolic link";

symLinkScripts.description = "Create scripts symbolic link";

copyPatterns.description = "Create patterns copy";

copyStyles.description = "Create styles copy";

copyScripts.description = "Create Javascript scripts copy";

defaultTask.description = "Clear public directory and build patterns, CSS and Javascript from the source directory";

watch.description = 'Build PatternLab from source files and watch for changes.';

symLinkTheme.description = "Create symbolic link to working theme";

copyTheme.description = "Create distributable copy to working theme"

// Exports
exports.watch = watch;
exports.buildTheme = buildTheme;
exports.symLinkTheme = symLinkTheme;
exports.copyTheme = copyTheme;

