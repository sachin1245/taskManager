myApp.controller('taskController',['$http','$scope','$rootScope','$location','$routeParams','$route','taskService', 
	function($http,$scope,$rootScope,$location,$routeParams,$route,taskService){


	if($rootScope.count < 1 || $rootScope.count === undefined){
		taskService.getTask();
		$rootScope.count++;
	}//to get the tasks when the page is reloaded


	$scope.getTasks = function(){
		taskService.getTask();
	}

	$scope.editTask = function(task){
		taskService.changed(task);
	}//editTask

	$scope.newTask = function(task){
		taskService.newTask(task);
	}//newTask


	$scope.updateTask = function(task){
		taskService.updateTask(task);
	}//updateTask

	$scope.deleteTask = function(taskId){
		taskService.deleteTask(taskId);
	}//deleteTask
}])