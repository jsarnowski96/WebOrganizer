const {ensureAuthenticated} = require('../config/auth.js');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url);
    res.render('welcome', {active: 'home'});
});

router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url);
    res.render('dashboard', {
        user: req.user,
        active: 'dashboard'
    });
});

router.get('/profile', ensureAuthenticated, (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url);
    const {login, firstname, lastname, email, password} = req.body;
    res.render('profile', {active: 'profile', user: req.user});
})

router.get('/about', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url);
    res.render('about', {active: 'about'});
});

router.get('/contact', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url);
    res.render('contact', {active: 'contact'});
});

router.post('/contact', (req, res, next) => {
    console.log('Contact form sent');
})

module.exports = router;