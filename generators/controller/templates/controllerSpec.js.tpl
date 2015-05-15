'use strict';

describe('Controller: <%= componentName %>', function () {

  // load the controller's module
  beforeEach(module('<%= moduleName %>'));

  var ControllerJsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ControllerJsCtrl = $controller(' <%= componentName %>', {
      $scope: scope
    });
  }));

  it('should know meaning of life', function () {
    expect(scope.meaningOfLife).toBe(42);
  });
});
