var gulp            = require('gulp'),
    util            = require('gulp-util'),
    del             = require('del'),
    sass            = require('gulp-sass'),
    prefixer        = require('gulp-autoprefixer'),
    rename          = require('gulp-rename'),
    changed         = require('gulp-changed'),
    minimizer       = require('gulp-imagemin'),
    size            = require('gulp-size'),
    webpack         = require('webpack-stream');

gulp.task('styles', function() {
    gulp.src('./src/scss/**/*.scss')
        .pipe(sass({
                includePaths: [
                    './node_modules/breakpoint-sass/stylesheets',
                    './node_modules/bourbon/app/assets/stylesheets',
                    // './node_modules/foundation-sites/scss/'
                ],
                style: 'uncompressed',
                quiet: true
            }).on('error', sass.logError))
        .pipe(prefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('../server/public/css'));
});

gulp.task('scripts', function() {
    return gulp.src('src/js/**/*.js')
        // .pipe(webpack())
        // .pipe(rename('app.js'))
        .pipe(gulp.dest('../server/public/js/'));
});

gulp.task('images', function() {
    return gulp.src('src/img/**')
        .pipe(changed('../server/public/img'))
        .pipe(minimizer({ progressive: true, interlaced: true }))
        .pipe(gulp.dest('../server/public/img'))
        .pipe(size({ title: 'images' }));
});

gulp.task('html', function() {
    gulp.src('./src/**/**/*.html')
        .pipe(gulp.dest('../server/public/'))
});



gulp.task('clean', function () {
    return del([
        './server/public/**/*'
    ], {force: true});
});

gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch('src/images/**/*', ['images']);
});

gulp.task('default', function() {
    gulp.start( 'clean', 'styles', 'scripts', 'images', 'html', 'watch');
});
