const {ensureAuthenticated} = require('../config/auth.js');
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('connect-flash');
const Profile = require('../models/profile');

const router = express.Router();

router.get('/login', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - GET ' + req.url);
    res.render('login', {active: 'login'});
});

router.get('/register', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '').replace('::ffff:', '') + ' - GET ' + req.url);
    res.render('register', {active: 'register'});
});

router.get('/reset', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '').replace('::ffff:', '') + ' - GET ' + req.url);
    res.render('reset', {active: 'login'});
});

router.post('/reset', (req, res, next) => {
    async.waterfall([
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          Profile.findOne({ email: req.body.email, login: req.body.login }, function(err, user) {
            if (!user) {
              req.flash('error', 'No account with that email address exists.');
              console.log(req.connection.remoteAddress.replace('::ffff:', '').replace('::ffff:', '') + ' - Password reset request for non-existing account detected');
              return res.redirect('/reset');
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            user.save(function(err) {
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
          var smtpTransport = nodemailer.createTransport('SMTP', {
            service: 'SendGrid',
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS
            }
          });
          var mailOptions = {
            to: user.email,
            from: 'reset_pwd@uroboros',
            subject: 'Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            console.log(req.connection.remoteAddress.replace('::ffff:', '').replace('::ffff:', '') + ' - Reset password link sent to ' + user.email);
            req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            done(err, 'done');
          });
        }
      ], function(err) {
        if (err) return next(err);
        res.redirect('/reset');
      });
});

router.get('/reset/:token', (req, res, next) => {

});

router.post('/reset/:token', (req, res, next) => {
    
})

router.get('/logout', ensureAuthenticated, (req, res, next) => {
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url + '  - User ' + req.user.login + ' logged out');
    req.logout();
    req.flash('success_msg', 'You have successfully logged out!');
    res.locals.user = null;
    res.render('welcome', {active : 'home'})
})

router.post('/login', (req, res, next) => {
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url);
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    }) (req, res, next);
})

router.post('/register', (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url);
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
            password_confirm: password_confirm,
            active: 'register'
        });
    } else {
        Profile.findOne({email : email}).exec((err, profile) => {
            console.log(profile);
            if(profile) {
                errors.push({msg: 'There is already an account using this email'});
                res.render('register', {errors, login, firstname, lastname, email, password, password_confirm, active: 'register'});
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
                            console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url)
                        })
                        .catch(value => console.log(value));
                    }))
            }
        });
    }
})

module.exports = router;