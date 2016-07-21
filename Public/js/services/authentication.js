myApp.factory('Authentication', 
  ['$rootScope', '$location', '$window','$http','AuthTokenFactory','taskService',
  function($rootScope,$location, $window,$http,AuthTokenFactory,taskService) {
 
    return {
    
    login: function(user) {
       
      $http.post('users/login',{
          email: user.email,
          password: user.password
      }).then(function(response){
          AuthTokenFactory.setToken(response.data.token);
          $location.path('/tasks'); 
          $rootScope.currentUser = response.data;
      }).catch(function(error){
          $rootScope.message = "Unable to Login,Check the details";
      })
    }, //login

    logout: function() {
      $rootScope.currentUser = '';
      $rootScope.tasks = '';
      $http.delete('/users/login').then(function(){
          return AuthTokenFactory.setToken();
      },function(e){
          console.log('Something went wrong');
      })
    }, //logout

    requireAuth: function() {
      return AuthTokenFactory.getToken();
    }, //require Authentication

    register: function(user) {

      $http.post('/users',{
          email: user.email,
          password: user.password
      }).then(function(response){
           $rootScope.message = " Thanks for registering";
           $location.path('/login');

      }).catch(function(res){
          if(res.data.errors[0].message === 'email must be unique'){
            $rootScope.message = 'User with this email is already registerd';
          }else if(res.data.errors[0].message === 'Validation len failed' && res.data.errors[0].path === 'password'){
             $rootScope.message = 'Password length should be minimum 6 characters';  
          }else{
            $rootScope.message = res.data;
          }
         
      });

    } // register
  };

}]); //factory



