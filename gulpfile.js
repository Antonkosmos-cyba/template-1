const { src, dest, series, watch } = require("gulp");
// const sass = require('gulp-sass')(require('sass'))
const csso = require("gulp-csso");
// const concat = require('gulp-concat')
const autoprefixer = require("gulp-autoprefixer");
// const include = require('gulp-file-include')
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const webphtml = require("gulp-webp-html");
// const svgsprite = require('gulp-svg-sprite')
const svgmin = require("gulp-svgmin");
const cheerio = require("gulp-cheerio");
const replace = require("gulp-replace");
const gulpBabel = require("gulp-babel");
const gulpUglify = require("gulp-uglify");
const clean = require("gulp-clean");
const sync = require("browser-sync").create();
// import imagemin from 'gulp-imagemin';
const removeComments = require("gulp-strip-css-comments");
function html() {
  return (
    src("src/**/**.html")
      // .pipe(include({
      //     prefix: '@@'
      // }))

      // .pipe(webphtml())
      .pipe(
        htmlmin({
          collapseWhitespace: true,
          removeComments: true,
        })
      )
      .pipe(dest("dist"))
      .pipe(sync.reload({ stream: true }))
  );
}

function css() {
  return (
    src("src/assets/**.css")
      // .pipe(sass())
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 2 versions"],
        })
      )
      .pipe(csso())
      // .pipe(concat('index.css'))
      .pipe(removeComments())
      .pipe(dest("dist/assets"))
      .pipe(sync.reload({ stream: true }))
  );
}
function css_swip() {
  return src("./node_modules/swiper/swiper-bundle.min.css").pipe(
    dest("dist/assets")
  );
}

function js() {
  return (
    src("src/*.js")
      .pipe(gulpBabel())
      .pipe(gulpUglify())
      // .pipe(concat('index.js'))
      .pipe(dest("dist/assets/js"))
      .pipe(sync.reload({ stream: true }))
  );
}

function js_swip() {
  return src("./node_modules/swiper/swiper-bundle.min.js").pipe(
    dest("dist/assets/js")
  );
}

function del() {
  return src("dist").pipe(clean());
}

function images() {
  return (
    src(
      "src/assets/**/*.{jpg,png,jpeg,webp,gif}"
      // '!src/images/icon/*'
    )
      // .pipe(
      //     webp ({
      //         quality: 70
      //     })
      // )
      // .pipe(dest('dist/images'))

      // .pipe(src('src/images/**/*.{jpg,png,jpeg,svg,gif}'
      // ))

      .pipe(
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true,
          optimizationLevel: 3, //0 to7
        })
      )
      .pipe(dest("dist/assets"))
  );
}

function media() {
  return src("src/assets/*.{mp4,webm}").pipe(dest("dist/assets"));
}

function font() {
  return src("src/assets/*.ttf").pipe(dest("dist/assets"));
}

function serve() {
  sync.init({
    server: "./dist",
  });
  watch("src/**/**.html", series(html)).on("change", sync.reload);
  watch("src/assets/**.css", series(css)).on("change", sync.reload);
  watch("src/**.js", series(js)).on("change", sync.reload);
}
exports.build = series(images, media, font, js, js_swip, css, css_swip, html);
exports.serve = series(
  del,
  images,
  media,
  font,
  js,
  js_swip,
  css,
  css_swip,
  html,
  serve
);
// exports.clear = del
