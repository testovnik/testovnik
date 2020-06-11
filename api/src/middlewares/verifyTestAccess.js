const Test = require('../models/Test');

module.exports = async function(req, res, next) {
    const { test_id } = req.params;
    try {
        const test = await Test.findById(test_id);
        const authorized_authors = test.authors;
        const { id } = req.user;

        const isAuthorizedUser = authorized_authors.reduce(
            (accumulator, currentValue) => {
                return accumulator || currentValue.id === id;
            },
            false
        );
        if (!isAuthorizedUser)
            return res.status(400).json({ error: 'Unauthorized attempt' });

        next();
    } catch (err) {
        res.status(400).send(err);
    }
};
