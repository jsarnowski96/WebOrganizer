const {ensureAuthenticated} = require('../config/auth.js');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - GET ' + req.url);
    res.render('welcome');
});

router.get('/register', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - GET ' + req.url);
    res.render('register');
});

router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - GET ' + req.url);
    res.render('dashboard',{
        user: req.user
    });
})

module.exports = router;