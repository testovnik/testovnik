const router = require('express').Router();

const verifyToken = require('../middlewares/verifyToken');
const Test = require('../models/Test');
const User = require('../models/User');


router.get('/', async (req, res) => {
    const { query } = req.body;
    const searchQuery =
        !query || query === '' ? {} : { $text: { $search: query } };

    try {
        const users = await User.find(searchQuery).orFail();
        const returnUsers = await Promise.all(
            users.map(async user => ({
                id: user._id,
                username: user.username,
                userTests: user.userTests.map(async testId => {
                    const test = await Test.findById(testId).orFail();
                    return {
                        id: test._id,
                        name: test.name,
                        category: test.category,
                        tags: test.tags,
                        date: test.date,
                    };
                }),
            }))
        );

        res.send(returnUsers);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await User.findById(user_id).orFail();
        const userTests = await Promise.all(
            user.userTests.map(async testId => {
                const test = await Test.findById(testId).orFail();
                return {
                    id: test.id,
                    name: test.name,
                    category: test.category,
                    tags: test.tags,
                    date: test.date,
                };
            })
        );
        const returnUser = { id: user._id, username: user.username, userTests };

        res.send(returnUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

// returns tests to which the user has rights to modify -> is one of authors
router.get('/:user_id/user_tests', async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await User.findById(user_id).orFail();
        const userTestIds = user.user_tests;
        const userTests = await Test.find({
            _id: {
                $in: userTestIds.map(testId => mongoose.Types.ObjectId(testId)),
            },
        }).orFail();

        const tests = userTests.map(test => ({
            id: test._id,
            name: test.name,
            category: test.category,
            tags: test.tags,
        }));

        res.json(tests);
    } catch (err) {
        res.status(400).send(err);
    }
});

// returns tests to which the user has rights to modify -> is one of authors
router.get('/myself/user_tests', verifyToken, async (req, res) => {
    const { id: userId } = req.user;

    try {
        const user = await User.findById(userId).orFail();
        const userTestIds = user.user_tests;
        const userTests = await Test.find({
            _id: {
                $in: userTestIds.map(testId => mongoose.Types.ObjectId(testId)),
            },
        }).orFail();

        const tests = userTests.map(test => ({
            id: test._id,
            name: test.name,
            category: test.category,
            tags: test.tags,
            date: test.date,
        }));

        res.json(tests);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/myself', verifyToken, async (req, res) => {
    const { id: userId } = req.user;

    try {
        const user = User.findById(userId).orFail();
        user.delete(password);
        res.send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put('/myself/password', verifyToken, async (req, res) => {
    const { id: userId } = req.user;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = User.findById(userId).orFail();

        const validPass = await bcrypt.compare(oldPassword, user.password);
        if (!validPass) return res.status(400).send('Invalid password');

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findByIdAndUpdate(userId, {
            password: newHashedPassword,
        }).orFail();

        res.send('success');
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put('/myself/email', verifyToken, async (req, res) => {
    const { id: userId } = req.user;
    const { oldEmail, newEmail } = req.body;

    try {
        const user = User.findById(userId).orFail();

        if (user.email !== oldEmail)
            return res.status(400).send('Invalid email');

        await User.findByIdAndUpdate(userId, { email: newEmail });

        res.json({ email: newEmail });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/myself', verifyToken, async (req, res) => {
    const { id: userId } = req.user;

    try {
        await User.findByIdAndRemove(userId).orFail();

        res.send('success');
    } catch (err) {
        res.status(400).send(err);
    }
});

// returns users favourite tests, works only with registered user
router.get('/myself/favourite_tests', verifyToken, async (req, res) => {
    const { id: userId } = req.user;

    try {
        const user = await User.findById(userId).orFail();
        const favouriteTestIds = user.favourite_tests;
        const favouriteTests = await Test.find({
            _id: {
                $in: favouriteTestIds.map(testId =>
                    mongoose.Types.ObjectId(testId)
                ),
            },
        }).orFail();

        const tests = favouriteTests.map(test => ({
            id: test._id,
            name: test.name,
            category: test.category,
            tags: test.tags,
        }));

        res.json(tests);
    } catch (err) {
        res.status(400).send(err);
    }
});

// add test to users favourite
router.put(
    '/myself/favourite_tests/:test_id',
    verifyToken,
    async (req, res) => {
        const { id: userId } = req.user;
        const { test_id } = req.params;

        try {
            // check if the test actually exists, so we do not add phantom tests.
            await Test.findById(test_id).orFail();
            const user = await User.findByIdAndUpdate(
                userId,
                { $addToSet: { favourite_tests: [test_id] } },
                { new: true }
            ).orFail();

            res.send(user.favourite_tests);
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

// remove test with id from favourites
router.delete(
    '/myself/favourite_tests/:test_id',
    verifyToken,
    async (req, res) => {
        const { test_id } = req.params;
        const { id: userId } = req.user;

        try {
            // no need to check if the test exists, since we just remove its id from
            // user's array
            const user = await User.findByIdAndUpdate(userId, {
                $pull: { favourite_tests: test_id },
            }).orFail();

            res.send('success');
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

module.exports = router;
