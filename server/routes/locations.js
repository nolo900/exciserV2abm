var express = require('express');
var router = express.Router();
var Location = require('../models/locationModel');

/* GET users listing. */
router.get('/', authenticateAPI, function(req, res, next) {
	Location.find({})
		.then(function (foundLocations) {
			res.jsonp({locations: foundLocations});
		})
		.catch(function (err) {
			console.log("Error getting location:", req.body);
			return next(err);
		})
});

router.get('/:id', function (req, res, next) {
	Location.findById(req.params.id)
		.then(function (foundLocation) {
			res.jsonp({locations: foundLocation});
		})
		.catch(function (err) {
			console.log("Error finding location: ", err);
		})
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