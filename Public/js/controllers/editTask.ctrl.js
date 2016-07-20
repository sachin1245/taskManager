myApp.controller('editTaskController',['$scope','taskService',function($scope,taskService){

	$scope.task = taskService.changed();

	$scope.updateTask = function(task){
		taskService.updateTask(task);
	}

}]);