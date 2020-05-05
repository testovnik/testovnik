const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    test: {
        type: String,
        required: true,
    },
    answers: [
        {
            id: Number,
            text: {
                type: String,
                required: true,
            },
        },
    ],
    correctAnswers: [
        {
            type: Number,
        },
    ],
});

questionSchema.index({ text: 'text' });

module.exports = mongoose.model('Question', questionSchema);
