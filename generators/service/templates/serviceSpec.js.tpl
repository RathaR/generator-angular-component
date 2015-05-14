'use strict';

describe('Service: <%= componentName %>', function () {

  // load the service's module
  beforeEach(module('<%= moduleName %>'));

  // instantiate service
  var <%= componentName %>;
  beforeEach(inject(function (_<%= componentName %>_) {
    <%= componentName %> = _<%= componentName %>_;
  }));

  it('should do something', function () {
    expect(!!<%= componentName %>).toBe(true);
  });

});
