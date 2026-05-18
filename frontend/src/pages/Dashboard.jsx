import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  EmojiEvents,
  Quiz,
  TrendingUp,
  Schedule,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    { title: 'Quizzes Taken', value: '0', icon: <Quiz />, color: '#6366f1' },
    { title: 'Average Score', value: '0%', icon: <TrendingUp />, color: '#10b981' },
    { title: 'Best Score', value: '0%', icon: <EmojiEvents />, color: '#f59e0b' },
    { title: 'Time Spent', value: '0 hrs', icon: <Schedule />, color: '#ef4444' },
  ];

  const recentQuizzes = [
    { title: 'JavaScript Basics', score: 85, date: '2024-01-15' },
    { title: 'React Fundamentals', score: 92, date: '2024-01-10' },
    { title: 'Python Programming', score: 78, date: '2024-01-05' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1">
            Ready to test your knowledge? Take a quiz and improve your skills.
          </Typography>
          <Button
            component={Link}
            to="/categories"
            variant="contained"
            sx={{ mt: 2, bgcolor: 'white', color: '#667eea', '&:hover': { bgcolor: '#f0f0f0' } }}
          >
            Start a Quiz
          </Button>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Quizzes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Quizzes
              </Typography>
              {recentQuizzes.map((quiz, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">{quiz.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Score: {quiz.score}%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={quiz.score} sx={{ height: 8, borderRadius: 4 }} />
                  <Typography variant="caption" color="text.secondary">
                    {quiz.date}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h2" color="primary">
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Points Earned
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/leaderboard"
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
              >
                View Leaderboard
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;