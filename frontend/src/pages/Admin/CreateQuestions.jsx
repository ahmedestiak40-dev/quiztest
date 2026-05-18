import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  Alert,
} from '@mui/material';
import { Add, Delete, Save, Cancel } from '@mui/icons-material';
import toast from 'react-hot-toast';

const CreateQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    questionType: 'MCQ',
    options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
    correctAnswer: '',
    marks: 1,
    explanation: '',
  });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchQuizDetails();
    fetchExistingQuestions();
  }, [quizId]);

  const fetchQuizDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes/${quizId}`);
      setQuiz(response.data.data);
    } catch (error) {
      toast.error('Failed to load quiz');
    }
  };

  const fetchExistingQuestions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/questions/admin/quiz/${quizId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch questions', error);
    }
  };

  const handleAddOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { text: '', isCorrect: false }],
    });
  };

  const handleRemoveOption = (index) => {
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index][field] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const handleSubmitQuestion = async () => {
    // Validate
    if (!currentQuestion.questionText) {
      toast.error('Please enter question text');
      return;
    }

    if (currentQuestion.questionType === 'MCQ') {
      const hasCorrect = currentQuestion.options.some(opt => opt.isCorrect);
      if (!hasCorrect) {
        toast.error('Please select at least one correct answer');
        return;
      }
    }

    try {
      let response;
      if (editing) {
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/questions/${editId}`,
          currentQuestion,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Question updated successfully');
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/questions/quiz/${quizId}`,
          currentQuestion,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Question added successfully');
      }

      resetForm();
      fetchExistingQuestions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save question');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/questions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Question deleted');
        fetchExistingQuestions();
      } catch (error) {
        toast.error('Failed to delete question');
      }
    }
  };

  const handleEditQuestion = (question) => {
    setCurrentQuestion({
      questionText: question.questionText,
      questionType: question.questionType,
      options: question.options,
      correctAnswer: question.correctAnswer,
      marks: question.marks,
      explanation: question.explanation || '',
    });
    setEditing(true);
    setEditId(question._id);
  };

  const resetForm = () => {
    setCurrentQuestion({
      questionText: '',
      questionType: 'MCQ',
      options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
      correctAnswer: '',
      marks: 1,
      explanation: '',
    });
    setEditing(false);
    setEditId(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Questions: {quiz?.title}
      </Typography>

      <Grid container spacing={3}>
        {/* Add/Edit Question Form */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {editing ? 'Edit Question' : 'Add New Question'}
              </Typography>

              <TextField
                fullWidth
                label="Question Text"
                multiline
                rows={3}
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Question Type</InputLabel>
                <Select
                  value={currentQuestion.questionType}
                  label="Question Type"
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionType: e.target.value })}
                >
                  <MenuItem value="MCQ">Multiple Choice</MenuItem>
                  <MenuItem value="TrueFalse">True/False</MenuItem>
                </Select>
              </FormControl>

              {currentQuestion.questionType === 'MCQ' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Options
                  </Typography>
                  {currentQuestion.options.map((option, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder={`Option ${idx + 1}`}
                        value={option.text}
                        onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                      />
                      <Button
                        variant={option.isCorrect ? 'contained' : 'outlined'}
                        color={option.isCorrect ? 'success' : 'primary'}
                        onClick={() => handleOptionChange(idx, 'isCorrect', !option.isCorrect)}
                        size="small"
                      >
                        Correct
                      </Button>
                      {currentQuestion.options.length > 2 && (
                        <IconButton color="error" onClick={() => handleRemoveOption(idx)}>
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Button startIcon={<Add />} onClick={handleAddOption} size="small">
                    Add Option
                  </Button>
                </Box>
              )}

              {currentQuestion.questionType === 'TrueFalse' && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Correct Answer</InputLabel>
                  <Select
                    value={currentQuestion.correctAnswer}
                    label="Correct Answer"
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                  >
                    <MenuItem value="True">True</MenuItem>
                    <MenuItem value="False">False</MenuItem>
                  </Select>
                </FormControl>
              )}

              <TextField
                fullWidth
                type="number"
                label="Marks"
                value={currentQuestion.marks}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) })}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Explanation (Optional)"
                multiline
                rows={2}
                value={currentQuestion.explanation}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSubmitQuestion}
                  fullWidth
                >
                  {editing ? 'Update Question' : 'Add Question'}
                </Button>
                {editing && (
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Questions List */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Questions List ({questions.length})
              </Typography>

              {questions.length === 0 ? (
                <Alert severity="info">No questions added yet. Add your first question!</Alert>
              ) : (
                questions.map((q, idx) => (
                  <Paper key={q._id} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Q{idx + 1}. {q.questionText}
                        </Typography>
                        <Chip 
                          label={q.questionType} 
                          size="small" 
                          sx={{ mt: 1, mr: 1 }}
                        />
                        <Chip 
                          label={`${q.marks} mark${q.marks > 1 ? 's' : ''}`} 
                          size="small" 
                          color="primary"
                          sx={{ mt: 1 }}
                        />
                        {q.questionType === 'MCQ' && (
                          <Box sx={{ mt: 1 }}>
                            {q.options.map((opt, i) => (
                              <Typography key={i} variant="body2" color={opt.isCorrect ? 'success.main' : 'text.secondary'}>
                                {opt.isCorrect && '✓ '}{opt.text}
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                      <Box>
                        <IconButton onClick={() => handleEditQuestion(q)} color="primary">
                          <Save />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteQuestion(q._id)} color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateQuestions;