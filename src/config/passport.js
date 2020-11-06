const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Profile = require('../models/profile');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
        }, (email, password, done) => {
            Profile.findOne({email : email})
            .then((profile) => {
                if(!profile) {
                    return done(null, false, {
                        message: 'This email is not registered in our database'
                    });
                }
                bcrypt.compare(password, profile.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch) {
                        return done(null, profile);
                    } else {
                        return done(null, false, {
                            message: 'Incorrect password'
                        });
                    }
                })
            })
            .catch((err) => {
                console.log(err);
            })
        })
    )

    passport.serializeUser(function(profile, done) {
        done(null, profile);
    });

    passport.deserializeUser(function(id, done) {
        Profile.findById(id, function(err, profile) {
            done(err, profile);
        });
    });
}