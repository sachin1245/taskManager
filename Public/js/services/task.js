myApp.service('taskService',['$rootScope','$location','$http','$route',function($rootScope,$location,$http,$route){

	return {

		newTask: newTask,
		getTask: getTask,
		updateTask: updateTask,
		deleteTask: deleteTask,
		changed: changed,
		search: search
	}

	var currentTask;
	var searchedTask;

	function changed(task){
		if(task){
			currentTask = task;
		}
		
		return currentTask;
	}

	function getTask(){
		return new Promise(function(resolve,reject){
			var data ;
			 $http.get("http://localhost:3000/tasks").then(function(response){
			  	data = response.data;
			  	resolve(data);
			  },function(e){
			  	reject('something went wrong');
			  });
		});

	}


	function search(q){
		if(q){
			$http.get('http://localhost:3000/tasks',{ params: { 
				q:q
			}}).then(function(response){
				searchedTask = response.data;
				$location.path('/searchTasks');
				$route.reload();
			},function(e){
				console.log('Couldn\'t  search , Something went wrong');
			});
		}
		
		return searchedTask;
	}
	function newTask(task){
		$http.post('http://localhost:3000/tasks',task).then(function(data){
			$location.path('/tasks');
			 return data;
		 },function(e){
		    console.log('something went wrong');
		 })
	}

	function updateTask(task){
		$http.put('http://localhost:3000/tasks/'+task.id,task).then(function(){
			$location.path('/tasks');
		},function(e){
			console.log('couldn\'t update the task ')
		})
	}

	function deleteTask(taskId){
		$http.delete('http://localhost:3000/tasks/'+taskId).then(function(){
			console.log('Task Deleted');
			$route.reload();
		},function(e){
			console.log('couldn\'t delete the task ')
		})
	}

}]);