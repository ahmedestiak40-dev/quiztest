// backend/routes/quiz.routes.js
const router = require('express').Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getCategories
} = require('../controllers/quiz.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.get('/', getAllQuizzes);
router.get('/categories', getCategories);
router.get('/:id', protect, getQuizById);
router.post('/', protect, admin, createQuiz);
router.put('/:id', protect, admin, updateQuiz);
router.delete('/:id', protect, admin, deleteQuiz);

module.exports = router;