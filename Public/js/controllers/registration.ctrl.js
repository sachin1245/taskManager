myApp.controller('RegistrationController',
  ['$rootScope','$scope', 'Authentication',
  function($rootScope,$scope, Authentication) {
  
  $scope.login = function() {
    Authentication.login($scope.user);
  }; //login

  $scope.logout = function() {
    Authentication.logout();
  }; //logout

  $scope.register = function() {
    Authentication.register($scope.user);
  }; // register

  
}]); // Controller