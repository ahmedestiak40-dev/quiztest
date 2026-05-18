// backend/controllers/result.controller.js
const Result = require('../models/Result.model');
const Quiz = require('../models/Quiz.model');
const Question = require('../models/Question.model');
const User = require('../models/User.model');

// Submit Quiz Answers
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    const userId = req.user.id;
    
    // Check if already submitted
    const existingResult = await Result.findOne({ userId, quizId });
    if (existingResult) {
      return res.status(400).json({ message: 'Quiz already submitted' });
    }
    
    // Get quiz and questions
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    const questions = await Question.find({ quizId });
    
    // Calculate score
    let totalScore = 0;
    let obtainedScore = 0;
    const processedAnswers = [];
    
    for (const question of questions) {
      totalScore += question.marks;
      
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      
      if (userAnswer) {
        let isCorrect = false;
        
        if (question.questionType === 'MCQ') {
          isCorrect = userAnswer.answer === question.correctAnswer;
        } else if (question.questionType === 'TrueFalse') {
          isCorrect = userAnswer.answer === question.correctAnswer;
        } else if (question.questionType === 'MultipleSelect') {
          const userAnswers = Array.isArray(userAnswer.answer) ? userAnswer.answer : [userAnswer.answer];
          const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
          isCorrect = userAnswers.length === correctAnswers.length &&
                     userAnswers.every(a => correctAnswers.includes(a));
        }
        
        if (isCorrect) {
          obtainedScore += question.marks;
        }
        
        processedAnswers.push({
          questionId: question._id,
          userAnswer: userAnswer.answer,
          isCorrect,
          marksObtained: isCorrect ? question.marks : 0
        });
      } else {
        processedAnswers.push({
          questionId: question._id,
          userAnswer: null,
          isCorrect: false,
          marksObtained: 0
        });
      }
    }
    
    const percentage = (obtainedScore / totalScore) * 100;
    
    // Save result
    const result = await Result.create({
      userId,
      quizId,
      answers: processedAnswers,
      score: obtainedScore,
      totalScore,
      percentage,
      timeTaken,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: {
        totalScore: obtainedScore,
        quizzesTaken: 1
      },
      $push: {
        quizHistory: {
          quizId,
          score: obtainedScore,
          totalScore,
          percentage,
          timeTaken,
          submittedAt: new Date()
        }
      }
    });
    
    // Update quiz stats
    const allResults = await Result.find({ quizId });
    const avgScore = allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length;
    
    await Quiz.findByIdAndUpdate(quizId, {
      $inc: { attempts: 1 },
      averageScore: avgScore
    });
    
    res.json({
      success: true,
      data: {
        score: obtainedScore,
        totalScore,
        percentage,
        timeTaken,
        answers: processedAnswers
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Results
exports.getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id })
      .populate('quizId', 'title category difficulty totalMarks')
      .sort('-submittedAt');
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const leaderboard = await User.find({ role: 'user', isActive: true })
      .select('name totalScore quizzesTaken')
      .sort('-totalScore')
      .limit(limit);
    
    // Get user rank if logged in
    let userRank = null;
    if (req.user) {
      const users = await User.find({ role: 'user', isActive: true })
        .select('totalScore')
        .sort('-totalScore');
      
      const rank = users.findIndex(u => u._id.toString() === req.user.id) + 1;
      userRank = rank > 0 ? rank : null;
    }
    
    res.json({
      success: true,
      data: leaderboard,
      userRank
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};