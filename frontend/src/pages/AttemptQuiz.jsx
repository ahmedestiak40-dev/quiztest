// frontend/src/pages/AttemptQuiz.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  LinearProgress,
  Box,
  Alert,
  Checkbox,
  Paper,
} from '@mui/material';
import { Timer } from '@mui/icons-material';
import toast from 'react-hot-toast';

const AttemptQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  
  useEffect(() => {
    fetchQuiz();
    
    // Anti-cheat: Detect tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchWarning(true);
        toast.error('Warning: Tab switching detected!', { duration: 3000 });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [id]);
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz) {
      handleSubmit();
    }
  }, [timeLeft]);
  
  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.data.hasTaken) {
        toast.error('You have already taken this quiz');
        navigate(`/result/${id}`);
        return;
      }
      
      setQuiz(response.data.data);
      setQuestions(response.data.data.questions);
      setTimeLeft(response.data.data.timer);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load quiz');
      navigate('/categories');
    }
  };
  
  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmit = async () => {
    if (submitting) return;
    
    // Check if all questions answered
    const unanswered = questions.filter((q) => !answers[q._id]);
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions (${unanswered.length} remaining)`);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));
      
      const timeTaken = quiz.timer - timeLeft;
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/results/submit`,
        {
          quizId: id,
          answers: formattedAnswers,
          timeTaken,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      toast.success('Quiz submitted successfully!');
      navigate(`/result/${id}`, { state: { result: response.data.data } });
    } catch (error) {
      toast.error('Failed to submit quiz');
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Container>
        <LinearProgress />
      </Container>
    );
  }
  
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Quiz Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, position: 'sticky', top: 0, zIndex: 10 }}>
        <Typography variant="h5" gutterBottom>
          {quiz.title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timer color="error" />
            <Typography variant="h6" color={timeLeft < 30 ? 'error' : 'text.primary'}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Typography>
          </Box>
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
      </Paper>
      
      {/* Tab Switch Warning */}
      {tabSwitchWarning && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Please stay on this tab while taking the quiz. Tab switching is not allowed.
        </Alert>
      )}
      
      {/* Question Card */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {question.questionText}
          </Typography>
          
          <FormControl component="fieldset" sx={{ width: '100%', mt: 3 }}>
            {question.questionType === 'MCQ' && (
              <RadioGroup
                value={answers[question._id] || ''}
                onChange={(e) => handleAnswer(question._id, e.target.value)}
              >
                {question.options.map((option, idx) => (
                  <FormControlLabel
                    key={idx}
                    value={option.text}
                    control={<Radio />}
                    label={option.text}
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
            )}
            
            {question.questionType === 'TrueFalse' && (
              <RadioGroup
                value={answers[question._id] || ''}
                onChange={(e) => handleAnswer(question._id, e.target.value)}
              >
                <FormControlLabel value="True" control={<Radio />} label="True" />
                <FormControlLabel value="False" control={<Radio />} label="False" />
              </RadioGroup>
            )}
            
            {question.questionType === 'MultipleSelect' && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={answers[question._id] || false}
                    onChange={(e) => handleAnswer(question._id, e.target.checked)}
                  />
                }
                label="Select all that apply (coming soon)"
              />
            )}
          </FormControl>
        </CardContent>
      </Card>
      
      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        {currentQuestion === questions.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default AttemptQuiz;