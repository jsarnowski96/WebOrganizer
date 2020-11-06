const {ensureAuthenticated} = require('../config/auth.js');
const express = require('express');
const router = express.Router();

const Note = require('../models/note');
const Profile = require('../models/profile.js');

router.get('/', ensureAuthenticated, (req, res, next) => {
    Profile.find
});

router.get('/note/create', ensureAuthenticated, (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' -  ' + req.method + ' ' + req.url);
    res.render('newNote', {
        user: req.user,
        active: 'dashboard'
    });
});

router.post('/note/create', ensureAuthenticated, (req, res, next) => {
    res.status(200);
    console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url);
    const {title, body} = req.body;
    let errors = [];
    console.log('Title: ' + title + ' Body: ' + body);
    if(!title || !body) {
        errors.push({msg: 'Please fill in all fields'});
    }
    if(errors.length > 0) {
        res.render('newNote', {
            errors: errors,
            title: title,
            body: body,
            active: 'dashboard',
            user: req.user
        });
    } else {
        const newNote = new Note({
            title: title,
            body: body,
            profile_id: res.locals.user.id
        });
        newNote.save()
        .then((value) => {
            console.log(value);
            req.flash('success_msg', 'You have successfully added new note!');
            res.redirect('/dashboard');
            res.status(301);
            console.log(req.connection.remoteAddress.replace('::ffff:', '') + ' - ' + req.method + ' ' + req.url)
        })
        .catch(value => console.log(value));
    }
});

module.exports = router;
