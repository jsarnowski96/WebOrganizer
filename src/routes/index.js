const {ensureAuthenticated} = require('../config/auth.js');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - GET ' + req.url);
    res.render('welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - GET ' + req.url);
    res.render('dashboard',{
        user: req.user
    });
});

router.get('/about', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - GET ' + req.url);
    res.render('about');
});

router.get('/contact', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - GET ' + req.url);
    res.render('contact');
});

router.post('/contact', (req, res, next) => {
    console.log('Contact form sent');
})

module.exports = router;