//creates all the db models using sequelize.import

var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

//check if the app is in production or development to upload to heroku
if(env  === 'production'){
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        'dialect': 'postgres',
    });
}else{
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-todo-api.sqlite'
    });
}



var db = {}

db.task = sequelize.import(__dirname + '/models/task.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.token = sequelize.import(__dirname + '/models/token.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.task.belongsTo(db.user);
db.user.hasMany(db.task);

module.exports = db;