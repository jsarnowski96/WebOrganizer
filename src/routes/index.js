const {ensureAuthenticated} = require('../config/auth.js');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Profile = require('../models/profile');

router.get('/', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url);
    res.render('welcome', {active: 'home'});
});

router.get('/profile', ensureAuthenticated, (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url);
    res.render('profile', {active: 'profile', user: req.user});
})

router.post('/profile', ensureAuthenticated, (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url);
    Profile.findById(req.user.id, function(err, user) {
        const {login, firstname, lastname, email} = req.body;
        let errors = [];
        if(!login || !firstname || !lastname || !email) {
            errors.push({msg: "One or more fields are empty"});
        }
        if(errors.length > 0) {
            res.render('profile', {
                errors: errors,
                login: login,
                firstname: firstname,
                lastname: lastname,
                email: email,
                active: 'profile'
            });
        } else {
            user.login = login;
            user.firstname = firstname;
            user.lastname = lastname;
            user.email = email;

            user.save()
            .then((value) => {
                console.log(value);
                req.flash('success_msg', 'You have successfully modified your data!');
                res.redirect('/profile');
                res.status(301);
                console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url)
            })
            .catch(err);
        }
    });
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
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url);
    const {subject, message, firstname, lastname, email} = req.body;
    const errors = []
    const smtpTrans = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true,
        logger: true,
        //debug: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailOpts = {
        from: email,
        to: process.env.MAIL_USER,
        subject: subject,
        text: `First name: ${firstname}\nLast name: ${lastname}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
    };

    smtpTrans.sendMail(mailOpts, (err, response) => {
        if(err) {
            errors.push({msg: 'There was an issue with sending your contact form. Please try again.'});
            res.status(500);
            console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - Error with sending contact form: ' + err);
            res.render('contact', {errors: errors, active: 'contact'});
        } else {
            res.status(200);
            req.flash('success_msg', 'Contact form sent!');
            res.redirect('/contact');
            console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - Contact form sent successfully from ' + email);
        }
    });
});

module.exports = router;