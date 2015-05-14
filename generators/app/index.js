'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var file = require('file');
var _ = require('lodash');
var path = require('path');
var Helper = require('../../common/helper');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    var helper = this.helper = new Helper(this.config);
    var destPath = this.destPath = this.destinationPath();
    this.appSourceRoot = helper.getSourceRoot(destPath, this.log);
    this.testRoot = helper.getTestRoot(destPath);

    this.componentPath = this.name;
    this.componentPath = helper.normalizeComponentPath(this.appSourceRoot, this.componentPath, this.log);
    this.componentName = _.last(this.componentPath.split('\\'));
    this.componentName = this.componentName.replace('.js', '');
    var _path = path.join(this.appSourceRoot, this.componentPath).split('\\');
    this.moduleName = _path[_path.length - 2];
    this.log('Destination path: ' + chalk.bold.yellow(this.destPath));
    this.log('App source root path: ' + chalk.bold.yellow(this.appSourceRoot));
    this.log('App test root path: ' + chalk.bold.yellow(this.testRoot));
    //this.log('Module name: ' + chalk.bold.yellow(this.moduleName));
    //this.log('Component name: ' + chalk.bold.yellow(this.componentName));
  },
  prompting: function () {
    var helper = new Helper(this.config);
    var done = this.async();
    var that = this;

    var choices = helper.getDirs(this.sourceRoot);
    var _path = [this.sourceRoot];

    var types = ['service', 'factory', 'provider', 'directive', 'filter', 'value'];
    var componentTypePrompt = {
      type: 'list',
      name: 'type',
      message: 'Select type:',
      choices: types,
      default: 'service'
    };
    var componentNamePrompt = {
      type: 'input',
      name: 'componentName',
      message: 'You component name: ',
      default: that.type + '.js'
    };
    var componentNameInputHandler = function (props) {
      that.componentName = props[componentNamePrompt.name];
      askComponentPath(this.appSourceRoot);
    };
    var componentTypeSelectHandler = function (props) {
      var selectedType = that.type = props[componentTypePrompt.name];
      this.log('Type: ' + chalk.bold.yellow(this.type));
      that.prompt(componentNamePrompt, componentNameInputHandler);
    };

    that.prompt(componentTypePrompt, componentTypeSelectHandler);

    function askComponentPath(currentPath) {
      var directorySelectPrompt = {
        type: 'list',
        name: 'component',
        message: 'Specify path',
        choices: helper.getDirs(currentPath)
      };
      var directorySelectHandler = function (props) {
        var dir = props[directorySelectPrompt.name];
        if (dir === '' || choices.length <= 1) {
          this.componentPath = currentPath;
          this.log('Component path: ' + chalk.bold.yellow(this.componentPath));
          done();
        } else {
          askComponentPath(path.join(currentPath, dir));
        }
      };
      that.prompt(directorySelectPrompt, directorySelectHandler);
    }
  },

  writing: {
    projectFiles: function () {
      var destPath = path.join.apply(null, this._path);
      this.template(path.join(this.type, this.type + '.js.tpl'), destPath);
    },
    testFiles: function () {

    }
  }
  //
  //install: function () {
  //  this.installDependencies();
  //}
});
