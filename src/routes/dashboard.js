const {ensureAuthenticated} = require('../config/auth.js');
const express = require('express');
const router = express.Router();

const Note = require('../models/note');

router.get('/', ensureAuthenticated, (req, res, next) => {
    res.status(200);
    let user = req.user;
    Note.find({profile_id: user.id}, function(err, notes) {
        try {
            res.render('dashboard', {
                notes: notes,
                user: user,
                active: 'dashboard'
            });
        } catch(err) {
            console.log('Error during retrieving user\'s notes: ' + err);
        }
    });
});

router.get('/note/create', ensureAuthenticated, (req, res, next) => {
    res.status(200);
    res.render('newNote', {
        user: req.user,
        active: 'dashboard'
    });
});

router.get('/note/read/:id', ensureAuthenticated, (req, res, next) => {
    res.status(200);
    
    Note.findById(req.params.id, function(err, note) {
            let errors = [];
            if(!note) {
                errors.push({msg: "Note with this ID does not exist"});
            }
            if(errors.length > 0) {
                res.render('dashboard', {errors: errors, active: 'dashboard'});
            } else {
                try {
                    let subject, content;
                    subject = note.title;
                    content = note.body;
    
                    res.render('note', {
                        subject,
                        content,
                        id: req.params.id,
                        active: 'dashboard'
                    });
                } catch(error) {
                    console.log('Error during obtaining record for note ID ' + req.params.id);
                    console.log(error);
                }
            }

        });
})  

router.post('/note/edit/:id', ensureAuthenticated, (req, res, next) => {
    res.status(200);
    Note.findById(req.params.id, function(err, note) {
        const {title, body} = req.body;
        let errors = [];
        if(!title || !body) {
            errors.push({msg: "One or more fields are empty"});
        }
        if(errors.length > 0) {
            res.render('dashboard', {
                errors: errors,
                title: title,
                body: body,
                active: 'dashboard'
            });
        } else {
            note.title = title;
            note.body = body;
            note.save()
            .then((value) => {
                console.log(value);
                req.flash('success_msg', 'You have successfully modified your note!');
                res.redirect('/dashboard');
                res.status(301);
            })
            .catch(err);
        }
    });
})

router.get('/note/delete/:id', (req, res, next) => {
    res.status(200);
    const id = req.params.id;
    Note.findByIdAndDelete({_id: id}, function(err, note) {
        let errors = [];
        if(!id) {
            errors.push({msg: 'You have not provided the ID of the note marked for deletion'});
        }
        if(errors.length > 0) {
            res.render('dashboard', {
                errors: errors,
                active: 'dashboard'
            });
        } else {
            try {
                res.redirect('/dashboard');
            } catch(err) {
                console.log('Error during deletion of user\'s note with ID' + id + ': ' + err);
            }
        }
    });
});

router.post('/note/create', ensureAuthenticated, (req, res, next) => {
    res.status(200);
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
        })
        .catch(value => console.log(value));
    }
});

module.exports = router;
