var gulp = require('gulp')
var gstylus = require('gulp-stylus')
var stylus = require('stylus')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('autoprefixer-stylus')
var browserSync = require('browser-sync')
var debug = require('gulp-debug')
var browserify = require('browserify')
var babelify = require('babelify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var gutil = require('gulp-util')
var guglify = require('gulp-uglify')

gulp.task('style', function() {
  return gulp.src('src/front-end/styles/index.bundle.styl')
    .pipe(sourcemaps.init())
    .pipe(gstylus({
      use: autoprefixer(),
      define: {
        url: stylus.resolver()
      }
    }))
    .pipe(debug())
    .on('error', gutil.log)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/styles/'))
})

gulp.task('js', function () {
  var b = browserify({
    entries: './src/front-end/js/index.jsx',
    debug: true,
    transform: [babelify]
  })

  return b.bundle()
    .on('error', function (err) {
      gutil.log(err)
      this.emit("end");
    })
    .pipe(source('index.bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(debug())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/js/'))
})

gulp.task('watch', function () {
  gulp.watch(['src/front-end/**/*.css', 'src/front-end/**/*.styl'], ['style'])
  gulp.watch(['src/front-end/**/*.jsx', 'src/front-end/**/*.js'], ['js'])
})

gulp.task('build', ['js', 'style'], function () {})

gulp.task('browser-sync', function () {
  var files = [
    'src/front-end/**/*.css',
    'src/front-end/**/*.styl',
    'src/front-end/**/*.js'
  ];

  browserSync.init(files, {
    server: {
      baseDir: './'
    }
  });
});