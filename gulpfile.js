const gulp = require('gulp');
const ghPages = require('gulp-gh-pages');
const rename = require('gulp-rename');
 
const options = {
    remoteUrl: 'https://github.com/charlocharlie/mkwii-igt-calc.git',
    dest: '.',
}

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(rename(function (path) {
        let dirnameAry = path.dirname.split('\\');
        dirnameAry.splice(0, 1);
        path.dirname = dirnameAry.join('\\');
        console.log(path.dirname);
        return path;
    }))
    .pipe(ghPages(options));
});