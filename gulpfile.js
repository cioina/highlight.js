//Run Gulp locally: node node_modules\gulp\bin\gulp.js
const gulp = require('gulp');
const path = require('path');
const spawn = require('child_process').spawn;

async function clean(directory) {
    const del = await import('del');
    del.deleteSync(directory);
}
  
gulp.task('hjs', function (done) {
    const opts = {
        cwd: __dirname + '/node_modules/highlight.js'
    }

    const build = spawn('node', ['tools/build.js', '-t', 'node'], opts);
    build.stdout.pipe(process.stdout);
    build.stderr.pipe(process.stderr);

    build.on('close', function (code) {
        if (0 !== code){
            throw new Error('node tools/build.js exited with ' + code)
        }else{
            gulp.src('node_modules/highlight.js/build/**/*')
                .pipe(gulp.dest('dist'));
        }

        done();
    });
});

gulp.task('clean', function (done) {
    const dir = path.join(__dirname, 'dist');
    clean([dir]);
    console.log(`Deleted: ${dir}`);

    done();
  });

gulp.task('default', gulp.series('clean', 'hjs'));

