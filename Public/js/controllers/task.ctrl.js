myApp.controller('taskController',['$http','$scope','$rootScope','$location','$routeParams','$route','taskService', 
	function($http,$scope,$rootScope,$location,$routeParams,$route,taskService){




	$scope.tasks = {};

	$scope.searchedTasks = taskService.search();
	console.log($scope.searchedTasks);

	 $http.get("http://localhost:3000/todos").then(function(response){
            $scope.tasks = response.data;
            console.log($scope.tasks);
    },function(e){
            console.log('something went wrong');
    });

	function getTask(){
		taskService.getTask().then(function(data){
			$scope.tasks = data;
			$route.reload();
		},function(e){
			$routeScope.message = e.message;
		})
	}

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