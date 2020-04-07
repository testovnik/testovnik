const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 128,
  },
  // '1'
  // '1.01_beta1' does it even make sense?
  // will we increase it automatically? only when user do not change the
  // version himself? do we even need it?
  version: {
    type: String,
    required: true,
    min: 1,
    max: 50,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // if we allow many users to create one test, do we store only the user who
  // initially created the test, or store all users, who have modified or been
  // invited to create / modify it?
  authorIds: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: false,
    max: 1024,
  },
  // QUEST: should we create some data structure holding possible / existing tags?
  tags: [
    {
      type: String,
      max: 32,
    },
  ],
  category: {
    type: String,
    required: true,
  },
  questions: [
    {
      id: {
        type: Number,
      },
      // we could allow for simple questions e.g. instead a) One b) Two
      // insert One, Two
      questionType: {
        type: String,
      },
      text: {
        type: String,
        required: true,
      },
      answers: [
        {
          id: {
            type: Number,
          },
          text: {
            type: String,
          },
        },
      ],
      correctAnswers: [
        {
          // either "1", "2" if closed question or
          // "One", "Two" if open question
          type: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Test', testSchema);