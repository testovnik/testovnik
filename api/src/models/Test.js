const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 500,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    authors: [
        {
            id: {
                type: String,
                required: true,
            },
            username: {
                type: String,
                required: true,
            }
        },
    ],
    description: {
        type: String,
        required: false,
    },
    // QUEST: should we create some data structure holding possible / existing tags?
    tags: [
        {
            type: String,
            max: 64,
        },
    ],
    category: {
        type: String,
        required: true,
    },
    questions: [String],
});

testSchema.index({
    description: 'text',
    tags: 'text',
    category: 'text',
    name: 'text',
});

module.exports = mongoose.model('Test', testSchema);
