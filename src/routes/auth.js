const express = require('express');
const user = require('../models/user');

const router = express.Router();

router.get('/login', (req, res, next) => {
    console.log(res.status(200));
    res.render('login');
});

router.get('/register', (req, res, next) => {
    console.log(res.status(200));
    res.render('register');
});

router.get('/logout', (req, res, next) => {
    console.log(res.status(200));
})

router.post('/login', (req, res, next) => {
    console.log(res.status(200));
})

router.post('/register', (req, res, next) => {
    console.log(res.status(200));
    
})

module.exports = router;