var gulp = require('gulp');
var glob = require('glob');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var connect = require('gulp-connect');
var run = require('gulp-run');
var mocha = require('gulp-mocha');
var testem = require('gulp-testem');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var shell = require('gulp-shell');
var jscs = require('gulp-jscs');
var bump = require('gulp-bump');
var prompt = require('gulp-prompt');
var git = require('gulp-git');
var fs = require('fs');
var insert = require('gulp-insert');

const babel = require('gulp-babel');
const del = require('del');
const exec = require('child_process').exec;

var projectName = 'chariot';

const paths = {
  allSrcJs: 'lib/**/*.js',
  distDir: 'dist',
  releaseDir: 'release'
};

gulp.task("default", ['js', 'sass']);

//################ DEV ####################

gulp.task('watch', ['js:watch', 'sass:watch']);

gulp.task('js', function() {
  return browserify({
    entries: './lib/index.js',
    // debug: true
  })
    .transform(babelify)
    .bundle()
    .pipe(source(projectName + '.js'))
    .pipe(gulp.dest('./dist/javascripts'))
    .pipe(connect.reload())
});

gulp.task('js:watch', function() {
  return gulp.watch(paths.allSrcJs, ['js']);
});

gulp.task('sass', function() {
  return gulp.src('./stylesheets/chariot.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename(projectName + '.css'))
    .pipe(autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
    }))
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

gulp.task('js-doc', shell.task([
  './node_modules/.bin/jsdoc lib/* --destination docs/'
]));

gulp.task('style', function () {
  return gulp.src(['lib/**', 'test/**'])
    .pipe(jscs());
});

gulp.task('style-fix', function () {
  return gulp.src(['lib/**', 'test/**'], { base: './' })
    .pipe(jscs({
      configPath: '.jscsrc',
      fix: true
    }))
    .pipe(gulp.dest('./'));
});

function getVersion(){
  return JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
}

gulp.task('release', function(cb){
  return runSequence(
    'bump',
    'build-release',
    'git-tag',
    cb
    );
});

gulp.task('git-tag', function(cb){
  var version = getVersion();
  return gulp.src(["release", "package.json", "npm-shrinkwrap.json", "bower.json"])
    .pipe(git.commit('bump version'))
    .pipe(
      prompt.prompt({
        type: 'input',
        name: 'message',
        message: "A simple message for tagging v" + version + ":"
      }, function(res){
        var message = res.message;
        return git.tag("v" + version, message, {args: '-a'}, function(err){
          if (!err) {
            console.log("Successfully tagged v" + version);
            git.push('origin', "master", {args: '--tags'}, function(err){
              if(err){
                throw err;
              }
            });
          }
          else {
            throw err;
          }
        });
      })
    );
});

gulp.task('build-release',function(cb){
  return runSequence(
    'style-fix',
    'js-doc',
    ['clean'],
    ['js-minify', 'css-minify'],
    'prepend-version',
    'copy-dist',
    cb
  );
});

function releaseHeader() {
  var license = fs.readFileSync('LICENSE.txt', 'utf8'),
    packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8')),
    version = packageJson.version,
    repository = packageJson.repository,
    name = packageJson.name,
    description = packageJson.description;

  return [ "/**",
    [" *", name, "v"+version, "-", description].join(" "),
    " *",
    [" *", repository].join(" "),
    " *",
    license,
    " */\n"
  ].join('\n')

}

gulp.task('prepend-version', function(){
  return gulp.src(['dist/javascripts/' + projectName + '.js',
    'dist/stylesheets/' + projectName + '.css'], {base: 'dist/'})
    .pipe(insert.prepend(releaseHeader()))
    .pipe(gulp.dest('dist/'))
})

gulp.task('copy-dist', function(){
  return gulp.src(['dist/javascripts/'+projectName+'.js'
    ,'dist/javascripts/'+projectName+'.min.js'
    ,'dist/stylesheets/'+projectName+'.css'
    ,'dist/stylesheets/'+projectName+'.min.css'
    ])
    .pipe(gulp.dest('release/'));
})

gulp.task('js-minify', ['js'], function(){
  return gulp.src('./dist/javascripts/' + projectName + '.js')
    .pipe(uglify())
    .pipe(rename(projectName + '.min.js'))
    .pipe(gulp.dest('./dist/javascripts'));
})
gulp.task('css-minify', ['sass'], function(){
  return gulp.src('./dist/stylesheets/**/*')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename(projectName + '.min.css'))
    .pipe(gulp.dest('./dist/stylesheets'));
})

gulp.task('clean', function () {
  return del([paths.distDir, paths.releaseDir]);
});

var versionBumpType;
gulp.task('bump-prompt', function(cb){
  return gulp.src(['./bower.json', './package.json', './npm-shrinkwrap.json'])
    .pipe(prompt.prompt({
      type: 'checkbox',
      name: 'bump',
      message: 'What would you like to bump? Choose one, or leave empty to skip',
      choices: ['patch', 'minor', 'major']
    }, function(res){
      if (res.bump.length > 1) {
        throw Error("Y U NO FOLLOW INSTRUCTIONS!");
      }
      versionBumpType = res.bump[0]
    }));
})
gulp.task('bump', ['bump-prompt'], function(){
  return gulp.src(['./bower.json', './package.json', './npm-shrinkwrap.json'])
    .pipe(bump({type: versionBumpType}))
    .pipe(gulp.dest('./'));
});

