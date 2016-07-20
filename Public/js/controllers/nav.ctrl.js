myApp.controller('navController', ['$rootScope','$scope', 'Authentication','$window','$location','taskService',
  function($rootScope,$scope, Authentication, $window, $location,taskService) {
  $scope.message = "Success!!!";

  //to change the nav elements state
  $rootScope.currentUser = $window.localStorage.Auth || '';


  $scope.searchTasks = function(q){
  	taskService.search(q);
  }//search using description

  $scope.logout = function() {
  	console.log('i am called');
  	console.log($rootScope.currentUser);
  	$rootScope.currentUser = '';
    Authentication.logout();
  }; //logout
  
}]);