myApp.service('Auth', ['$rootScope','$location','$window',function($rootScope,$location,$window) {

    var store = $window.localStorage;
    var key = 'auth-token'
  
    return {
        getToken = getToken,
        setToken = setToken
    };
    
    
    function getToken(){
        return store.getItem(key);
    }
    
    function setToken(token){
        if(token){
            store.setItem(key,token);
        }else{
            sotre.removeItem(key);
        }
    }

}]); //factory


myApp.service('Auth', ['$rootScope','$location','$window',function($rootScope,$location,$window) {
    'use strict';
    
    return {
        login: login
    };
    
    function login(username,password){
        return $http.post(API_URL + '/login',{
            username: username,
            password: password
        }).then(function success(response){
            Auth.setToken(response.data.token);
            return response;
        })
    }
    
}