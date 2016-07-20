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