var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var gulpStylelint = require('gulp-stylelint');

function lint() {
  return gulp.src('scss/**/*.scss')
    .pipe(gulpStylelint({
      failAfterError: true,
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }));
}

function serve() {
  browserSync.init({
    server: '.'
  });

  gulp.watch('scss/**/*.scss', scssToCss);
  gulp.watch("*.html").on('change', browserSync.reload);
}

function scssToCss() {
  return gulp.src('scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
}

function watch() {
  gulp.watch('scss/**/*.scss', scssToCss);
}

exports.build = scssToCss;
exports.watch = watch;
exports.serve = serve;
exports.lint = lint;
