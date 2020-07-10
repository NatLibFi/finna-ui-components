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

const cleanPublic = () => {
  return gulp.src(`${config.paths.public.root}/*`).pipe(clean({ force: true }));
};

cleanPublic.description = "Remove all files under public directory"
gulp.task(cleanPublic);

const cleanDist = () => {
  return gulp.src('dist/*').pipe(clean({ force: true }));
};

cleanDist.description = "Remove all files under dist directory"
gulp.task(cleanDist);

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

const distScripts = () => {
  const source = config.paths.source.patterns;
  const dest = './dist/js';

  return gulp.src(`${source}/**/*.js`).pipe(rename({ prefix: 'finna-', dirname: '' })).pipe(gulp.dest(dest));
};

distScripts.description = "Distribute Javascript components";
gulp.task(distScripts);

const distStyles = () => {
  const source = config.paths.source.patterns;
  const dest = './dist/less';

  return gulp
    .src(`${source}/**/*.less`)
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest(dest));
};

distStyles.description = "Import Less components to dist patterns.less file";
gulp.task(distStyles);

const distPatterns = () => {
  const source = `${config.paths.source.patterns}`;
  const dest = './dist/_patterns';

  return gulp.src(`${source}/**/*.phtml`).pipe(gulp.dest(dest));
};

distPatterns.description = "Distribute _patterns directory";
gulp.task(distPatterns);

const buildTheme = gulp.series(cleanDist, distPatterns, distStyles, distScripts);

buildTheme.description = 'Distribute patterns, Less and Javascript from source directory'

const symLinkPatterns = () => {
  return gulp
    .src('dist/_patterns')
    .pipe(gulp.symlink(`${process.env.THEME_DIRECTORY}/templates/`));
};

const symLinkStyles = () => {
  return gulp
    .src('dist/less/*.less')
    .pipe(gulp.symlink(`${process.env.THEME_DIRECTORY}/less/finna`))
};

const symLinkScripts = () => {
  return gulp
    .src('dist/js/*.js')
    .pipe(gulp.symlink(`${process.env.THEME_DIRECTORY}/js/`));
};

const symLinkTheme = gulp.series(symLinkPatterns, symLinkStyles, symLinkScripts);

const defaultTask = gulp.series(
  cleanPublic,
  gulp.parallel(patternLab, styles, scripts, vendorScripts),
  buildTheme
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

  gulp.watch(`${config.paths.source.styles}/**/*.less`, gulp.series(styles, buildTheme));

  gulp.watch(`${config.paths.source.patterns}**/*.less`, gulp.series(styles, buildTheme));

  gulp.watch(`${config.paths.source.js}/**/*.js`, gulp.series(scripts, buildTheme));

  gulp.watch(`${config.paths.source.patterns}**/*.js`, gulp.series(scripts, buildTheme));

  gulp.watch(`${config.paths.source.patterns}**/*.phtml`, gulp.series(patternLab, buildTheme));
};

watchTask.description = "Initialize BrowserSync instance and watch for changes";
gulp.task(watchTask);

const watch = gulp.series(defaultTask, watchTask);
watch.description = 'Build PatternLab from source files and watch for changes.'


exports.watch = watch;

exports.buildTheme = buildTheme;

exports.symLinkTheme = symLinkTheme;

