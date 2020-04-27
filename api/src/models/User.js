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
    // NOTE:QUEST: I do not know, if this should be required. I really do not
    // see this as really needed. However, it either should be `required`,
    // or if one of these will be entered in client, then the client should
    // require the other one.
    firstName: {
        type: String,
        required: false,
        max: 100,
        min: 2,
    },
    lastName: {
        type: String,
        required: false,
        max: 100,
        min: 2,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

userSchema.index({ username: 'text', firstName: 'text', lastName: 'text' });

module.exports = mongoose.model('User', userSchema);
