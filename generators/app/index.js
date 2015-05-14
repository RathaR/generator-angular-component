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
    var generator = this;
    var helper = generator.helper = new Helper(generator.config);
    var destPath = generator.destPath = generator.destinationPath();
    this.appSourceRoot = helper.getSourceRoot(destPath);
    this.testRoot = helper.getTestRoot(destPath);
  },
  prompting: function () {
    var helper = new Helper(this.config);
    var done = this.async();
    var generator = this;

    var types = ['factory'];
    var componentTypePrompt = {
      type: 'list',
      name: 'type',
      message: 'Select type:',
      choices: types,
      default: 'factory'
    };

    var componentTypeSelectHandler = function (props) {
      var selectedType = generator.type = props[componentTypePrompt.name];
      generator.log('Type: ' + chalk.bold.yellow(selectedType));

      var componentNamePrompt = {
        type: 'input',
        name: 'componentName',
        message: 'You component name: ',
        default: selectedType + '.js'
      };
      var componentNameInputHandler = function (props) {
        generator.componentName = props[componentNamePrompt.name];
        generator.componentName = generator.componentName.replace('.js', '');
        askComponentPath(generator.appSourceRoot);
      };

      generator.prompt(componentNamePrompt, componentNameInputHandler);
    };

    generator.prompt(componentTypePrompt, componentTypeSelectHandler);

    function askComponentPath(currentPath) {
      var choices = helper.getDirs(currentPath);
      var directorySelectPrompt = {
        type: 'list',
        name: 'component',
        message: 'Specify directory: ',
        choices: choices
      };
      var directorySelectHandler = function (props) {
        var dir = props[directorySelectPrompt.name];
        var choices = helper.getDirs(path.join(currentPath, dir));
        generator.componentPath = currentPath.replace(generator.appSourceRoot, '');
        generator.componentPath = path.join(generator.componentPath, dir);
        generator.moduleName = dir ? dir : _.last(currentPath.split('\\'));
        if (dir === '' || choices.length <= 1) {
          generator.componentPath = path.join(generator.componentPath, generator.componentName + '.js');
          generator._path = [generator.destPath, generator.appSourceRoot, generator.componentPath];

          generator.log('Destination path: ' + chalk.bold.yellow(generator.destPath));
          generator.log('App source root path: ' + chalk.bold.yellow(generator.appSourceRoot));
          generator.log('App test root path: ' + chalk.bold.yellow(generator.testRoot));
          generator.log('Component name: ' + chalk.bold.yellow(generator.componentName));
          generator.log('Component path: ' + chalk.bold.yellow(generator.componentPath));
          generator.log('Component module: ' + chalk.bold.yellow(generator.moduleName));
          done();
        } else {
          askComponentPath(path.join(currentPath, dir));
        }
      };
      generator.prompt(directorySelectPrompt, directorySelectHandler);
    }
  },

  writing: {
    projectFiles: function () {
      var destPath = path.join.apply(null, this._path);
      this.template(path.join('..', '..', this.type, 'templates', this.type + '.js.tpl'), destPath);
    },
    specFiles: function () {
      this.template(path.join('..', '..', this.type, 'templates', this.type + 'Spec.js.tpl'),
        path.join(this.testRoot, this.componentPath.replace('.js', 'Spec.js')));
    }
  }
  //
  //install: function () {
  //  this.installDependencies();
  //}
});
