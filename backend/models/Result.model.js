// backend/models/Result.model.js
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    userAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    marksObtained: Number
  }],
  score: {
    type: Number,
    required: true,
    default: 0
  },
  totalScore: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String
});

// Index for faster queries
resultSchema.index({ userId: 1, quizId: 1 }, { unique: true });
resultSchema.index({ quizId: 1, score: -1 });

module.exports = mongoose.model('Result', resultSchema);