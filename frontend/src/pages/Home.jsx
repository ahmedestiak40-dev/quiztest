// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  EmojiEvents,
  Timer,
  Analytics,
  Security,
  School,
  TrendingUp,
} from '@mui/icons-material';

const Home = () => {
  const features = [
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      title: 'Competitive Quizzes',
      description: 'Test your knowledge against others and climb the leaderboard',
    },
    {
      icon: <Timer sx={{ fontSize: 40 }} />,
      title: 'Timed Challenges',
      description: 'Race against the clock with our timer-based quiz system',
    },
    {
      icon: <Analytics sx={{ fontSize: 40 }} />,
      title: 'Detailed Analytics',
      description: 'Track your progress with comprehensive performance metrics',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure Platform',
      description: 'Your data is safe with enterprise-grade security',
    },
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Multiple Categories',
      description: 'Choose from various topics and difficulty levels',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Performance Tracking',
      description: 'Monitor your improvement over time',
    },
  ];
  
  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '500+', label: 'Quizzes' },
    { value: '95%', label: 'Satisfaction' },
    { value: '24/7', label: 'Support' },
  ];
  
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          borderRadius: '0 0 50% 50% / 40px',
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" align="center">
              Master Your Knowledge
            </Typography>
            <Typography variant="h5" align="center" paragraph sx={{ opacity: 0.9, mb: 4 }}>
              Create, share, and participate in engaging quizzes. Track your progress and compete with others!
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: '#f0f0f0' },
                }}
              >
                Get Started Free
              </Button>
              <Button
                component={Link}
                to="/categories"
                variant="outlined"
                size="large"
                sx={{ borderColor: 'white', color: 'white' }}
              >
                Explore Quizzes
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
      
      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          Why Choose QuizMaster?
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Everything you need for an exceptional quiz experience
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.light',
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8, borderRadius: '40px 40px 0 0' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Ready to Challenge Yourself?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Join thousands of learners and start your quiz journey today
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{ px: 6, py: 2 }}
          >
            Start Learning Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;