var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/',authenticateAPI, function(req, res, next) {
  res.send(req.user);
  console.log(req.user);
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