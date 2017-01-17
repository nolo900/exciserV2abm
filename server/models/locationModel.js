var mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({

	userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	addr1: String,
	addr2: String,
	city: String,
	state: String,
	zip: String,
	county: String,
	licenseNum: String

},{
	timestamps: true
})

module.exports = mongoose.model("Location", LocationSchema);