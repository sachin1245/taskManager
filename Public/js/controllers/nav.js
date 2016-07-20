myApp.controller('navController', ['$rootScope','$scope', 'Authentication','$window','$location','taskService',
  function($rootScope,$scope, Authentication, $window, $location,taskService) {
  $scope.message = "Success!!!";


  $rootScope.currentUser = $window.localStorage.Auth || '';

  console.log($scope.currentUser);

  $scope.searchTasks = function(q){
  	taskService.search(q);
  }

  $scope.logout = function() {
  	console.log('i am called');
  	console.log($rootScope.currentUser);
  	$rootScope.currentUser = '';
    Authentication.logout();
  }; //logout
  
}]);