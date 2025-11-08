import axios from 'axios';

// Si corres con docker compose, VITE_API_BASE será http://api:8080
// En dev local usará http://localhost:5080
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5080' });

angular.module('app', [])
  .service('ItemService', function($q) {
    this.list = (page=1, pageSize=10) =>
      $q.when(API.get(`/api/items?page=${page}&pageSize=${pageSize}`)).then(r => r.data);
    this.add  = (item) =>
      $q.when(API.post('/api/items', item)).then(r => r.data);
    this.del  = (id) =>
      $q.when(API.delete(`/api/items/${id}`)).then(r => r.status);
  })
  .controller('ItemsController', function($scope, ItemService) {
    const vm = this;
    vm.items = [];
    vm.page = 1;
    vm.pageSize = 10;
    vm.total = 0;
    vm.newName = '';
    vm.loading = false;
    vm.error = '';

    vm.load = async() => {
      vm.loading = true; vm.error = '';
      try {
        const res = await ItemService.list(vm.page, vm.pageSize);
        vm.items = res.items;
        vm.total = res.totalCount;
      } catch (e) {
        vm.error = 'No se pudo cargar la lista.';
      } finally {
        vm.loading = false;
        $scope.$applyAsync();
      }
    };

    vm.add = async () => {
      if (!vm.newName) return;
      vm.loading = true; vm.error = '';
      try {
        await ItemService.add({ name: vm.newName, status: 'new' });
        vm.newName = '';
        await vm.load();
      } catch {
        vm.error = 'No se pudo crear el item.';
      } finally {
        vm.loading = false;
        $scope.$applyAsync();
      }
    };

    vm.remove = async (id) => {
      vm.loading = true; vm.error = '';
      try {
        await ItemService.del(id);
        await vm.load();
      } catch {
        vm.error = 'No se pudo eliminar el item.';
      } finally {
        vm.loading = false;
        $scope.$applyAsync();
      }
    };

    vm.next = async () => { vm.page++; await vm.load(); };
    vm.prev = async () => { vm.page = Math.max(1, vm.page - 1); await vm.load(); };

    vm.load();
  });
