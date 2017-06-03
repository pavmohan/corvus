var app = angular.module('adminApp', []);

// http://www.technicaladvices.com/2012/12/18/the-easiest-way-to-check-empty-objects-in-javascript
function isEmpty(myObject) {
    for(var key in myObject) {
        if (myObject.hasOwnProperty(key)) {
            return false;
        }
    }

    return true;
}

app.controller('cheeseCtrl', function($scope, $http) {
  $scope.getCheeses = function(){
    var res = $http.get('/cheeses',
    {});
    res.success(function(data, status, headers, config) {
      $scope.cheeses = data;
    });
    res.error(function(data, status, headers, config) {
      console.log("Error Getting");
    });
  };

  $scope.cheeses = $scope.getCheeses();
  $scope.cheeseData = {};
  $scope.selected = {};

  $scope.addCheese = function(){
    $scope.cheeses.push({
      name : $scope.name,
      cheesemaker_id : $scope.cheesemaker_id
    });
    console.log($scope.cheeses);
  };

  $scope.addCheesetoDB = function(){
    var res = $http.post('/cheeses/create',
    {
      name : $scope.name,
      cheesemaker_id : $scope.cheesemaker_id
    });
    res.success(function(data, status, headers, config) {
      console.log("cheese added");
      $scope.getCheeses();
    });
    res.error(function(data, status, headers, config) {
      console.log("cheese adding failed");
    });
  };

  $scope.deleteCheese = function(cheese){
    // TODO
  };

  $scope.getCheeseTemplate = function (c) {
    if (!isEmpty($scope.selected.cheese)) {
      if (c.cheese.id === $scope.selected.cheese.id){
        return 'edit';
      }
      else return 'display';
    }

    else return 'display';
    };

  $scope.reset = function () {
        $scope.selected = {};
        $scope.getCheeses(); // TODO: make this more effecient
    };

  $scope.editCheese = function (cheese) {
        $scope.selected = angular.copy(cheese);
    };

  $scope.updateCheese = function(c) {
    console.log(c.cheese.name)
    $scope.updateURL = '/cheeses/' + c.cheese.id + '/edit'
    var res = $http.put($scope.updateURL,
    {
      "name" : c.cheese.name,
      "cheesemaker_id" : c.cheesemaker.id
    });
    res.success(function(data, status, headers, config) {
      console.log(data);
      $scope.reset();
      $scope.getCheeses();
    });
    res.error(function(data, status, headers, config) {
      console.log("Error updating");
    });
  };
});

app.controller('cheesemakerCtrl', function($scope, $http) {

  $scope.getCheesemakers = function(){

    var res = $http.get('/cheesemakers', {});
    res.success(function(data, status, headers, config) {
      $scope.cheesemakers = data;
    });
    res.error(function(data, status, headers, config) {
      console.log("Error Getting");
    });
  };

  $scope.cheesemakers = $scope.getCheesemakers();

  $scope.cheesemakerData = {};
  $scope.selected = {};

  $scope.addCheesemaker = function(){

    $scope.cheesemakers.push({
      name : $scope.name,
      location : $scope.location
    });
    console.log($scope.cheesemakers);
  };

  $scope.addCheesemakertoDB = function(){
    var res = $http.post('/cheesemakers/create',
    {
      name: $scope.cname,
      location: $scope.clocation
    });
    res.success(function(data, status, headers, config) {
      console.log("cheesemaker added");
      $scope.getCheesemakers();
    });
    res.error(function(data, status, headers, config) {
      console.log("cheesemaker adding failed");
    });
  };

  $scope.deleteCheesemaker = function(cheesemaker){
    //TODO
  };

  $scope.getCheesemakerTemplate = function (cheesemaker) {
        if (cheesemaker.id === $scope.selected.id){
      return 'edit';
    }
        else return 'display';
    };

  $scope.reset = function () {
        $scope.selected = {};
        $scope.getCheesemakers(); // TODO: make this more effecient
    };

  $scope.editCheesemaker = function (cheesemaker) {
        $scope.selected = angular.copy(cheesemaker);
    };

  $scope.updateCheesemaker = function(cheesemaker) {
    $scope.updateURL = '/cheesemakers/' + cheesemaker.id + '/edit'
    var res = $http.put($scope.updateURL,
    {
      name : cheesemaker.name,
      location : cheesemaker.location
    });
    res.success(function(data, status, headers, config) {
      console.log(data);
      $scope.reset();
      $scope.getCheesemakers();
    });
    res.error(function(data, status, headers, config) {
      console.log("Error updating");
    });
  };
});

app.controller('cheeseshopCtrl', function($scope, $http) {
  $scope.getCheeseshop = function(){
    var res = $http.post('/cheeseshops',{});
    res.success(function(data, status, headers, config) {
      $scope.employees = data;
    });
    res.error(function(data, status, headers, config) {
      console.log("Error Getting");
    });
  };
  $scope.cheeseshops = $scope.getCheeseshop()
  $scope.cheeseshopData = {};
  $scope.selected = {};

  $scope.addCheeseshop = function(){
    $scope.cheeseshop.push({
      name : $scope.name,
      phone : $scope.phone,
      street : $scope.street,
      city : $scope.city,
      state : $scope.state,
      zipCode : $scope.zipCode,
      country : $scope.country
    });
    console.log($scope.cheeseshops);
  };

  $scope.addCheeseshoptoDB = function(){
    $scope.cheeseshopData = {
      name : $scope.name,
      phone : $scope.phone,
      street : $scope.street,
      city : $scope.city,
      state : $scope.state,
      zipCode : $scope.zipCode,
      country : $scope.country
    };

    var res = $http.post('/cheeseshops/create',
    {
      name : $scope.name,
      phone : $scope.phone,
      street : $scope.street,
      city : $scope.city,
      state : $scope.state,
      zipCode : $scope.zipCode,
      country : $scope.country
    });
    res.success(function(data, status, headers, config) {
      console.log("cheeseshops added");
      $scope.getCheeseshops();
    });
    res.error(function(data, status, headers, config) {
      console.log("cheeshop adding failed");
    });
  };

  $scope.deleteCheeseshop = function(cheeseshop){
    // TODO
  };

  $scope.getCheeseshopTemplate = function (cheeseshop) {
        if (cheeseshop.id === $scope.selected.id){
      return 'edit';
    }
        else return 'display';
    };

  $scope.reset = function () {
        $scope.selected = {};
        $scope.getCheeseshops(); // TODO: make this more efficient
    };

  $scope.editCheeseshop = function (cheeseshop) {
        $scope.selected = angular.copy(cheeseshop);
    };

  $scope.updateCheeseshop = function(cheeseshop) {
    $scope.updateCheeseshopURL = '/cheeseshops/' + cheeseshop.id + '/edit'
    var res = $http.put($scope.updateCheeseshopURL,
    {
      name : $scope.name,
      phone : $scope.phone,
      street : $scope.street,
      city : $scope.city,
      state : $scope.state,
      zipCode : $scope.zipCode,
      country : $scope.country
    });
    res.success(function(data, status, headers, config) {
      console.log(data);
      $scope.reset();
      $scope.getCheeseshops();
    });
    res.error(function(data, status, headers, config) {
      console.log("Error updating");
    });
  };
});
