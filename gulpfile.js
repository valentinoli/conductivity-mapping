const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const pug = require('gulp-pug');

gulp.task('nodemon', (callback) => {
  const called = false;
  return nodemon({
    script: './dist/app.js',
    ignore: [ 'node_modules/**/*.js' ],
    env: { 'NODE_ENV': 'development' }
  }).on('start', () => {
    if(!called) {
      callback();
      called = true;
    }
  });
});

gulp.task('default', ['nodemon'], () => {

  browserSync.init({
    proxy: 'localhost:3000',
    port: 4000,
  });

  // Látum gulp fylgjast með breytingum
  gulp.watch(['./dist/public/**/*.js']).on('change', browserSync.reload);
  gulp.watch(['./dist/**/*.css']).on('change', browserSync.reload);
  gulp.watch(['./dist/**/*.pug']).on('change', browserSync.reload);
});

// babel þýðir ecmascript yfir í javascript
gulp.task('babel-public', () => {
  return gulp.src('./src/js/*.js')
  .pipe(babel())
  .pipe(gulp.dest('./dist/public/js'));
});

gulp.task('babel-root', () => {
  return gulp.src('./src/*.js')
  .pipe(babel())
  .pipe(gulp.dest('./dist'));
});

// sass þýðir .scss yfir í .css
gulp.task('sass', () => {
  return gulp.src('./src/scss/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./dist/public/css'));
});

// views þýðir .pug yfir í .html
gulp.task('views', () => {
  return gulp.src('./src/views/**/*.pug')
  //.pipe(pug( {pretty: true} ))
  .pipe(gulp.dest('./dist/views'));
});


gulp.task('watch', () => {
  gulp.watch(['./src/js/*.js'], ['babel-public']);
  gulp.watch(['./src/*.js'], ['babel-root']);
  gulp.watch(['./src/**/*.scss'], ['sass']);
  gulp.watch(['./src/**/*.pug'], ['views']);
});

// Fer yfir .js skjölin og birtir það sem brýtur í bága við ESlint staðal
gulp.task('lint-javascript', () => {
  return gulp.src(['./src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Fer yfir .scss skjölin og birtir það sem brýtur í bága við SCSS staðal
gulp.task('lint-sass', () => {
  return gulp.src('src/**/*.scss')
    .pipe(stylelint({
        reporters: [
          {formatter: 'string', console: true}
        ]
    }));
});

gulp.task('lint', ['lint-sass', 'lint-javascript']);
gulp.task('babel', ['babel-public', 'babel-root']);
gulp.task('pipe', ['sass', 'babel', 'views']);
