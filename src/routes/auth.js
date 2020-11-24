const {ensureAuthenticated} = require('../config/auth.js');
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

const router = express.Router();

router.get('/login', (req, res, next) => {
    res.status(200).render('login', {active: 'login'});
});

router.get('/register', (req, res, next) => {
    res.status(200).render('register', {active: 'register'});
});

router.get('/logout', ensureAuthenticated, (req, res, next) => {
    console.log('User ' + req.user.login + ' logged out successfully.');
    req.logout();
    res.locals.user = null;
    res.status(200).render('welcome', {active : 'home'})
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    }) (req, res, next);
})

router.post('/register', (req, res, next) => {
    const {login, firstname, lastname, email, password, password_confirm} = req.body;
    let errors = [];
    //console.log('Login: ' + login + ' Firstname: ' + firstname + ' Lastname: ' + lastname + ' Email: ' + email + ' Password: ' + password);
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
            password_confirm: password_confirm,
            active: 'register'
        });
    } else {
        User.findOne({email : email}).exec((err, user) => {
            console.log(user);
            if(user) {
                errors.push({msg: 'There is already an account using this email'});
                res.status(400).render('register', {errors, login, firstname, lastname, email, password, password_confirm, active: 'register'});
            } else {
                const user = new User({
                    login: login,
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: password
                });

                bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(user.password, salt,
                    (err, hash) => {
                        if(err) throw err;
                            user.password = hash;
                        user.save()
                        .then(() => {
                            res.status(301).redirect('/auth/login');
                        })
                        .catch(value => console.log(value));
                    }))
            }
        });
    }
})

module.exports = router;