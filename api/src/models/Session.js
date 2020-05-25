const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    test: {
        type: String,
        required: true
    },
    /// defines how many questions the test initially has
    numberOfQuestions: Number,
    /// defines, how many repeats will be added if the user chooses wrong answer, or not all answers
    penalty: {
        type: Number,
        required: true
    },
    /// stores the number of all answers
    answers: Number,
    /// stores teh number of proper answers
    correctAnswers: Number,
    /// stores the questions, that have to be asked with the number of repeats left for each question
    questions: [
        {
            id: {
                type: String,
                required: true,
            },
            repeats: {
                type: Number,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Session', sessionSchema);
