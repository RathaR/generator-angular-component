'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var file = require('file');
var _ = require('lodash');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();
    var that = this;
    this.log(yosay(
      'Welcome to the superb ' + chalk.red('Component') + ' generator!'
    ));
    var destPath = this.destinationPath();
    var resolveSourceRoot = function (appRoot) {
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
    var sourceRoot = that.config.get('source-root');
    if (_.isUndefined(sourceRoot)) {
      sourceRoot = resolveSourceRoot(destPath);
      that.config.set('source-root', sourceRoot);
    }
    that.log('Resolve project source root as: ' + that.config.get('source-root'));
    var choices = getDirs(sourceRoot);
    var _path = [sourceRoot];
    var _done = function () {
      _path.push(that.componentName);
      that.log('Resulted path: ' + path.join.apply(null, _path));
      that._path = _path;
      done();
    };

    var types = ['service', 'factory', 'provider', 'directive', 'filter', 'value'];
    that.prompt({
      type: 'list',
      name: 'type',
      message: 'Select type:',
      choices: types,
      default: 'service'
    }, function (props) {
      that.type = props.type;
      that.prompt({
        type: 'input',
        name: 'componentName',
        message: 'You component name: ',
        default: that.type + '.js'
      }, function (props) {
        that.componentName = props.componentName;
        ask();
      });
    });

    function ask() {
      that.prompt({
        type: 'list',
        name: 'component',
        message: 'Specify path',
        choices: choices
      }, function (props) {
        if (props.component === '') {
          _done();
        } else {
          _path.push(props.component);
          choices = getDirs(path.join.apply(null, _path));
          if (choices.length > 1) {
            ask();
          } else {
            _done();
          }
        }
      });
    }
  },

  writing: {
    projectFiles: function () {
      this.moduleName = 'myModule';
      var destPath = path.join.apply(null, this._path);
      this.template(path.join(this.type, this.type + '.js.tpl'), destPath);
    },
    testFiles: function() {

    }
  }
  //
  //install: function () {
  //  this.installDependencies();
  //}
});
