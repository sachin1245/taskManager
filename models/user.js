var bcrypt = require('bcrypt-nodejs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
            unique: true,
			validate: {
				isEmail: true
			}
		},
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
                len: [6,100]
            },
            // function for hashing the password
            set: function (value) {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value,salt);
                
                
                this.setDataValue('password',value);
                this.setDataValue('salt',salt);
                this.setDataValue('password_hash',hashedPassword);
            }
		}
	}, {
        hooks: {
            beforeValidate: function(user, options) {
                //checking if email is a string becuase toLowerCase() method throws an error otherwise
               if (typeof user.email === 'string'){
                   //converting the email into lowercase before saving
                   user.email = user.email.toLowerCase();
               }
            }
        },
        classMethods: {
            
          authenticate: function (body){
              
            return new Promise(function(resolve,reject){
                  if(typeof body.email !== 'string' || typeof body.password !== 'string'){
                    return reject();
                  }

                    //fetching the user from the db
                    user.findOne({
                        where: {
                            email: body.email
                        }
                    }).then(function (user){
                        //checking if the user with given email is present or password is correct
                        if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
                            return reject();
                        }

                        return resolve(user);
                     },function (e){
                       return reject(); 
                    });
            });
          },
          findByToken: function(token){
              return new Promise(function(resolve,reject){
                  try {
                      var decodedJWT = jwt.verify(token,'hello123');
                      var bytes = cryptojs.AES.decrypt(decodedJWT.token,'abc123@1@!');
                      var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
                      
                      user.findById(tokenData.id).then(function(user){
                          if(user){
                              resolve(user);
                          }else{
                              reject();
                          }
                      },function(e){
                          reject();
                      })
                  }catch (e) {
                      reject();
                  }
              });
          }
        },
        instanceMethods: {
            toPublicJSON: function () {
                var json = this.toJSON();
                return _.pick(json,'id','email','createdAt','updatedAt');
            },
            generateToken: function (type){
                if(!_.isString(type)){
                    return undefined;
                }
                
                try{
                    var stringData = JSON.stringify({id: this.get('id'), type: type});
                    var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123@1@!').toString();
                    
                    var token = jwt.sign({
                        token: encryptedData
                    },'hello123');
                    
                    return token;
                } catch(e) {
                    return undefined;
                }
            }
        }
    });
    
    return user;
};