const config = require('./patternlab-config.json');

const fs = require('fs');

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
const inject = require('gulp-inject');

const cleanPublic = () => {
  return gulp.src(`${config.paths.public.root}/*`).pipe(clean({ force: true }));
};

cleanPublic.description = "Remove all files under public directory"
gulp.task(cleanPublic);

const patternLab = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell(['patternlab build --config ./patternlab-config.json'])).pipe(browserSync.stream());
};

patternLab.description = "Build PatternLab to public directory";
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

styles.description = "Convert and minify Less to CSS"
gulp.task(styles);

const scripts = () => {
  const source = config.paths.source.js;
  const dest = config.paths.public.js;

  return gulp
    .src([`${source}/finna.js`, `!${source}/vendor/*.js`, `${source}/components/*.js`])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dest))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
};

scripts.description = "Build and uglify Javascript into main.js";
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

vendorScripts.description = "Build and uglify vendor Javascript";
gulp.task(vendorScripts);

const copyScripts = () => {
  const source = `${config.paths.source.js}/components`;
  const dest = './../js/';

  return gulp.src(`${source}/*.js`).pipe(gulp.dest(dest));
};

copyScripts.description = "Copy Javascript components to theme js directory";
gulp.task(copyScripts);

const copyStyles = () => {
  const patterns = './../less'

  if (!fs.existsSync(`${patterns}/patterns.less`)) {
    fs.openSync(`${patterns}/patterns.less`, 'w');

    fs.writeFileSync(`${patterns}/patterns.less`, "/* Patterns start */\r\n/* Patterns end */");
  }

  return gulp.src(`${patterns}/patterns.less`).pipe(inject(gulp.src(`${config.paths.source.styles}/components/**/*.less`, { read: false, }), {
    starttag: '/* Patterns start */', endtag: '/* Patterns end */', transform: (filePath) => `@import "./../ui-component-library-proto${filePath}";`
  })).pipe(gulp.dest(patterns));
};

copyStyles.description = "Import Less components to theme patterns.less file";
gulp.task(copyStyles);

const copyPatterns = () => {
  const source = `${config.paths.source.patterns}`;
  const dest = './../templates/_patterns';

  return gulp.src(`${source}/**/*phtml`).pipe(gulp.dest(dest));
};

copyPatterns.description = "Copy _patterns directory to theme templates directory";
gulp.task(copyPatterns);

const defaultTask = gulp.series(
  cleanPublic,
  gulp.parallel(patternLab, styles, scripts, vendorScripts)
);

defaultTask.description = "Clear public directory and build patterns, CSS and Javascript from the source directory"

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

  gulp.watch(`${config.paths.source.patterns}**/*.phtml`, patternLab);
};

watchTask.description = "Initialize BrowserSync instance and watch for changes";
gulp.task(watchTask);

const watch = gulp.series(defaultTask, watchTask);
watch.description = 'Build PatternLab from source files and watch for changes.'

const buildTheme = gulp.series(copyPatterns, copyStyles, copyScripts);
buildTheme.description = 'Copy patterns, Less and Javascript from source directory to dedicated theme directories'

exports.watch = watch;
exports.buildTheme = buildTheme;

