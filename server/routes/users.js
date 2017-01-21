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

router.delete('/:id', authenticateAPI, function (req, res, next) {

    User.findByIdAndRemove({_id:req.params.id})
      .then(function (removedUser) {
        console.log("removed user: ", removedUser);
        res.jsonp({user: removedUser});
      })
      .catch(function (err) {
        console.log("Error Removing User: ", err);
        res.status(400).jsonp({user: `Error Removing User: ${req.params.id}`})
      });

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