const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    console.log(res.status(200));
    res.render('welcome');
});

router.get('/register', (req, res, next) => {
    console.log(res.status(200));
    res.render('register');
});

module.exports = router;