const gulp = require('gulp');
const ghPages = require('gulp-gh-pages');
const rename = require('gulp-rename');
 
const options = {
    remoteUrl: 'https://github.com/charlocharlie/charlocharlie.github.io.git',
}

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(rename(function (path) {
        let dirnameAry = path.dirname.split('\\');
        dirnameAry.splice(1, 0, 'mkwii-igt-calc');
        path.dirname = dirnameAry.join('\\');
        console.log(path.dirname);
        return path;
    }))
    .pipe(ghPages(options));
});