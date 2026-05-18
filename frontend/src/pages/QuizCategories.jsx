import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Pagination,
} from '@mui/material';
import {
  Search,
  Code,
  Science,
  History,
  SportsEsports,
  Business,
  School,
  Timeline,
} from '@mui/icons-material';

const QuizCategories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockQuizzes = [
        { id: 1, title: 'JavaScript Fundamentals', category: 'Programming', difficulty: 'Medium', questions: 30, time: '45 min', attempts: 1234, rating: 4.5 },
        { id: 2, title: 'Python Programming', category: 'Programming', difficulty: 'Easy', questions: 25, time: '30 min', attempts: 987, rating: 4.7 },
        { id: 3, title: 'React.js Mastery', category: 'Programming', difficulty: 'Hard', questions: 40, time: '60 min', attempts: 756, rating: 4.8 },
        { id: 4, title: 'Physics Basics', category: 'Science', difficulty: 'Medium', questions: 20, time: '30 min', attempts: 543, rating: 4.3 },
        { id: 5, title: 'World History', category: 'History', difficulty: 'Medium', questions: 35, time: '45 min', attempts: 876, rating: 4.6 },
        { id: 6, title: 'Geography Quiz', category: 'Geography', difficulty: 'Easy', questions: 25, time: '25 min', attempts: 654, rating: 4.4 },
        { id: 7, title: 'Gaming Trivia', category: 'Entertainment', difficulty: 'Easy', questions: 30, time: '35 min', attempts: 2345, rating: 4.9 },
        { id: 8, title: 'Business Management', category: 'Business', difficulty: 'Hard', questions: 45, time: '60 min', attempts: 432, rating: 4.2 },
      ];
      setQuizzes(mockQuizzes);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { id: 'all', name: 'All Categories', icon: <School /> },
    { id: 'Programming', name: 'Programming', icon: <Code /> },
    { id: 'Science', name: 'Science', icon: <Science /> },
    { id: 'History', name: 'History', icon: <History /> },
    { id: 'Entertainment', name: 'Entertainment', icon: <SportsEsports /> },
    { id: 'Business', name: 'Business', icon: <Business /> },
    { id: 'Mathematics', name: 'Mathematics', icon: <Timeline /> },
  ];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Quiz Categories
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose from hundreds of quizzes across different topics
        </Typography>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Card>

      {/* Category Filters */}
      <Box sx={{ mb: 4, overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              icon={category.icon}
              label={category.name}
              onClick={() => setSelectedCategory(category.id)}
              color={selectedCategory === category.id ? 'primary' : 'default'}
              sx={{ 
                px: 1, 
                py: 2.5,
                '& .MuiChip-label': { fontWeight: 500 },
                ...(selectedCategory === category.id && {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                })
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Quiz Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredQuizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={quiz.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip 
                        label={quiz.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      <Chip 
                        label={quiz.difficulty} 
                        size="small" 
                        color={getDifficultyColor(quiz.difficulty)}
                      />
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {quiz.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, color: 'text.secondary' }}>
                      <Typography variant="body2">
                        📝 {quiz.questions} questions
                      </Typography>
                      <Typography variant="body2">
                        ⏱️ {quiz.time}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1, color: 'text.secondary' }}>
                      <Typography variant="body2">
                        👥 {quiz.attempts} attempts
                      </Typography>
                      <Typography variant="body2">
                        ⭐ {quiz.rating} rating
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      component={Link} 
                      to={`/quiz/${quiz.id}`}
                      variant="contained" 
                      fullWidth
                    >
                      Start Quiz
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredQuizzes.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No quizzes found matching your criteria
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {filteredQuizzes.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={10} 
                page={page} 
                onChange={(e, value) => setPage(value)} 
                color="primary" 
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default QuizCategories;