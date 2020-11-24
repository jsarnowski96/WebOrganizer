const {ensureAuthenticated} = require('../config/auth.js');
const express = require('express');
const router = express.Router();

const Note = require('../models/note');

router.get('/', ensureAuthenticated, (req, res, next) => {
    let user = req.user;
    Note.find({user_id: user.id}, function(err, notes) {
        try {
            res.status(200).render('dashboard', {
                notes: notes,
                user: user,
                active: 'dashboard'
            });
        } catch(err) {
            console.log('Error during retrieving user\'s notes: ' + err);
        }
    });
});

router.get('/note/edit/:id', ensureAuthenticated, (req, res, next) => {
    Note.findById(req.params.id, function(err, note) {
            let errors = [];
            if(!note) {
                errors.push({msg: "Note with this ID does not exist"});
            }
            if(errors.length > 0) {
                res.status(500).render('dashboard', {errors: errors, active: 'dashboard'});
            } else {
                try {
                    let subject, content, priority, status;
                    subject = note.title;
                    content = note.body;
                    priority = note.priority;
                    status = note.status;
                    res.status(200).render('note', {
                        subject,
                        content,
                        priority,
                        status,
                        id: req.params.id,
                        active: 'dashboard'
                    });
                } catch(error) {
                    console.log('Error during obtaining record for note ID ' + req.params.id);
                    res.status(500).send({error});
                }
            }

        });
})  

router.post('/note/edit/:id', ensureAuthenticated, (req, res, next) => {
    Note.findById(req.params.id, function(err, note) {
        const {title, body, priority, status} = req.body;
        let errors = [];
        if(!title || !body || !priority || !status) {
            errors.push({msg: "One or more fields are empty"});
        }
        if(errors.length > 0) {
            res.status(500).render('dashboard', {
                errors: errors,
                title: title,
                body: body,
                priority: priority,
                status: status,
                active: 'dashboard'
            });
        } else {
            note.title = title;
            note.body = body;
            note.priority = priority;
            note.status = status;
            note.save()
            .then((value) => {
                console.log(value);
                res.status(301).redirect('/dashboard');
            })
            .catch(err);
        }
    });
})

router.get('/note/delete/:id', (req, res, next) => {
    const id = req.params.id;
    Note.findByIdAndDelete({_id: id}, function(err, note) {
        let errors = [];
        if(!id) {
            errors.push({msg: 'You have not provided the ID of the note marked for deletion'});
        }
        if(errors.length > 0) {
            res.status(200).render('dashboard', {
                errors: errors,
                active: 'dashboard'
            });
        } else {
            try {
                res.status(500).redirect('/dashboard');
            } catch(err) {
                console.log('Error during deletion of user\'s note with ID' + id + ': ' + err);
            }
        }
    });
});

router.post('/note/create', ensureAuthenticated, (req, res, next) => {
    const {title, body, priority} = req.body;
    let errors = [];
    console.log('Title: ' + title + ' Body: ' + body);
    if(!title || !body) {
        errors.push({msg: 'Please fill in all fields'});
    }
    if(errors.length > 0) {
        res.status(500).render('newNote', {
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
            user_id: res.locals.user.id,
            priority: priority,
            status: 'To do'
        });
        newNote.save()
        .then((value) => {
            console.log(value);
            //req.flash('success_msg', 'You have successfully added new note!');
            res.status(301).redirect('/dashboard');
        })
        .catch(value => console.log(value));
    }
});

router.get('/note/create', ensureAuthenticated, (req, res, next) => {
    res.status(200).render('newNote', {
        user: req.user,
        active: 'dashboard'
    });
});

module.exports = router;
