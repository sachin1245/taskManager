var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var bcrypt = require('bcrypt-nodejs');
var cors = require('cors');
var db = require('./db.js')
var middleware = require('./middleware.js')(db);

var app = express();


var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname + '/Public'));

app.get('/todos', middleware.requireAuthentication,function(req, res) {
	var query = req.query;
	var where = {
        userId: req.user.get('id')
    };

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

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).json(e);
	})

});

app.get('/todos/:id',middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id);


	db.todo.findOne({
        where: {
            id:todoId,
            userId: req.user.get('id')
        }
    }).then(function(todo) {
		if (!!todo) {
			res.json(todo);
		} else {
			res.status(404).send('cannot find todo with that id');
		}

	}, function(e) {
		res.json(500).send(e);
	});



});

app.post('/todos',middleware.requireAuthentication, function(req, res) {

    var body = _.pick(req.body, 'description', 'completed');

	
	db.todo.create(body).then(function(todo) {
        req.user.addTodo(todo).then(function(){
           return todo.reload(); 
        }).then(function(todo){
            res.json(todo.toJSON());
        });
	}, function(e) {
		res.status(400).json(e.message);
	});


});

app.delete('/todos/:id', middleware.requireAuthentication,function(req, res) {
	var todoId = parseInt(req.params.id);

	db.todo.destroy({
		where: {
			id: todoId,
            userId: req.user.get('id')
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json('no todo with that id');
		} else {
			res.status(204).json();
		}
	}, function(e) {
		res.status(500).json(e);
	})

	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});



});

app.put('/todos/:id',middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var todoId = parseInt(req.params.id);

	var attributes = {};


	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}
	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findOne({
        where:{
            id: todoId,
            userId: req.user.get('id')
        }
    }).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).json(e);
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
     
     db.user.authenticate(body).then(function (user) {
         var token = user.generateToken('authentication');
         userInstance = user;
         
         return db.token.create({
             token: token
         });
      }).then(function (tokenInstance) {
      	 var token = tokenInstance.get('token');
      	 console.log(token);
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
})

db.sequelize.sync().then(function() {
	app.listen(3000, function() {

		console.log("express running on port " + PORT)
	});
});