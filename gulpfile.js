const gulp = require('gulp'),
   pug = require('gulp-pug'),
   sass = require('gulp-sass'),
   concat = require('gulp-concat'),
   autoprefixer = require('gulp-autoprefixer'),
   cleanCSS = require('gulp-clean-css'),
   terser = require('gulp-terser'),
   del = require('del'),
   imagemin = require('gulp-imagemin'),
   htmlmin = require('gulp-htmlmin'),
   imageminJpegRecompress = require('imagemin-jpeg-recompress'),
   browserSync = require('browser-sync').create(),
   buildPath = ('./build');

const sassStylesFiles = [
   './src/styles/sass/styles.scss'
];

const cssStylesFiles = [
   './src/styles/css/**/*.css'
];

const jsFiles = [
   './src/js/*.js',
   './src/libs/*.js'
];

const imgFiles = [
   './src/img/**/*.png',
   './src/img/**/*.jpg',
   './src/img/**/*.gif',
   './src/img/**/*.svg'
];

function tocss() {
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
      .pipe(gulp.dest('./build'))
      .pipe(browserSync.stream());
}

function scripts() {
   return gulp.src(jsFiles)
      .pipe(concat('index.js'))
      .pipe(terser())
      .pipe(gulp.dest('./build'))
      .pipe(browserSync.stream());
}

function minimg() {
   return gulp.src(imgFiles)
      .pipe(
         imagemin([
            imagemin.jpegtran({
               progressive: true
            }),
            imagemin.optipng({
               optimizationLevel: 5
            }),
            imageminJpegRecompress({
               loops: 3,
               min: 60,
               max: 70,
               quality: 'high'
            }),
            imagemin.svgo(),
         ]),
      )
      .pipe(gulp.dest('./build/img'));
}

function tohtml() {
   return gulp.src('./src/pug/*.pug')
      .pipe(pug({
         pretty: true
      }))
      .pipe(gulp.dest('./src'));

}

function minhtml() {
   return gulp.src('./src/*.html')
      .pipe(htmlmin({
         collapseWhitespace: true
      }))
      .pipe(gulp.dest('./build'));
}

function fonts() {
   return gulp.src('./src/fonts/**/*')
      .pipe(gulp.dest('./build/fonts'));
}

function clean() {
   return del(['build']);
}


function serv() {
   browserSync.init({
      server: {
         baseDir: buildPath
      }
   });
};

function watch() {
   gulp.watch('./src/styles/sass/**/*.scss').on('change', gulp.series(tocss, browserSync.reload));
   gulp.watch('./src/js/**/*.js').on('change', gulp.series(scripts, browserSync.reload));
   gulp.watch('./src/*.html').on('change', gulp.series(minhtml, browserSync.reload));
   serv ();
}

exports.tocss = tocss;
exports.scripts = scripts;
exports.delcss = clean;
exports.images = minimg;
exports.tohtml = tohtml;
exports.html = minhtml;
exports.fonts = fonts;
exports.watch = watch;
exports.build = gulp.series(clean, gulp.parallel(fonts, minhtml, tocss, scripts, minimg));
exports.dev = gulp.series(exports.build, watch);