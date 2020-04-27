const router = require('express').Router();

const verifyToken = require('../middlewares/verifyToken');
const verifyAccess = require('../middlewares/verifyTestAccess');
const Test = require('../models/Test');
const Question = require('../models/Question');
const User = require('../models/User');
const { testCreationValidation, questionValidation } = require('../validate');
const { createTestToken, verifyTestToken } = require('../utils/verifyToken');

const verify = [verifyToken, verifyAccess];

// get the whole test
router.get('/:test_id', async (req, res) => {
    const { test_id } = req.params;
    try {
        const test = await Test.findById(test_id).orFail();
        res.json(test);
    } catch (err) {
        res.status(404).send(err);
    }
});

// get all questions in the test
router.get('/:test_id/questions', async (req, res) => {
    const { test_id } = req.params;
    const questions = await Question.find({ test: test_id });
    res.json(questions);
});

// get question
router.get('/:test_id/questions/:question_id', async (req, res) => {
    const { test_id, question_id } = req.params;
    try {
        const question = Question.findOne({
            _id: question_id,
            test: test_id,
        }).orFail();
        res.json(question);
    } catch (err) {
        res.status(400).json({ error: 'No such question in this test' });
    }
});

router.get('/:test_id/authors', async (req, res) => {
    const { test_id } = req.params;
    try {
        const { authors: authorIds } = await Test.findById(test_id).orFail();
        const authors = await Promise.all(
            authorIds.map(async (userId) => {
                const user = await User.findById(userId).orFail();
                return user.username;
            })
        );
        res.send(authors);
    } catch (err) {
        res.status(404).send(err);
    }
});

router.get('/', async (req, res) => {
    const { query } = req.body;

    // not sure if this monstrosity works.
    try {
        // this seems like a good idea to filter the results using the authors indexes
        // const users = await User.find(
        //     // i have a feeling, that in extreme cases, this could catch up to hashed password of the user
        //     { $text: { $search: query } }
        // ).orFail();
        // const userIds = users.map((user) => user._id);
        const tests = await Test.find({
            $text: { $search: query },
            // $or: [{ $text: { $search: query } }, { authors: { $in: userIds } }],
            // authors: { $in: userIds },
        }).orFail();

        res.json(tests);
    } catch (err) {
        res.status(400).send(err);
    }
});

// create new empty test
router.post('/', verifyToken, async (req, res) => {
    const { error, value } = testCreationValidation(req.body);

    if (error)
        return res
            .status(400)
            .send(error.details.map((detail) => detail.message));

    // initialize new test
    const initializedTest = {
        ...value,
        authors: value.authors || [req.user._id],
        questions: [],
    };
    const test = new Test(initializedTest);

    try {
        const savedTest = await test.save();
        res.json({ test_id: savedTest._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

// create new question
router.post('/:test_id/questions', verify, async (req, res) => {
    const { test_id } = req.params;
    const { error, value } = questionValidation(req.body);

    if (error)
        return res
            .status(400)
            .send(error.details.map((detail) => detail.message));

    const question = new Question({ ...value, test: test_id });

    try {
        // it will throw error, if the test_id does not exist, preventing from
        // storing the question
        await Test.findOneAndUpdate(
            { _id: test_id },
            { $addToSet: { questions: [question._id] } },
            { new: true }
        ).orFail();
        const savedQuestion = await question.save();
        res.json(savedQuestion._id);
    } catch (e) {
        res.status(400).send(e);
    }
});

// returns a token that will have to be passed as a query to a link, that will add
// an existing user who enters the link, to authors of the test, giving permissions
// to modify it.
router.get('/:test_id/authors/add', verify, async (req, res) => {
    const { token_id } = req.params;
    const token = createTestToken(token_id);
    res.json({ token });
});

router.put('/authors/add', verifyToken, async (req, res) => {
    const { token } = req.query;
    const { _id: userId } = req.user;
    const testId = verifyTestToken(token);

    if (!testId) return res.status(404).send();

    try {
        await Test.findByIdAndUpdate(
            testId,
            {
                $addToSet: { authors: [userId] },
            },
            { new: true }
        );
        res.send('success');
    } catch (err) {
        res.status(400).send(err);
    }
});

// update question in the test
router.put('/:test_id/questions/:question_id', verify, async (req, res) => {
    const { test_id, question_id } = req.params;

    if (req.body._id || req.body.test)
        return res
            .status(400)
            .json({ error: 'tried changing immutable fields' });

    try {
        await Question.findOneAndUpdate(
            { _id: question_id, test: test_id },
            req.body,
            {
                new: true,
            }
        ).orFail();
        res.send('success');
    } catch (err) {
        res.status(400).send(err);
    }
});

// update test (cannot modify answers and authors)
router.put('/:test_id', verify, async (req, res) => {
    const { test_id } = req.params;

    if (req.body._id || req.body.questions || req.body.authors)
        return res
            .status(400)
            .json({ error: 'tried changing immutable fields' });

    try {
        const newTest = await Test.findByIdAndUpdate(test_id, req.body, {
            new: true,
        }).orFail();
        res.json(newTest);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/:test_id', verify, async (req, res) => {
    const { test_id } = req.params;

    try {
        const test = await Test.findByIdAndDelete(test_id).orFail();
        await Question.deleteMany({ test: test_id }).orFail();
        res.send(test);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/:test_id/questions', verify, async (req, res) => {
    const { test_id } = req.params;

    try {
        const { deletedCount } = await Question.deleteMany({
            test: test_id,
        }).orFail();
        await Test.findByIdAndUpdate(test_id, { $set: { questions: [] } });
        res.send(deletedCount);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/:test_id/questions/:question_id', verify, async (req, res) => {
    const { test_id, question_id } = req.params;

    try {
        const question = await Question.findByIdAndDelete(question_id).orFail();
        await Test.findByIdAndUpdate(test_id, {
            $pull: { questions: question_id },
        });
        res.send(question);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
