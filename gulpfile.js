var gulp = require("gulp");
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var connect = require('gulp-connect');
 
gulp.task('connect', ['watch'], function() {
  connect.server({
    root: [__dirname],
    livereload: true
  });
});


gulp.task('watch', function(){
  return gulp.watch('modules/**/*.js', ['default']);
});

gulp.task("default", function () {
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


