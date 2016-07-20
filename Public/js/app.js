var myApp = angular.module('myApp',
  ['ngRoute', 'firebase'], function config($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });
  


myApp.run(['$rootScope', '$location',
  function($rootScope, $location) {
    $rootScope.$on('$routeChangeError',
      function(event, next, previous, error) {
        if (error=='AUTH_REQUIRED') {
          $rootScope.message = 'Sorry, you must log in to access that page';
          $location.path('/login');
        } // AUTH REQUIRED
      }); //event info
  }]); //run

myApp.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider.
    when('/login', {
      templateUrl: 'views/login.html',
      controller: 'RegistrationController'
    }).
    when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegistrationController'
    }).
    when('/tasks',{
      templateUrl: 'views/tasks.html',
      controller: 'taskController'
    }).
    when('/new',{
      templateUrl: 'views/newTask.html',
      controller: 'taskController'
    }).
    when('/edit',{
      templateUrl: 'views/editTask.html',
      controller: 'editTaskController'
    }).
    when('/searchTasks',{
      templateUrl: 'views/searchedTasks.html',
      controller: 'taskController'
    }).
    otherwise({
        redirectTo: '/login'
    });

   
}]);




