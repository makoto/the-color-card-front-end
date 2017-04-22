// plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoPrefixer = require('gulp-autoprefixer'),
    jsHint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync');

// paths
var path = {
  src: 'src/',
  markup: 'src/markup/**/*.html',
  sass: 'src/sass/**/*.scss',
  jsDev: ['!src/js/vendor/**/*.js', 'src/js/**/*.js'],
  jsVendor: 'src/js/vendor/**/*.js',
  dist: 'dist/',
  css: 'dist/css',
  jsDist: 'dist/js'
};

// copy markup to dist
gulp.task('markup', function() {
  gulp.src(path.markup)
    .pipe(gulp.dest(path.dist));
});

// compile sass
gulp.task('sass', function() {
  gulp.src(path.sass)
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: true
    }).on('error', sass.logError))
    .pipe(autoPrefixer())
    .pipe(gulp.dest(path.css))
    .pipe(browserSync.stream());
});

// lint and concat JS
gulp.task('js:dev', function() {
  gulp.src(path.jsDev)
    .pipe(jsHint())
    .pipe(jsHint.reporter('default'))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(path.jsDist));
});

// concat vendor JS
gulp.task('js:vendor', function() {
  gulp.src(path.jsVendor)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(path.jsDist));
});

// serve files and watch for changes with browser-sync
gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: path.dist,
    port: 4000,
    ui: {port: 40001},
    notify: false
  });

  gulp.watch(path.sass, ['sass']);
  gulp.watch(path.markup, ['markup']).on('change', browserSync.reload);
  gulp.watch(path.jsDev, ['js:dev']).on('change', browserSync.reload);
  gulp.watch(path.jsVendor, ['js:vendor']).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);