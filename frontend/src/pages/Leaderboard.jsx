import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  EmojiEvents,
  Search,
  TrendingUp,
  MilitaryTech,
} from '@mui/icons-material';

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    // Simulate API call
    const mockData = [
      { rank: 1, name: 'John Doe', score: 2850, quizzes: 24, avatar: 'JD', trend: '+120' },
      { rank: 2, name: 'Jane Smith', score: 2720, quizzes: 22, avatar: 'JS', trend: '+95' },
      { rank: 3, name: 'Mike Johnson', score: 2680, quizzes: 23, avatar: 'MJ', trend: '+80' },
      { rank: 4, name: 'Sarah Williams', score: 2590, quizzes: 21, avatar: 'SW', trend: '+110' },
      { rank: 5, name: 'David Brown', score: 2510, quizzes: 20, avatar: 'DB', trend: '+75' },
      { rank: 6, name: 'Emily Davis', score: 2480, quizzes: 19, avatar: 'ED', trend: '+90' },
      { rank: 7, name: 'Robert Wilson', score: 2420, quizzes: 18, avatar: 'RW', trend: '+65' },
      { rank: 8, name: 'Lisa Anderson', score: 2380, quizzes: 17, avatar: 'LA', trend: '+85' },
      { rank: 9, name: 'James Taylor', score: 2350, quizzes: 16, avatar: 'JT', trend: '+70' },
      { rank: 10, name: 'Maria Garcia', score: 2310, quizzes: 15, avatar: 'MG', trend: '+95' },
    ];
    setLeaderboardData(mockData);
  }, []);

  const filteredData = leaderboardData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <EmojiEvents sx={{ color: '#FFD700' }} />;
      case 2: return <EmojiEvents sx={{ color: '#C0C0C0' }} />;
      case 3: return <EmojiEvents sx={{ color: '#CD7F32' }} />;
      default: return <MilitaryTech sx={{ color: '#9e9e9e' }} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <EmojiEvents sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Leaderboard
          </Typography>
          <Typography variant="body1">
            Top performers of the week
          </Typography>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search by name..."
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
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      <Card>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell align="center" width={80}>Rank</TableCell>
                <TableCell>User</TableCell>
                <TableCell align="center">Total Score</TableCell>
                <TableCell align="center">Quizzes Taken</TableCell>
                <TableCell align="center">Trend</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((user) => (
                <TableRow 
                  key={user.rank}
                  sx={{ 
                    '&:hover': { bgcolor: '#f5f5f5' },
                    ...(user.rank <= 3 && { bgcolor: '#fff8e1' })
                  }}
                >
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      {getRankIcon(user.rank)}
                      <Typography fontWeight="bold">#{user.rank}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>{user.avatar}</Avatar>
                      <Box>
                        <Typography fontWeight="bold">{user.name}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="bold" color="primary">
                      {user.score}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={`${user.quizzes} quizzes`} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <TrendingUp sx={{ color: '#4caf50', fontSize: 16 }} />
                      <Typography variant="body2" color="success.main">
                        {user.trend}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* User Stats Card */}
      <Card sx={{ mt: 3, bgcolor: '#f0f7ff' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Ranking
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                You
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">Your Score</Typography>
                <Typography variant="h5" fontWeight="bold">0 points</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Global Rank</Typography>
                <Typography variant="h5" fontWeight="bold">--</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Quizzes Taken</Typography>
                <Typography variant="h5" fontWeight="bold">0</Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Leaderboard;