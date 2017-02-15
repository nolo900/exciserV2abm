const mongoose = require('mongoose');
// mongoose.Promise = require('bluebird');
const Payment = require('./models/paymentsModel.js');

if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
}
else {
	mongoose.connect('mongodb://localhost/exciser');
}
mongoose.connection.on('error', function(err) {
		console.error('MongoDB connection error: ' + err);
		process.exit(-1);
	}
);
mongoose.connection.once('open', function() {
	console.log("Mongoose has connected to MongoDB!");
});

// our script will not exit until we have disconnected from the db.
function quit() {
	mongoose.disconnect();
	console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
	console.error('ERROR:', err);
	quit();
	return err;
}

console.log('removing old pmts...');
Payment.remove({})
	.then(function() {
		console.log('creating some new pmts...');
		const pmt1     = new Payment({
			locationID: "58768e99115db81337e23cc1",
			reportMonth: "2016/12",
			grossSales: 20000.00,
			pdfURL: "http://aws.mypdf.com/1"
		});
		const pmt2 = new Payment({
			locationID: "58768e99115db81337e23cc1",
			reportMonth: "2016/12",
			grossSales: 20000.00,
			pdfURL: "http://aws.mypdf.com/1"
		});
		const pmt3 = new Payment({
			locationID: "58768e99115db81337e23cc1",
			reportMonth: "2016/12",
			grossSales: 20000.00,
			pdfURL: "http://aws.mypdf.com/1"
		});
		return Payment.create([pmt1,pmt2,pmt3]);
	})
	.then(function(savedPmt) {
		console.log('Just saved', savedPmt.length, 'loc.');
		return Payment.find({});
	})
	.then(function(allPmt) {
		console.log('Printing all payments:');
		allPmt.forEach(function(pmt) {
			console.log(pmt);
		});
		quit();
	})
	.catch(handleError);