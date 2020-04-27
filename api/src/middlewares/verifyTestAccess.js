const Test = require('../models/Test');

module.exports = async function (req, res, next) {
    const { test_id } = req.params;
    try {
        const test = await Test.findById(test_id);
        if (!test.authors.includes(req.user._id))
            return res.status(400).json({ error: 'Unauthorized attempt' });
        next();
    } catch (err) {
        res.status(400).send(err);
    }
};
