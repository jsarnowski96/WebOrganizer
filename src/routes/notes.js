const express = require('express');

const router = express.Router();

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: `GET Note ID ${id}`
    });
});

router.post('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: `POST Note ID ${id}`
    });
});

router.put('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: `PUT Note ID ${id}`
    })
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: `PATCH Note ID ${id}`
    })
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: `DELETE Note ID ${id}`
    })
});

module.exports = router;