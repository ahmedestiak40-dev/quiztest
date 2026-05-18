import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete, Quiz } from '@mui/icons-material';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/quizzes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch quizzes');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/quizzes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Quiz deleted');
        fetchQuizzes();
      } catch (error) {
        toast.error('Failed to delete quiz');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Button
          component={Link}
          to="/admin/create-quiz"
          variant="contained"
          startIcon={<Add />}
        >
          Create New Quiz
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                All Quizzes
              </Typography>
              
              {quizzes.length === 0 ? (
                <Typography color="text.secondary">No quizzes created yet.</Typography>
              ) : (
                <List>
                  {quizzes.map((quiz) => (
                    <ListItem
                      key={quiz._id}
                      secondaryAction={
                        <Box>
                          <IconButton
                            component={Link}
                            to={`/admin/manage-questions/${quiz._id}`}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteQuiz(quiz._id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Quiz />
                            <Typography variant="subtitle1" fontWeight="bold">
                              {quiz.title}
                            </Typography>
                            <Chip label={quiz.category} size="small" />
                            <Chip 
                              label={quiz.difficulty} 
                              size="small" 
                              color={quiz.difficulty === 'Easy' ? 'success' : quiz.difficulty === 'Medium' ? 'warning' : 'error'}
                            />
                          </Box>
                        }
                        secondary={`Questions: ${quiz.questionsCount || 0} | Total Marks: ${quiz.totalMarks || 0}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;