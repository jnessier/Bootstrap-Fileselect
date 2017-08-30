var gulp = require('gulp'),
        fs = require('fs'),
        util = require('gulp-util'),
        rename = require('gulp-rename'),
        uglify = require('gulp-uglify-es').default,
        injectString = require('gulp-inject-string'),
        runSequence = require('run-sequence');

var pjson = require('./package.json');

var sourceHeader = fs
        .readFileSync('./src/source-header.txt', 'utf8')
        .replace('{VERSION}', pjson.version)
        .replace('{YEAR}', new Date().getFullYear());

gulp.task('js:build', function (cb) {
    return gulp.src(['./src/bootstrap-fileselect.js'])
            .pipe(injectString.prepend(sourceHeader + '\n'))
            .pipe(gulp.dest('./dist'));
});

gulp.task('js:minify', function (cb) {
    return gulp.src(['./src/bootstrap-fileselect.js'])
            .pipe(uglify().on('error', util.log))
            .pipe(rename({suffix: '.min'}))
            .pipe(injectString.prepend(sourceHeader + '\n'))
            .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
    gulp.watch(['./src/bootstrap-fileselect.js'], function () {
        runSequence('js:build', 'js:minify');
    });
});
