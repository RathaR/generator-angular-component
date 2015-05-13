'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var file = require('file');
var _ = require('lodash');
var path = require('path');
var pathResolver = require('../../common/helper');

var FactoryGenerator = module.exports = yeoman.generators.NamedBase.extend({
  prompting: function () {
    var done = this.async();
    var that = this;
    this.log(yosay(
      'Welcome to the superb ' + chalk.red('Component:factory') + ' generator!'
    ));
    var destPath = this.destinationPath();
    var sourceRoot = that.config.get('source-root');
    if (_.isUndefined(sourceRoot)) {
      sourceRoot = pathResolver.resolveSourceRoot(destPath);
      that.config.set('source-root', sourceRoot);
    }
    that.type = 'factory';
    that.destPath = that.name;
    done();
  },

  writing: {
    projectFiles: function () {
      this.moduleName = 'myModule';
      var fileName = _.last(this.destPath.split('\\'));
      this.componentName = fileName.substring(0, fileName.lastIndexOf('.'));
      this.template(path.join(this.type, this.type + '.js.tpl'), this.destPath);
    },
    testFiles: function () {

    }
  }
});
