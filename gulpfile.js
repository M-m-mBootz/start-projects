//Подключаем модули галпа
const gulp = require('gulp'),
      sass = require('gulp-sass'),
      concat = require('gulp-concat'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCSS = require('gulp-clean-css'),
      terser = require('gulp-terser'),
      del = require('del'),
      imagemin = require('gulp-imagemin'),
      htmlmin = require('gulp-htmlmin'),
      imageminJpegRecompress = require('imagemin-jpeg-recompress'),
      browserSync = require('browser-sync').create();

const sassStylesFiles = [
   './src/assets/sass/styles.scss'
];

const cssStylesFiles = [
   './src/assets/css/**/*.css'
];

const jsFiles = [
   './src/assets/js/*.js',
   './src/index.js'
];

const imgFiles = [
  './src/assets/img/**/*.png',
  './src/assets/img/**/*.jpg',
  './src/assets/img/**/*.gif',
  './src/assets/img/**/*.svg'
];

//Таск на стили CSS

function tocss(){
   return gulp.src(sassStylesFiles)
   .pipe(sass({
     includePaths: require('node-normalize-scss').includePaths
   }))
   .pipe(autoprefixer({
      browserslistrc: ['last 2 versions'],
      cascade: false
   }))
   .pipe(cleanCSS({
      level: 2
   }))
   .pipe(gulp.dest('./dist'))
   .pipe(browserSync.stream());
}
   

function scripts() {
   return gulp.src(jsFiles)
   .pipe(concat('index.js'))
   .pipe(terser())
   .pipe(gulp.dest('./dist'))
   .pipe(browserSync.stream());
}

function minimg() {
   return gulp.src(imgFiles)
   .pipe(
        imagemin([
          imagemin.jpegtran({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imageminJpegRecompress({
             loops: 3,
             min: 60,
             max: 70,
             quality:'high'
           }),
          imagemin.svgo(),
          ]),
      )
   .pipe(gulp.dest('./dist/img'))
}

function minhtml() {
  return gulp.src('./src/*.html')
 .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('templates'));
}

function fonts() {
  return gulp.src('./src/assets/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'));
}

function clean() {
   return del(['dist', 'templates'])
}

function watch() {
  
  gulp.watch('./src/assets/sass/**/*.scss').on('change', gulp.series(tocss, browserSync.reload));
  gulp.watch(['./src/assets/js/**/*.js', './src/index.js'], scripts, browserSync.reload);
  gulp.watch('./src/*.html').on('change', gulp.series(minhtml, browserSync.reload));
}

exports.tocsss = tocss;
exports.scripts = scripts;
exports.delcss = clean;
exports.images = minimg;
exports.html = minhtml;
exports.fonts = fonts;
exports.watch = watch;
exports.build = gulp.series(clean, gulp.parallel(fonts, minhtml, tocss, scripts, minimg));
exports.dev = gulp.series(exports.build, watch);
