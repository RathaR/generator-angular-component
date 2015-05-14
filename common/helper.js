var file = require('file');
var _ = require('lodash');
var path = require('path');

module.exports = function (config) {

  var resolveSourceRoot = function (appRoot) {
    var sourceRoot;
    file.walkSync(appRoot, function (dirPath, _dirs, files) {
      if (dirPath.indexOf('node_modules') > -1) {
        return;
      }
      if (_.contains(files, 'app.js')) {
        sourceRoot = dirPath.replace(appRoot, '').substring(1);
      }
    });
    return sourceRoot;
  };

  var getDirs = function (path) {
    var dirs = [];
    file.walkSync(path, function (dirPath, _dirs, files) {
      if (dirPath.replace(path, "").substr(1).indexOf('\\') == -1) {
        dirs.push(dirPath.replace(path, "").substr(1));
      } else return;
    });
    return dirs;
  };

  var resolveTestRoot = function (appRoot) {
    var testRoot;
    file.walkSync(appRoot, function (dirPath, _dirs, files) {
      if (dirPath.indexOf('node_modules') > -1) {
        return;
      }
      if (_.last(dirPath.split('\\')) == 'test' || _.last(dirPath.split('\\')) == 'tests') {
        testRoot = dirPath.replace(appRoot, '').substring(1);
      }
    });

    return testRoot;
  };

  var getTestRoot = function (appRoot) {
    var testRoot = config.get('test-root');
    if (_.isUndefined(testRoot)) {
      testRoot = resolveTestRoot(appRoot);
      config.set('test-root', testRoot);
    }
    return testRoot;
  };

  var getSourceRoot = function (appRoot) {
    var sourceRoot = config.get('source-root');
    if (_.isUndefined(sourceRoot)) {
      sourceRoot = resolveSourceRoot(appRoot);
      config.set('source-root', sourceRoot);
    }
    return sourceRoot;
  };

  var normalizeComponentPath = function (_root, _path, log) {
    _root = _root.split('\\');
    _path = _path.split('\\');
    var intersection = _.intersection(_root, _path);
    if (_.intersection(_root, _path).length) {
      var tmp = _.filter(_path, function (element) {
        return !_.contains(intersection, element);
      });
    }
    return path.join.apply(null, tmp);
  };

  this.getSourceRoot = getSourceRoot;
  this.getTestRoot = getTestRoot;
  this.normalizeComponentPath = normalizeComponentPath;
  this.getDirs = getDirs;
};
