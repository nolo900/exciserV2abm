const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({

	firstName: String,
	lastName: String,
	entityName: String,
	entityAddr1: String,
	entityAddr2: String,
	entityCity: String,
	entityState: String,
	entityZip: String,
	entityFEIN: String,

	local: {
		email: { type: String},
		password: { type: String},

	},
	google:{
		id: {type: String},
		token: {type: String},
		name: {type: String},
		email: {type: String},
		image: {type: String}
	}

},{
	timestamps: true
});

// encrypt password when signing up
UserSchema.methods.encrypt = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// compare entered password(after hashing) to previously stored hash
UserSchema.methods.isValidPassword = function (password) {
	return bcrypt.compareSync(password,this.local.password);
};

module.exports = mongoose.model('User',UserSchema);



