const {ensureAuthenticated} = require('../config/auth.js');
const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');

const Note = require('../models/note');

router.get('/', ensureAuthenticated, async (req, res, next) => {
    let errors = [];
    Note.find({user_id: req.user.id})
        .then((notes) => {
            notes.forEach(note => {
                note.body = sanitizeHtml(note.body, {
                    allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                    allowedAttributes: {
                      'a': [ 'href' ], 'img': [ 'src' ]
                    },
                    allowedIframeHostnames: ['www.youtube.com']
                }); 
            });
            res.status(200).render('dashboard', {
                errors: errors,
                notes: notes,
                user: req.user,
                active: 'dashboard'
            });  
        }).catch(error => {
            console.log(error);
    });  
});

router.get('/note/edit/:id', ensureAuthenticated, (req, res, next) => {
    let errors = [];
    Note.findById({_id: req.params.id, user_id: req.user.id}, function(error, note) {
        let subject, content, priority, status;
        if(!req.params.id || !req.user || !req.user.id) {
            errors.push({msg: "Missing record ID or user."});
        }
        if(!note) {
            errors.push({msg: "Username: " + req.user.login + " | User ID: " + req.user.id + " | Record ID: " + req.params.id + " - Note with this ID does not exist or does not belong to the user"});
        } else if(note && note.user_id != req.user.id) {
            errors.push({msg: "Username: " + req.user.login + " | User ID: " + req.user.id + " | Record ID: " + req.params.id + " - User unauthorized"});
        }
        if(error) {
            errors.push({msg: error});
        }
        if(errors.length > 0) {
            console.log(errors);
            res.status(500).redirect('/dashboard');
        } else {
            subject = note.title;
            content = note.body;
            priority = note.priority;
            status = note.status;
            res.status(200).render('editNote', {
                subject,
                content,
                priority,
                status,
                id: req.params.id,
                active: 'dashboard'
            });
        }
    })
})  

router.post('/note/edit/:id', ensureAuthenticated, (req, res, next) => {
    let errors = [];
    Note.findById({_id: req.params.id, user_id: req.user.id}, function(error, note) {
        const {title, body, priority, status} = req.body;
        if(!title || !body || !priority || !status) {
            errors.push({msg: "One or more fields are empty"});
        }
        if(!note) {
            errors.push({msg: "Username: " + req.user.login + " | User ID: " + req.user.id + " | Record ID: " + req.params.id + " - Note does not exist or user tried to modify the record that does not belong to him"});
        } else if(note && note.user_id != req.user.id) {
            errors.push({msg: "Username: " + req.user.login + " | User ID: " + req.user.id + " | Record ID: " + req.params.id + " - User unauthorized"});
        }
        if(error) {
            errors.push({msg: error});
        }
        if(errors.length > 0) {
            res.status(500).render('editNote', {
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
            note.save(function (error, value) {
                if(error) {
                    errors.push({msg: error});   
                    res.status(500).render('editNote', {
                        errors: errors,
                        title: title,
                        body: body,
                        priority: priority,
                        status: status,
                        active: 'dashboard'
                    });
                }
                console.log(value);
                res.status(200);
            });
        }
    });
})

router.get('/note/delete/:id', ensureAuthenticated, (req, res, next) => {
    let errors = [];
    Note.findOneAndRemove({_id: req.params.id, user_id: req.user.id})
    .then((note) => {
        if(!req.params.id || !req.user || !req.user.id) {
            errors.push({msg: 'You have not provided the ID of the note marked for deletion'});
        }
        if(!note) {
            errors.push({msg: "Username: " + req.user.login + " | User ID: " + req.user.id + " | Record ID: " + req.params.id + " - Note does not exist or user tried to modify the record that does not belong to him"});
        } else if(note && note.user_id != req.user.id) {
            errors.push({msg: "Username: " + req.user.login + " | User ID: " + req.user.id + " | Record ID: " + req.params.id + " - User unauthorized"});
        }
        if(errors.length > 0) {
            res.status(500).redirect('/dashboard');
        } else {
            try {
                console.log('Deleted record ID ' + note._id);
                res.status(200).redirect('/dashboard');
            } catch(error) {
                console.log('Error during deletion of user\'s note with ID' + req.params.id + ': ' + error);
            }
        };
    }).catch(error => {
        errors.push({msg: error});
        res.status(500).redirect('/dashboard');
    }).finally(() => {
        if(errors.length > 0) {
            console.log(errors);
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
