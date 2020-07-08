/* eslint-disable no-console */
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
const inject = require('gulp-inject');

const cleanPublic = () => {
  return gulp.src(`${config.paths.public.root}/*`).pipe(clean({ force: true }));
};

const patternLab = () => {
  return gulp
    .src('.', { allowEmpty: true })
    .pipe(shell(['patternlab build --config ./patternlab-config.json'])).pipe(browserSync.stream());
};

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

const copyScripts = () => {
  const source = `${config.paths.source.js}/components`;
  const dest = './../js/';

  return gulp.src(`${source}/*.js`).pipe(gulp.dest(dest));
};

const copyStyles = () => {
  const patterns = './../less'

  return gulp.src(`${patterns}/patterns.less`).pipe(inject(gulp.src(`${config.paths.source.styles}/components/**/*.less`, { read: false, }), {
    starttag: '/* Patterns start */', endtag: '/* Patterns end */', transform: (filePath) => `@import "./../ui-component-library-proto${filePath}";`
  })).pipe(gulp.dest(patterns));
};

const copyPatterns = () => {
  const source = `${config.paths.source.patterns}`;
  const dest = './../templates/_patterns';

  return gulp.src(`${source}/**/*phtml`).pipe(gulp.dest(dest));
};

const defaultTask = gulp.series(
  cleanPublic,
  gulp.parallel(patternLab, styles, scripts, vendorScripts)
);

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

const themeBuildTask = gulp.series(copyPatterns, copyStyles, copyScripts);

const watch = gulp.series(defaultTask, watchTask);
const themeBuild = themeBuildTask;

exports.watch = watch;
exports.themeBuild = themeBuild;

