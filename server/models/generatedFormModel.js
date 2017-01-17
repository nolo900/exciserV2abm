var mongoose = require('mongoose');

var FormSchema = new mongoose.Schema({

	userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	email: String,
	addr1: String,
	addr2: String,
	city: String,
	state: String,
	zip: String,
	county: String,
	licenseNum: String,
	salesTaxID: String,
	reportMonthYear: String,
	grossSales: Number,
	taxDue: Number,
	vendorCompensation: Number,
	totalTaxes: Number,
	penalty: Number,
	interest: Number,
	total: Number,
	formLocationPathURL: String
	// documentation: Array[],

},{
	timestamps: true
});

module.exports = mongoose.model("Form", FormSchema);