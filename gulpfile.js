var gulp = require("gulp");
var glob = require('glob');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var connect = require('gulp-connect');
var run = require('gulp-run');
var babel = require('babel/register');
var mocha = require('gulp-mocha');
var testem = require('gulp-testem');
var sass = require('gulp-sass');

reportOptions = {
  err: true, // default = true, false means don't write err
  stderr: true, // default = true, false means don't write stderr
  stdout: true // default = true, false means don't write stdout
}

gulp.task("default", ['js', 'sass']);

//################ BUILD ####################

gulp.task('watch', ['js:watch', 'sass:watch']);

gulp.task('js', function() {
  browserify({
    entries: './modules/index.js',
    debug: true
  })
    .transform(babelify)
    .bundle()
    .pipe(source('chariot.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload())
});

gulp.task('js:watch', function() {
  return gulp.watch('modules/**/*.js', ['js']);
});

gulp.task('sass', function() {
  gulp.src('./stylesheets/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/stylesheets'));
});

gulp.task('sass:watch', function() {
  gulp.watch('./stylesheets/**/*.scss', ['sass']);
});

//################ TEST ####################

gulp.task('connect', ['watch'], function() {
  connect.server({
    root: [__dirname],
    livereload: true
  });
});

gulp.task('test', function() {
  return gulp.src(['test/**/*.js'])
    .pipe(mocha({
      compilers: {
        js: babel
      }
    }))
});

gulp.task('testem', ['compile-test'], function() {
  gulp.src([''])
    .pipe(testem({
      configFile: 'testem.yml'
    }));
});

gulp.task("compile-test", function() {
  glob("./test/*.js", function(er, files) {
    return browserify({
        entries: files,
        debug: true
      })
      .transform(babelify)
      .bundle()
      .pipe(source('test.js'))
      .pipe(gulp.dest('./dist/test'))
  });
});
