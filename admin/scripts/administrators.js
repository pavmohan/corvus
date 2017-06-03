var app = angular.module('adminApp', []);

app.controller('adminCtrl', function($scope, $http) {

  $scope.getAdmins = function(){
    var res = $http.get('/admins', {});
    res.success(function(data, status, headers, config) {
      $scope.admins = data;
    });
    res.error(function(data, status, headers, config) {
      console.log("Error getting");
    });
  };
  $scope.admins = $scope.getAdmins()

  $scope.adminData = {};
  $scope.selected = {};

  $scope.addAdmin = function(){

    $scope.admins.push({
      name : $scope.name,
      email : $scope.email,
      displayName : $scope.displayName
    });
    console.log($scope.admins);
  };


  $scope.addAdmintoDB = function(){

    $scope.adminData = {
      name : $scope.name,
      email : $scope.email,
      displayName : $scope.displayName
    };

    var res = $http.post('/admins/create',
    {
      name : $scope.name,
      email : $scope.email,
      displayName : $scope.displayName
    });
    res.success(function(data, status, headers, config) {
      console.log("admin added");
      $scope.getAdmins();
    });
    res.error(function(data, status, headers, config) {
      console.log("admin adding failed");
    });
  };

  $scope.deleteAdmin = function(admin){
    // TODO
  };


  $scope.getAdminTemplate = function (admin) {
        if (admin.id === $scope.selected.id){
      return 'edit';
    }
        else return 'display';
    };

  $scope.reset = function () {
        $scope.selected = {};
        $scope.getAdmins();
    };

  $scope.editAdmin = function (admin) {
        $scope.selected = angular.copy(admin);
    };

  $scope.updateAdmin = function(admin) {
    $scope.updateAdminURL = '/admins/' + admin.id + '/edit'
    var res = $http.post($scope.updateAdminURL,
    {
      name : $scope.name,
      email : $scope.email,
      displayName : $scope.displayName
    });
    res.success(function(data, status, headers, config) {
      console.log(data);
      $scope.reset();
      $scope.getAdmins();
    });
    res.error(function(data, status, headers, config) {
      console.log("Error updating");
    });
  };
});
