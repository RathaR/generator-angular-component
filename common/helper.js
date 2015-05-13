var file = require('file');
var _ = require('lodash');
module.exports = {
  resolveSourceRoot: function (appRoot) {
    var sourceRoot;
    file.walkSync(appRoot, function (dirPath, _dirs, files) {
      if (dirPath.indexOf('node_modules') > -1) {
        return;
      }
      if (_.contains(files, 'app.js')) {
        sourceRoot = dirPath.replace(destPath, '').substring(1);
      }
    });
    return sourceRoot;
  },
  getDirs: function (path) {
    var dirs = [];
    file.walkSync(path, function (dirPath, _dirs, files) {
      if (dirPath.replace(path, "").substr(1).indexOf('\\') == -1) {
        dirs.push(dirPath.replace(path, "").substr(1));
      } else return;
    });
    return dirs;
  }
};
