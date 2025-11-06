import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5080' });

angular.module('app', [])
  .service('ItemService', function($q) {
    this.list = (page=1, pageSize=10) => $q.when(API.get(`/api/items?page=${page}&pageSize=${pageSize}`)).then(r => r.data);
    this.add  = (item) => $q.when(API.post('/api/items', item)).then(r => r.data);
    this.del  = (id) => $q.when(API.delete(`/api/items/${id}`)).then(r => r.status);
  })
  .controller('ItemsController', function($scope, ItemService) {
    const vm = this;
    vm.items = [];
    vm.newName = '';

    vm.load = async() => {
      const res = await ItemService.list(1, 10);
      vm.items = res.items;
      $scope.$applyAsync();
    };

    vm.add = async () => {
      if (!vm.newName) return;
      await ItemService.add({ name: vm.newName, status: 'new' });
      vm.newName = '';
      await vm.load();
    };

    vm.remove = async (id) => {
      await ItemService.del(id);
      await vm.load();
    };

    vm.load();
  });