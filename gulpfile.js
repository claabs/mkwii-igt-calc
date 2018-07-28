const gulp = require('gulp');
const ghPages = require('gulp-gh-pages');
 
const options = {
    remoteUrl: 'https://github.com/charlocharlie/mkwii-igt-calc.git',
    dest: '.',
}

gulp.task('deploy', function() {
  return gulp.src('./build/es6-unbundled/**/*')
    .pipe(ghPages(options));
});