var express = require('express');
var router = express.Router();
var Form = require('../models/generatedFormModel');

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

module.exports = router;

function authenticateAPI(req, res, next) {
	if(!req.isAuthenticated()) {
		res.redirect(401, '/');
	}
	else {
		next();
	}
}