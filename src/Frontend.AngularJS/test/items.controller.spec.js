describe('ItemsController', function () {
  beforeEach(angular.mock.module('app'));
  let $controller, $rootScope;
  beforeEach(inject(function(_$controller_, _$rootScope_){
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  it('initializes with empty newName', function() {
    const $scope = $rootScope.$new();
    const vm = $controller('ItemsController', { $scope });
    expect(vm.newName).toBe('');
  });
});