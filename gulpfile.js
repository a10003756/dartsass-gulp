const { src, dest, watch, series, parallel } = require("gulp");

// 共通
const rename = require("gulp-rename");

// 読み込み先（階層が間違えていると動かないので注意）
const srcPath = {
    css: 'src/sass/**/*.scss',
    img: 'src/images/**/*',
    html: './**/*.html',
}

// 吐き出し先（なければ生成される）
const destPath = {
    css: 'assets/css/',
    img: 'assets/images/'
}

// ブラウザーシンク（リアルタイムでブラウザに反映させる処理）
const browserSync = require("browser-sync");
const browserSyncOption = {
    server: "./"
}
const browserSyncFunc = () => {
    browserSync.init(browserSyncOption);
}
const browserSyncReload = (done) => {
    browserSync.reload();
    done();
}

// Sassファイルのコンパイル処理（DartSass対応）
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob-use-forward');
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const postcss = require("gulp-postcss");
const cssnext = require("postcss-cssnext")
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const browsers = [
    'last 2 versions',
    '> 5%',
    'ie = 11',
    'not ie <= 10',
    'ios >= 8',
    'and_chr >= 5',
    'Android >= 5',
]

const cssSass = () => {
    return src(srcPath.css)
        .pipe(sourcemaps.init())
        .pipe(
            plumber({
                errorHandler: notify.onError('Error:<%= error.message %>')
            }))
        .pipe(sassGlob())
        .pipe(sass.sync({
            includePaths: ['src/sass'],
            outputStyle: 'expanded'
        }))
        .pipe(postcss([cssnext(browsers)]))
        .pipe(sourcemaps.write('./'))
        .pipe(dest(destPath.css))
        .pipe(notify({
            message: 'OK!!!',
            onLast: true
        }))
}

const cssMin = () => {
    return src(srcPath.css)
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass.sync({
            includePaths: ['src/sass'],
            outputStyle: 'expanded'
        }))        
        .pipe(cleanCSS()) // css 圧縮
        .pipe(
        rename({
            extname: '.min.css',
        })
        ) // .min.css にリネーム
        .pipe(dest(destPath.css)) // min.css 出力
        .pipe(sourcemaps.write('./'))
        .pipe(
        notify({
            title: 'compiled!',
            message: new Date(),
            sound: 'Pop',
        })
    );
}


// 画像圧縮
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");
const imgImagemin = () => {
    return src(srcPath.img)
    .pipe(imagemin([
        imageminSvgo({plugins: [{removeViewbox: false}]})
        ],
        {
            verbose: true
        }
    ))
    .pipe(dest(destPath.img))
}
const webp = require('gulp-webp');

const imgWebp = () => {
    return src(srcPath.img)
    .pipe(webp({
        quality: 60,
        method: 6
    }))
    .pipe(dest(destPath.img));
}

// ファイルの変更を検知
const watchFiles = () => {
    watch(srcPath.css, series(cssSass, browserSyncReload))
    watch(srcPath.img, series(imgWebp, browserSyncReload))
    watch(srcPath.css, series(cssMin, browserSyncReload))
    watch(srcPath.html, series(browserSyncReload))
}

// 画像だけ削除
const del = require('del');
const delPath = {
    img: './images/',
}
const clean = (done) => {
    del(delPath.img, { force: true, });
    done();
};


// npx gulpで出力する内容
exports.default = series(series(clean, cssSass, imgWebp, cssMin), parallel(watchFiles, browserSyncFunc));
