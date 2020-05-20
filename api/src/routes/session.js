const router = require('express').Router();

const verifyToken = require('../middlewares/verifyToken');
const Test = require('../models/Test');
const User = require('../models/User');
const Session = require('../models/Session');


router.get('/', verifyToken, async (req, res) => {
    const { id: userId } = req.user;

    try {
        const user = User.findById(userId);
        const { sessions } = user;
        const returnSessions = await Promise.all(
            sessions.map(async testId => {
                const test = await Test.findById(testId);
                const session = await Session.findOne({
                    user: userId,
                    test: testId,
                });
                return {
                    name: test.name,
                    authors: test.authors,
                    description: test.description,
                    category: test.category,
                    completion:
                        (100 - Math.round(((session.questions.length / session.numberOfQuestions) *
                        100))),
                };
            })
        );
        res.json(returnSessions);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/test_id', verifyToken, async (req, res) => {
    const { user } = req;
    const { test_id } = req.params;

    try {
        const session = await Session.findOne({
            user: user.id,
            test: test_id,
        }).orFail();
        delete session.user;
        delete session.test;
        delete session.numberOfQuestions;
        res.json(session);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/test_id', verifyToken, async (req, res) => {
    const { user } = req;
    const { test_id } = req.params;
    const { penalty, questions } = req.body;

    try {
        // create a session
        const sessionDetails = {
            user: user.id,
            test: test_id,
            numberOfQuestions: questions.length,
            penalty,
            answers: 0,
            correctAnswers: 0,
            questions,
        };
        const session = new Session(sessionDetails);
        await session.save();

        // bind a session to user - store test id, not the session id - therefore, if session id will somehow change,
        // it will not affect anything
        await User.findByIdAndUpdate(
            user.id,
            { $addToSet: { sessions: [test_id] } },
            { new: true }
        ).orFail();

        res.send();
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put('/test_id', verifyToken, async (req, res) => {
    const { user } = req;
    const { test_id } = req.params;
    const { questions, answers, correctAnswers } = req.body;

    try {
        const session = await Session.findOneAndUpdate(
            { user: user.id, test: test_id },
            { $set: { questions: questions, answers: answers, correctAnswers: correctAnswers } },
            { new: true }
        ).orFail();
        console.log(session);
        res.status(202).send();
    } catch (err) {
        res.status(400).send(err);
    }
});

// deletes the session
router.delete('/test_id', verifyToken, async (req, res) => {
    const { user } = req;
    const { test_id } = req.params;

    try {
        // delete the session
        await Session.findOneAndDelete({
            user: user.id,
            test: test_id,
        }).orFail();
        // unbind the session from user
        await User.findByIdAndUpdate(user.id, {
            $pull: { sessions: [test_id] },
        }).orFail();
        res.status(202).send();
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
