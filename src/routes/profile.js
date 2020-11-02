const express = require('express');

const router = express.Router();

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: `GET Profile ID ${id}`
    });
});

router.post('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: `POST Profile ID ${id}`
    });
});

router.put('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: `PUT Profile ID ${id}`
    });
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: `PATCH Profile ID ${id}`
    });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: `DELETE Profile ID ${id}`
    });
});

module.exports = router;