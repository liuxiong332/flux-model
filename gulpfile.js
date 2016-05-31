var spawn = require('child_process').spawn;
var path = require('path');
var gulp = require('gulp');
var babel = require('gulp-babel');
var mocha = require('gulp-mocha');
require("babel-register");

function runNodeCmd(cmdName, args, callback) {
  if (!Array.isArray(args)) {
    callback = args;
    args = [];
  }
  if (process.platform === 'win32') {
    cmdName += '.cmd';
  }
  var cmdPath = path.resolve(__dirname, 'node_modules/.bin/', cmdName);
  var task = spawn(cmdPath, args || [], { cwd: __dirname });
  task.on('error', function(err) { callback(err); });
  task.on('exit', function() { callback(); });
}

gulp.task('test', function() {
  return gulp.src(['tests/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
    }));
});
