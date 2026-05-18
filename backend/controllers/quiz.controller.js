// backend/controllers/quiz.controller.js
const Quiz = require('../models/Quiz.model');
const Question = require('../models/Question.model');
const Result = require('../models/Result.model');

// Create Quiz
exports.createQuiz = async (req, res) => {
  try {
    const quizData = {
      ...req.body,
      createdBy: req.user.id
    };

    const quiz = await Quiz.create(quizData);
    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Quizzes with filters
exports.getAllQuizzes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let query = { isPublished: true };
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by difficulty
    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty;
    }
    
    // Search by title
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }
    
    const quizzes = await Quiz.find(query)
      .populate('createdBy', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);
    
    const total = await Quiz.countDocuments(query);
    
    res.json({
      success: true,
      data: quizzes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Quiz by ID with questions
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Get questions without correct answers for regular users
    const questions = await Question.find({ quizId: quiz._id })
      .select('-correctAnswer');
    
    // Check if user has already taken this quiz
    let hasTaken = false;
    let userResult = null;
    
    if (req.user) {
      userResult = await Result.findOne({
        userId: req.user.id,
        quizId: quiz._id
      });
      hasTaken = !!userResult;
    }
    
    res.json({
      success: true,
      data: {
        ...quiz.toObject(),
        questions,
        hasTaken,
        userResult
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Quiz
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check ownership
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedQuiz
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Check ownership
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete associated questions and results
    await Question.deleteMany({ quizId: quiz._id });
    await Result.deleteMany({ quizId: quiz._id });
    await quiz.deleteOne();
    
    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Quiz Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Quiz.aggregate([
      { $match: { isPublished: true } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 }
      }},
      { $project: {
        name: '$_id',
        count: 1,
        _id: 0
      }}
    ]);
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};