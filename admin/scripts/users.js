var app = angular.module('adminApp', []);

app.controller('userCtrl', function($scope, $http) {

  $scope.getUsers = function(){
    var res = $http.get('/users', {});
    res.success(function(data, status, headers, config) {
      $scope.users = data;
    });
    res.error(function(data, status, headers, config) {
      console.log("Error getting");
    });
  };
  $scope.users = $scope.getUsers()

  $scope.userData = {};
  $scope.selected = {};

  $scope.addUser = function(){
    $scope.users.push({
      name : $scope.name,
      email : $scope.email,
      displayName : $scope.displayName
    });
    console.log($scope.users);
  };


  $scope.addUsertoDB = function(){
    var res = $http.post('/users/create',
    {
      name : $scope.name,
      email : $scope.email,
      displayName : $scope.displayName
    });
    res.success(function(data, status, headers, config) {
      console.log("user added");
      $scope.getUsers();
    });
    res.error(function(data, status, headers, config) {
      console.log("user adding failed");
    });
  };

  $scope.deleteUser = function(user){
    // TODO
  };

  $scope.getTemplate = function (user) {
        if (user.id === $scope.selected.id){
      return 'edit';
    }
        else return 'display';
    };

  $scope.reset = function () {
        $scope.selected = {};
        $scope.getUsers();
    };

  $scope.editUser = function (user) {
        $scope.selected = angular.copy(user);
    };

  $scope.updateUser = function(user) {
    $scope.updateUserURL = '/users/' + user.id + '/edit'
    var res = $http.post($scope.updateUserURL,
    {
      name : $scope.name,
      email : $scope.email,
      displayName : $scope.displayName
    });
    res.success(function(data, status, headers, config) {
      console.log(data);
      $scope.reset();
      $scope.getUsers();
    });
    res.error(function(data, status, headers, config) {
      console.log("Error updating");
    });
  };
});
