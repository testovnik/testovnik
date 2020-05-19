const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 2,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    favouriteTests: [
        {
            type: String,
        }
    ],
    userTests: [String],
    sessions: [String],
    date: {
        type: Date,
        default: Date.now,
    },
});

userSchema.index({ username: 'text' });

module.exports = mongoose.model('User', userSchema);
