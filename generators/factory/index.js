'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var file = require('file');
var _ = require('lodash');
var path = require('path');
var Helper = require('../../common/helper');
var FactoryGenerator = module.exports = yeoman.generators.NamedBase.extend({
  initializing: function () {
    var helper = this.helper = new Helper(this.config);
    var destPath = this.destPath = this.destinationPath();
    this.appSourceRoot = helper.getSourceRoot(destPath, this.log);
    this.testRoot = helper.getTestRoot(destPath);

    this.type = 'factory';
    this.componentPath = this.name;
    this.componentPath = helper.normalizeComponentPath(this.appSourceRoot, this.componentPath, this.log);
    this.componentName = _.last(this.componentPath.split('\\'));
    this.componentName = this.componentName.replace('.js', '');
    var _path = path.join(this.appSourceRoot, this.componentPath).split('\\');
    this.moduleName = _path[_path.length - 2];
    this.log('Destination path: ' + chalk.bold.yellow(this.destPath));
    this.log('App source root path: ' + chalk.bold.yellow(this.appSourceRoot));
    this.log('App test root path: ' + chalk.bold.yellow(this.testRoot));
    this.log('Type: ' + chalk.bold.yellow(this.type));
    this.log('Component path: ' + chalk.bold.yellow(this.componentPath));
    this.log('Module name: ' + chalk.bold.yellow(this.moduleName));
    this.log('Component name: ' + chalk.bold.yellow(this.componentName));
  },
  writing: {
    projectFiles: function () {
      this.template(path.join(this.type + '.js.tpl'), path.join(this.appSourceRoot, this.componentPath));
    },
    specFiles: function () {
      this.template(path.join(this.type + 'Spec.js.tpl'), path.join(this.testRoot, this.componentPath.replace('.js', 'Spec.js')));
    }
  }
});
