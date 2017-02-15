var express = require('express');
var router = express.Router();
var Form = require('../models/generatedFormModel');
var PDFgen = require('../pdfGen');

/* GET users listing. */
router.get('/', function(req, res, next) {
	Form.find({})
		.then(function (foundForms) {
			console.log("Found Forms: ", foundForms);
			res.status(200).jsonp({forms: foundForms});
		})
		.catch(function (err) {
			console.log('Error getting forms: ', err);
			res.status(400).jsonp({forms: "Error getting forms"});
		})
});

router.post('/makepdf', function (req, res, next) {
	console.log("in makepdf route", req.body);

	PDFgen.generatePDF(req.body);
	next();

})

module.exports = router;

function authenticateAPI(req, res, next) {
	if(!req.isAuthenticated()) {
		res.redirect(401, '/');
	}
	else {
		next();
	}
}