var express = require('express');
var router = express.Router();
var User = require('../models/userModel')

/* GET users listing. */
router.get('/', authenticateAPI, function(req, res, next) {
  var user = req.user;
  res.jsonp(user);
});

//update
router.post('/:id', authenticateAPI, function (req, res, next) {

  User.findByIdAndUpdate({_id: req.user._id}, req.body)
      .then(function(savedUser) {
        console.log("updating user: ", savedUser);
        res.jsonp({ user: savedUser });
      })
      .catch(function(err) {
        console.log("Error updating user:", err);
        return next(err);
      });

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