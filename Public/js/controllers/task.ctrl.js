myApp.controller('taskController',['$http','$scope','$rootScope','$location','$routeParams','$route','taskService', 
	function($http,$scope,$rootScope,$location,$routeParams,$route,taskService){




	$scope.tasks = {};

	$scope.searchedTasks = taskService.search();

	 $http.get("http://localhost:3000/tasks").then(function(response){
            $scope.tasks = response.data;
     },function(e){
            console.log('something went wrong');
     });

	$scope.editTask = function(task){
		taskService.changed(task);
	}

	$scope.newTask = function(task){
		taskService.newTask(task);
	}


	$scope.updateTask = function(task,taskId){
		taskService.updateTask(task,taskId);
	}

	$scope.deleteTask = function(taskId){
		taskService.deleteTask(taskId);
	}
}])