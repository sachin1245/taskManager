myApp.service('taskService',['$rootScope','$location','$http','$route',function($rootScope,$location,$http,$route){

	return {

		newTask: newTask,
		getTask: getTask,
		updateTask: updateTask,
		deleteTask: deleteTask,
		changed: changed,
		search: search
	}	


	function changed(task){

		$rootScope.currentTask = task;
	
	}//edit task state

	function getTask(){

		$http.get('http://localhost:3000/tasks').then(function(response){
			$rootScope.tasks = response.data;
			$location.path('/tasks');
			$route.reload();
		},function(e){
			console.log('Couldn\'t  get tasks , Something went wrong');
		});
		
		
		return;
	}//to get all tasks


	function search(q){
		if(q){
			$http.get('http://localhost:3000/tasks',{ params: { 
				q:q
			}}).then(function(response){
				$rootScope.searchedTasks = response.data;
				$location.path('/searchTasks');
				$route.reload();
			},function(e){
				console.log('Couldn\'t  search , Something went wrong');
			});
		}
		
		return;
	}//search function returns the matched tasks with search query

	function newTask(task){
		$http.post('http://localhost:3000/tasks',task).then(function(data){
			$location.path('/tasks');
			getTask();
			$route.reload();
		 },function(e){
		    console.log('something went wrong');
		 })
	}//creates new task

	function updateTask(task){
		$http.put('http://localhost:3000/tasks/'+task.id,task).then(function(){
			$location.path('/tasks');
		},function(e){
			console.log('couldn\'t update the task ')
		})
	}//update task

	function deleteTask(taskId){
		$http.delete('http://localhost:3000/tasks/'+taskId).then(function(){
			console.log('Task Deleted');
			getTask();
			$route.reload();
		},function(e){
			console.log('couldn\'t delete the task ')
		})
	}//delete task

}]);