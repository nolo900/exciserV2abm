var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/signup', function (req, res, next) {
    var signUpStrategy = passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/error',
        failureFlash: true
    });
    return signUpStrategy(req, res, next);
});

router.post('/login', function (req, res, next) {
    console.log(req.body);
    var loginStrategy = passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    });
    return loginStrategy(req, res, next);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;