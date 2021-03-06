'use strict';

angular.module('<%= moduleName %>')
  .service('<%= componentName %>', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
