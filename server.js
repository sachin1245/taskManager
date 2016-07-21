var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var bcrypt = require('bcrypt-nodejs');
var cors = require('cors');
var db = require('./db.js')
var middleware = require('./middleware.js')(db);

var app = express();


var PORT = process.env.PORT || 3000;

//to allow Access-Cross-Origin-Support
app.use(cors());

//used to parse the data from the requests made
app.use(bodyParser.json());

//serve index page using express, all the other routes are handled uisng angular
app.use(express.static(__dirname + '/Public'));

app.get('/tasks', middleware.requireAuthentication,function(req, res) {
	var query = req.query;
	var where = {
        userId: req.user.get('id')
    };

    //checking if any query is sent with the get request for searching
	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	//sequelize method to find the all the tasks matches the query
	db.task.findAll({
		where: where
	}).then(function(tasks) {
		res.json(tasks);
	}, function(e) {
		res.status(500).json(e);
	})

});

app.get('/tasks/:id',middleware.requireAuthentication, function(req, res) {
	var taskId = parseInt(req.params.id);

	//sequelize method to find the task which matches the id
	db.task.findOne({
        where: {
            id:taskId,
            userId: req.user.get('id')
        }
    }).then(function(task) {
		if (!!task) {
			res.json(task);
		} else {
			res.status(404).send('cannot find task with that id');
		}

	}, function(e) {
		res.json(500).send(e);
	});



});

app.post('/tasks',middleware.requireAuthentication, function(req, res) {

	//takes only the required data from the request body
    var body = _.pick(req.body, 'description', 'completed');

	//sequelize method to create the task 	
	db.task.create(body).then(function(task) {
        req.user.addTask(task).then(function(){
           return task.reload(); 
        }).then(function(task){
            res.json(task.toJSON());
        });
	}, function(e) {
		res.status(400).json(e.message);
	});


});

app.delete('/tasks/:id', middleware.requireAuthentication,function(req, res) {
	var taskId = parseInt(req.params.id);

	//sequelize method to destroy the task
	db.task.destroy({
		where: {
			id: taskId,
            userId: req.user.get('id')
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			console.log('no task with that id');
			res.status(401).json('no task with that id');
		} else {
			res.status(204).json();
		}
	}, function(e) {
		res.status(500).json(e);
	});

});

app.put('/tasks/:id',middleware.requireAuthentication, function(req, res) {

	//takes only the required data from the request body
	var body = _.pick(req.body, 'description', 'completed');
	var taskId = parseInt(req.params.id);

	var attributes = {};


	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}
	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	//sequelize method to search for a single task
	db.task.findOne({
        where:{
            id: taskId,
            userId: req.user.get('id')
        }
    }).then(function(task) {
		if (task) {
			//sequelize method to update the searched task
			task.update(attributes).then(function(task) {
				res.json(task.toJSON());
			}, function(e) {
				res.status(404).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	})

});

app.post('/users',function(req,res){
    var body = _.pick(req.body,'email','password');
    
    //sequelize method to create the user
    db.user.create(body).then(function(user){
        res.json(user.toPublicJSON());
    },function(e){
    	console.log(e.errors.message);
    	if(e.message == 'email must be unique'){
    		res.status(400).json('User with the email id is already registered');
    	}
        res.status(400).json(e);
    });
});

app.post('/users/login',function(req,res){
     var body = _.pick(req.body,'email','password');
     var userInstance;

     //sequelize method to create ,store and to attach the token to the response header
     db.user.authenticate(body).then(function (user) {
         var token = user.generateToken('authentication');
         userInstance = user;
         
         //create token ,returns a promise
         return db.token.create({
             token: token
         });
      }).then(function (tokenInstance) {
      	 var token = tokenInstance.get('token');
      	 //adding the token to the response header
         res.header('Auth', tokenInstance.get('token')).send({
         	token: token,
         	user: userInstance.toPublicJSON()
         });
    }).catch(function(){
         res.status(401).json();
    });
});


app.delete('/users/login',middleware.requireAuthentication,function(req,res){
    req.token.destroy().then(function(){
        res.status(204).send();
    }).catch(function(){
        res.status(500).send();
    })
})//logout from the browser and delete the hashed token from the db

//sequelize create tables on calling sync() and by passing follwing object to sync({force:true}) sequelize
//drops the present table and recreates them
db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("express running on port " + PORT)
	});
});

