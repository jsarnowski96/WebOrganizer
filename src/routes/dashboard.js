const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: `GET Dashboard`
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: `POST Dashboard`
    });
});

router.put('/', (req, res, next) => {
    res.status(200).json({
        message: `PUT Dashboard`
    });
});

router.patch('/', (req, res, next) => {
    res.status(200).json({
        message: `PATCH Dashboard`
    });
});

router.delete('/', (req, res, next) => {
    res.status(200).json({
        message: `DELETE Dashboard`
    });
});



module.exports = router;