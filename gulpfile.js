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
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');

var projectName = 'chariot';

gulp.task("default", ['js', 'sass']);

//################ DEV ####################

gulp.task('watch', ['js:watch', 'sass:watch']);

gulp.task('js', function() {
  return browserify({
    entries: './modules/index.js',
    //debug: true
  })
    .transform(babelify)
    .bundle()
    .pipe(source(projectName + '.js'))
    .pipe(gulp.dest('./dist/javascripts'))
    .pipe(connect.reload())
});

gulp.task('js:watch', function() {
  return gulp.watch('modules/**/*.js', ['js']);
});

gulp.task('sass', function() {
  return gulp.src('./stylesheets/chariot.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename(projectName + '.css'))
    .pipe(gulp.dest('./dist/stylesheets'))
    .pipe(connect.reload())
});

gulp.task('sass:watch', function() {
  gulp.watch('./stylesheets/**/*.scss', ['sass']);
});

//################ TEST ####################

gulp.task('connect', ['js', 'sass', 'watch'], function() {
  connect.server({
    root: [__dirname],
    livereload: true
  });
});

gulp.task('test', function() {
  return gulp.src(['test/**/*.js'], {read: false})
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
  glob("./test/**/*.js", function(er, files) {
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

//################ BUILD ####################

gulp.task('release', ['build-release'], function(){

});

gulp.task('build-release', ['clean'],function(){
  return runSequence(
    ['js-minify', 'css-minify'],
    function(){
      gulp.src(['./modules/**/*'
        , './stylesheets/**/*'
        , './test/**/*'
        , './assets/**/*'
        , './dist/**/*'
        , './package.json'
        , './index.html'], {base: './'})
        .pipe(gulp.dest('release/source/'));
      gulp.src(['dist/javascripts/'+projectName+'.js'
       ,'dist/javascripts/'+projectName+'.min.js'
       ,'dist/stylesheets/'+projectName+'.css'
       ,'dist/stylesheets/'+projectName+'.min.css'
       ])
        .pipe(gulp.dest('release/'));
    }
  );
});

gulp.task('js-minify', ['js'], function(){
  return gulp.src('./dist/javascripts/' + projectName + '.js')
    .pipe(uglify())
    .pipe(rename(projectName + '.min.js'))
    .pipe(gulp.dest('./dist/javascripts'));
})
gulp.task('css-minify', ['sass'], function(){
  return gulp.src('./dist/stylesheets/**/*')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rename(projectName + '.min.css'))
    .pipe(gulp.dest('./dist/stylesheets'));
})

gulp.task('clean', function () {
  return gulp.src(['dist/', 'release/'], {read: false})
    .pipe(clean());
});
