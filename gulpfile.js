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

const cleanPublic = () => {
  return gulp.src(`${config.paths.public.root}/*`).pipe(clean({force: true}));
};

const patternLab = () => {
  return gulp
    .src('.', {allowEmpty: true})
    .pipe(shell(['patternlab build --config ./patternlab-config.json']))
    .pipe(browserSync.stream());
};

const styles = () => {
  const source = config.paths.source.styles;
  const dest = config.paths.public.styles;

  return gulp
    .src(`${source}/*.less`)
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(minify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
};

const globalScripts = () => {
  const source = config.paths.source.js;
  const dest = config.paths.public.js;

  return gulp
    .src(`${source}/*.js`)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dest))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
};

const componentScripts = () => {
  const source = config.paths.source.js;
  const dest = `${config.paths.public.js}/components`;

  return gulp
    .src(`${source}/components/**/*.js`)
    .pipe(gulp.dest(dest))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
};

const defaultTask = gulp.series(
  cleanPublic,
  gulp.parallel(patternLab, styles, globalScripts, componentScripts)
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

  gulp.watch(`${config.paths.source.js}/*.js`, globalScripts);
  gulp.watch(`${config.paths.source.js}/components/**/*.js`, componentScripts);

  gulp.watch(`${config.paths.source.patterns}**/*.phtml`, patternLab);
};

const serve = gulp.series(defaultTask, watchTask);

exports.default = serve;
