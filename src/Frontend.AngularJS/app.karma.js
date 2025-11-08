// Definición mínima del módulo/ctrl para pruebas unitarias en Karma
angular.module('app', [])
  .controller('ItemsController', function($scope) {
    const vm = this;
    vm.items = [];
  });
