myApp.controller('taskController',['$http','$scope','$rootScope','$location','$routeParams','$route','taskService', 
	function($http,$scope,$rootScope,$location,$routeParams,$route,taskService){




	$scope.tasks = {};

	$scope.searchedTasks = taskService.search();

	 $http.get("http://localhost:3000/tasks").then(function(response){
            $scope.tasks = response.data;
     },function(e){
            console.log('something went wrong');
     });//loads all tasks initial login

	$scope.editTask = function(task){
		taskService.changed(task);
	}//editTask

	$scope.newTask = function(task){
		taskService.newTask(task);
	}//newTask


	$scope.updateTask = function(task,taskId){
		taskService.updateTask(task,taskId);
	}//updateTask

	$scope.deleteTask = function(taskId){
		taskService.deleteTask(taskId);
	}//deleteTask
}])