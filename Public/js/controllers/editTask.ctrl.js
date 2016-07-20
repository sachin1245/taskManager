myApp.controller('editTaskController',['$scope','taskService',function($scope,taskService){

	$scope.task = taskService.changed();

	$scope.updateTask = function(task){
		console.log(task);
		taskService.updateTask(task);
	}

}]);