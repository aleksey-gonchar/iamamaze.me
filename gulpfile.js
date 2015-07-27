var gulp = require('gulp')
var stylus = require('gulp-stylus')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('autoprefixer-stylus')
var debug = require('gulp-debug')

gulp.task('bundle-style', function() {
  return gulp.src('src/front-end/styles/index.bundle.css')
    .pipe(sourcemaps.init())
    .pipe(stylus({
      use: [autoprefixer()],
      'include css': true,
      url: { name: 'url', limit: false }
    }))
    .pipe(debug({title: 'stylus'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/styles/'))
})

gulp.task('watch', function () {
  gulp.watch(['src/front-end/**/*.css', 'src/front-end/**/*.styl'], ['bundle-style'])
})