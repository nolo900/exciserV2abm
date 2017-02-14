var express = require('express');
var router = express.Router();
var Location = require('../models/locationModel');

/* GET users listing. */
router.get('/', function(req, res, next) {
	Location.find({userID: req.user._id})
		.then(function (foundLocations) {
			console.log(foundLocations);
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
});

//Create
router.post('/add', function (req, res, next) {
	console.log(req.body);

	Location.create(req.body)
		.then(function (addedLocation) {
			console.log("added location:", addedLocation);
			res.jsonp({location: addedLocation});
		})
		.catch(function (err) {
			console.log("error adding location:", err);
		})

});

//Update
router.post('/:id', function (req, res, next) {
	console.log("in post Locations router:", req.body);

	Location.findByIdAndUpdate({_id: req.body._id}, req.body)
		.then(function(savedLocation) {
			console.log("updating location: ", savedLocation );
			res.jsonp({ location: savedLocation });
		})
		.catch(function(err) {
			console.log("Error updating location:", err);
			return next(err);
		});


});

//delete
router.delete('/:id', function (req, res, next) {
	console.log(req.body);

	Location.findByIdAndRemove({_id: req.params.id})
		.then(function (removedLocation) {
			console.log("location removed: ", removedLocation);
			res.jsonp({location: removedLocation});
		})
		.catch(function (err) {
			console.log("error removing location", err);
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