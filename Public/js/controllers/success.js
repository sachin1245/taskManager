myApp.controller('SuccessController', ['$scope', 'Authentication','$http', 'taskService',
  function($scope, Authentication, $http, taskService) {
  

  $scope.logout = function() {
    Authentication.logout();
  }; //logout

  $scope.todos;

  
  $http.get("http://localhost:3000/todos").then(function(response){
            $scope.todos = response.data;
            
            console.log($scope.todos);
    },function(e){
            console.log('something went wrong');
  });


  $scope.editTask = function(taskId){
    console.log(taskId);
  }
 
 $scope.deleteTask = function(taskId){
    $http.delete("http://localhost:3000/todos/" + taskId).then(function(){
      console.log('Task Deleted');
      getTodos();
    },function(e){
      console.log('something went wrong')
    })
 }

  $scope.newTask = function(task){
    // var task = taskService.newTask(task);
    // console.log(task);

    $http.post('http://localhost:3000/todos',task).then(function(data){
          console.log(data);
        $location.path('/success');
       },function(e){
          console.log('something went wrong');
    })

  }

  
}]);
