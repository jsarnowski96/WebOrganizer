const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('connect-flash');
const Profile = require('../models/profile');

const router = express.Router();

router.get('/login', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - GET ' + req.url);
    res.render('login');
});

router.get('/register', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '').replace('::ffff:', '') + ' - GET ' + req.url);
    res.render('register');
});

router.get('/logout', (req, res, next) => {
    req.logout();
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - GET ' + req.url);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - User logged out');
    req.flash('success_msg', 'You have successfully logged out!');
    res.redirect('/auth/login');
})

router.post('/login', (req, res, next) => {
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - POST ' + req.url);
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    }) (req, res, next);
})

router.post('/register', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - POST ' + req.url);
    const {login, firstname, lastname, email, password, password_confirm} = req.body;
    let errors = [];
    console.log('Login: ' + login + ' Firstname: ' + firstname + ' Lastname: ' + lastname + ' Email: ' + email + ' Password: ' + password);
    if(!login || !firstname || !lastname || !email || !password || !password_confirm) {
        errors.push({msg: 'Please fill in all fields'});
    }
    if(password != password_confirm) {
        errors.push({msg: 'Passwords do not match'});
    }
    if(password.length < 6) {
        errors.push({msg: 'Password has to be at least 6 characters long'});
    }
    if(errors.length > 0) {
        res.render('register', {
            errors: errors,
            login: login,
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            password_confirm: password_confirm
        });
    } else {
        Profile.findOne({email : email}).exec((err, profile) => {
            console.log(profile);
            if(profile) {
                errors.push({msg: 'There is already an account using this email'});
                res.render('register', {errors, login, firstname, lastname, email, password, password_confirm});
                //res.render(res, errors, login, firstname, lastname, email, password, password_confirm);
            } else {
                const newProfile = new Profile({
                    login: login,
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password
                });

                bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newProfile.password, salt,
                    (err, hash) => {
                        if(err) throw err;
                            newProfile.password = hash;
                        newProfile.save()
                        .then((value) => {
                            console.log(value);
                            req.flash('success_msg', 'You have successfully registered!');
                            res.redirect('/auth/login');
                            res.status(301);
                            console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - 301 - redirection to ' + res.url)
                        })
                        .catch(value => console.log(value));
                    }))
            }
        });
    }
})

module.exports = router;