let gulp = require('gulp'),
    fs = require('fs'),
    terser = require('gulp-terser'),
    rename = require('gulp-rename'),
    injectString = require('gulp-inject-string'),
    concat = require('gulp-concat'),
    replace = require('gulp-replace');

let package = require('./package.json');

let sourceHeader = fs
    .readFileSync(package.buildOpts.common.sourceHeader, 'utf8')
    .replace('{VERSION}', package.version)
    .replace('{YEAR}', (new Date()).getFullYear().toString())
    .replace('{AUTHOR}', package.author);

gulp.task('js:build', function () {
    let result = gulp.src(package.buildOpts.jsBuild.src);

    if (Array.isArray(package.buildOpts.jsBuild.src)) {
        result = result.pipe(concat(package.buildOpts.jsBuild.concatName));
    }

    return result
            .pipe(injectString.prepend(sourceHeader + '\n'))
            .pipe(gulp.dest(package.buildOpts.jsBuild.dest));
});

gulp.task('js:minify', function () {
    return gulp.src(package.buildOpts.jsMinify.src)
        .pipe(terser({
            output: {
                comments: false
            }
        }))
        .pipe(rename({
            suffix: package.buildOpts.jsMinify.renameSuffix
        }))
        .pipe(replace(/\r?\n|\r/g, ''))
        .pipe(injectString.prepend(sourceHeader + '\n'))
        .pipe(gulp.dest(package.buildOpts.jsMinify.dest));
});

gulp.task('js:rebuild', gulp.series('js:build', 'js:minify'));
gulp.task('src:rebuild', gulp.series('js:rebuild'));

gulp.task('src:watch', function () {
    gulp.watch(package.buildOpts.srcWatch.path, gulp.series('js:rebuild'));
});

