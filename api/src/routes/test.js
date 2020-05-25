const router = require('express').Router();
const mongoose = require('mongoose');

const verifyToken = require('../middlewares/verifyToken');
const verifyAccess = require('../middlewares/verifyTestAccess');
const compareArrays = require('../utils/compareArrays');

const Test = require('../models/Test');
const Question = require('../models/Question');
const User = require('../models/User');
const Session = require('../models/Session');

const { testCreationValidation, questionValidation } = require('../validate');
const { createTestToken, verifyTestToken } = require('../utils/verifyToken');

const verify = [verifyToken, verifyAccess];

// TESTS

router.get('/', async (req, res) => {
    const { query } = req.body;

    try {
        const tests = await Test.find({
            $text: { $search: query },
        }).orFail();

        res.json(tests);
    } catch (err) {
        res.status(400).send(err);
    }
});

// create new empty test
router.post('/', verifyToken, async (req, res) => {
    const { error, value } = testCreationValidation(req.body);
    const { id: userId, username } = req.user;

    if (error)
        return res
            .status(400)
            .send(error.details.map(detail => detail.message));

    // initialize new test
    const initializedTest = {
        ...value,
        authors: [{ id: userId, username }],
        questions: [],
    };
    const test = new Test(initializedTest);

    try {
        const savedTest = await test.save();
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { userTests: [test._id] } },
            { new: true }
        );
        res.json(savedTest);
    } catch (err) {
        res.status(400).send(err);
    }
});

// get the test without actual questions
router.get('/:test_id', async (req, res) => {
    const { test_id } = req.params;
    try {
        const test = await Test.findById(test_id).orFail();
        res.json(test);
    } catch (err) {
        res.status(404).send(err);
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

// deletes the test
router.delete('/:test_id', verify, async (req, res) => {
    const { test_id } = req.params;

    try {
        const test = await Test.findByIdAndDelete(test_id).orFail();
        const authorIds = test.authors.map(author =>
            mongoose.Types.ObjectId(author.id)
        );
        await User.updateMany(
            { id: { $in: authorIds } },
            { $pull: { userTests: test._id } }
        ).orFail();
        await User.updateMany(
            { favouriteTests: test_id },
            { $pull: { favouriteTests: test_id } }
        ).orFail();
        await Question.deleteMany({ test: test_id }).orFail();
        res.send(test);
    } catch (err) {
        res.status(400).send(err);
    }
});

// QUESTIONS

// get all questions in the test
// the only use case I can see right now, is in modifying the test,
// therefore, I do send the correct answers, but the endpoint is restricted to
// test authors only
router.get('/:test_id/questions', verify, async (req, res) => {
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
        // do not send correct answers
        delete question.correctAnswers;
        res.json(question);
    } catch (err) {
        res.status(400).json({ error: 'No such question in this test' });
    }
});

// create new question
router.post('/:test_id/questions', verify, async (req, res) => {
    const { test_id } = req.params;
    const { error, value } = questionValidation(req.body);

    if (error)
        return res
            .status(400)
            .send(error.details.map(detail => detail.message));

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
        res.json(savedQuestion);
    } catch (e) {
        res.status(400).send(e);
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
        const question = await Question.findOneAndUpdate(
            { _id: question_id, test: test_id },
            req.body,
            {
                new: true,
            }
        ).orFail();
        res.send(question);
    } catch (err) {
        res.status(400).send(err);
    }
});

// TODO: this endpoint does not use `test_id` - consider removing it
router.get(
    '/:test_id/questions/:question_id/check',
    async (req, res) => {
        const { question_id } = req.params;
        const { answers } = req.body;

        try {
            const question = Question.findById(question_id);
            const { correctAnswers } = question;
            const areAnswersCorrect = compareArrays(answers, correctAnswers);

            if (areAnswersCorrect) {
                req.send('proper');
            } else {
                res.status(409).json({ correctAnswers });
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

// delete all questions in the test
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

// removes single question with id
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

// returns authors of the test we should find a way to remove them if necessary,
// but should any from the authors remove any other?
router.get('/:test_id/authors', async (req, res) => {
    const { test_id } = req.params;
    try {
        const { authors: authorIds } = await Test.findById(test_id).orFail();
        const authors = await Promise.all(
            authorIds.map(async userId => {
                const user = await User.findById(userId).orFail();
                return { id: userId, username: user.username };
            })
        );
        res.send(authors);
    } catch (err) {
        res.status(404).send();
    }
});

// returns a token that will have to be passed as a query to a link, that will add
// an existing user who enters the link, to authors of the test, giving permissions
// to modify it.
router.get('/:test_id/authors/add', verify, async (req, res) => {
    const { test_id } = req.params;
    const token = createTestToken(test_id);
    res.json({ token });
});

// adds a user with valid test token to the authors of the test
// it will allow him / her / (insert whoever you feel like here)
// to modify the test
router.put('/authors/add', verifyToken, async (req, res) => {
    const { token } = req.query;
    const { user } = req;
    const testId = verifyTestToken(token);

    if (!testId) return res.status(404).send();

    try {
        await Test.findByIdAndUpdate(
            testId,
            {
                $addToSet: { authors: [user] },
            },
            { new: true }
        );
        await User.findByIdAndUpdate(user.id, {
            $addToSet: { userTests: [testId] },
        }).orFail();
        res.send('success');
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
