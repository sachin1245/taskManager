myApp.factory('Authentication', 
  ['$rootScope', '$location', '$window','$http','AuthTokenFactory',
  function($rootScope,$location, $window,$http,AuthTokenFactory) {
 
    return {
    
    login: function(user) {
       
      $http.post('users/login',{
          email: user.email,
          password: user.password
      }).then(function(response){
          AuthTokenFactory.setToken(response.data.token);
          $rootScope.currentUser = response.data;   
          $location.path('/tasks'); 
      }).catch(function(error){
          $rootScope.message = "Unable to Login,Check the details";
      })
    }, //login

    logout: function() {
      
      console.log('i am in logout')
      $rootScope.currentUser = '';
      return AuthTokenFactory.setToken();
    }, //logout

    requireAuth: function() {
      return AuthTokenFactory.getToken();
    }, //require Authentication

    register: function(user) {

      $http.post('/users',{
          email: user.email,
          password: user.password
      }).then(function(response){
           console.log(response);
           $rootScope.message = " Thanks for registering";
           $location.path('/login');

      }).catch(function(res){
          console.log(res.data.errors[0]);
          if(res.data.errors[0].message === 'email must be unique'){
            $rootScope.message = 'User with this email is already registerd';
          }else if(res.data.errors[0].message === 'Validation len failed' && res.data.errors[0].path === 'password'){
             $rootScope.message = 'Password length should be minimum 6 characters';
             console.log($rootScope.message);    
          }else{
            $rootScope.message = res.data;
          }
         
      });

    } // register
  };

}]); //factory


myApp.factory('AuthTokenFactory', function AuthTokenFactory($window) {
    'use strict';

    var store = $window.localStorage;
    var key = 'Auth';

    return {
      getToken: getToken,
      setToken: setToken
    };

    function getToken() {
      return store.getItem(key);
    }

    function setToken(token) {
      if (token) {
        store.setItem(key, token);
      } else {
        console.log('i am in the remove token');
        store.removeItem(key);
      }
    }

  });

  myApp.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
    'use strict';
    return {
      request: addToken
    };

    function addToken(config) {
      var token = AuthTokenFactory.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Auth = token;
      }
      return config;
    }
  });
