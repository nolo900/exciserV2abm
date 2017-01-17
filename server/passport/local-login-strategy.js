var LocalStrategy = require('passport-local').Strategy;
var User          = require('../models/userModel');

var strategy = new LocalStrategy({
		usernameField : 'login_email',
		passwordField : 'login_password',
		passReqToCallback : true
	},
	function (req, email, password, callback) {
		User.findOne({ 'local.email' : email }, function (err, user) {
			if (err) return callback(err);
			if (!user){
				//user not found
				return callback(null, false);
			}
			// validate password
			if (!user.isValidPassword(password)){
				return callback(null, false);
			}
			return callback(null, user);
		});
	});

module.exports = strategy;