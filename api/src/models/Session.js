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
    /// defines, with how many repeats, each question will start
    numberOfRepeats: {
        type: Number,
        required: true
    },
    /// defines, how many repeats will be added if the user chooses wrong answer, or not all answers
    penaltyRepeats: {
        type: Number,
        required: true
    },
    /// stores the number of all answers
    answersNumber: Number,
    /// stores teh number of proper answers
    properAnswersNumber: Number,
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
