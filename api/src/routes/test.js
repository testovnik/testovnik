const router = require('express').Router();

const verify = require('./verifyToken');
const testModel = require('../models/Test');

router.get('/:id', verify, async (req, res) => {
    const { id } = req.query;
    try {
        const {
            _id,
            name,
            version,
            date,
            authorIds,
            description,
            tags,
            category,
            questions,
        } = await testModel.findById(id).orFail();
        const test = {
            id: _id,
            name,
            version,
            date,
            authorIds,
            description,
            tags,
            category,
            questions,
        };
        res.json(test);
    } catch (e) {
        res.status(404).send();
    }
});

router.get('/:id/questions', verify, async (req, res) => {
    const { id } = req.query;
    try {
        const { questions } = await testModel.findById(id).orFail();
        res.json(questions);
    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;
