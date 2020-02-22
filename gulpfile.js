let gulp = require('gulp'),
    fs = require('fs'),
    terser = require('gulp-terser'),
    rename = require('gulp-rename'),
    injectString = require('gulp-inject-string'),
    concat = require('gulp-concat'),
    replace = require('gulp-replace');

let package = require('./package.json'),
    buildConfig = package.buildConfig;

let sourceHeader = fs.readFileSync(buildConfig.common.sourceHeader, 'utf8')
    .replace('{VERSION}', package.version)
    .replace('{YEAR}', (new Date()).getFullYear().toString())
    .replace('{AUTHOR}', package.author);

gulp.task('js:build', function () {
    let result = gulp.src(buildConfig.jsBuild.src);

    if (Array.isArray(buildConfig.jsBuild.src)) {
        result = result.pipe(concat(buildConfig.jsBuild.concatName));
    }

    return result
        .pipe(injectString.prepend(sourceHeader + '\n'))
        .pipe(gulp.dest(buildConfig.jsBuild.dest));
});

gulp.task('js:minify', function () {
    return gulp.src(buildConfig.jsMinify.src)
        .pipe(terser({
            output: {
                comments: false
            }
        }))
        .pipe(rename({
            suffix: buildConfig.jsMinify.renameSuffix
        }))
        .pipe(replace(/\r?\n|\r/g, ''))
        .pipe(injectString.prepend(sourceHeader + '\n'))
        .pipe(gulp.dest(buildConfig.jsMinify.dest));
});

gulp.task('js:rebuild', gulp.series('js:build', 'js:minify'));
gulp.task('src:rebuild', gulp.series('js:rebuild'));

gulp.task('src:watch', function () {
    gulp.watch(buildConfig.srcWatch.path, gulp.series('js:rebuild'));
});

