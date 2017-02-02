var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema({

	locationID: {type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
	reportMonth: String,
	grossSales: Number,
	pdfURL: String
},{
	timestamps: true
})

module.exports = mongoose.model("Payment", PaymentSchema);