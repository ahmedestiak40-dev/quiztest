import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Common/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import QuizCategories from './pages/QuizCategories';
// ইমপোর্ট যোগ করুন
import CreateQuestions from './pages/Admin/CreateQuestions';
import AdminDashboard from './pages/Admin/AdminDashboard';





function App() {
  return (
    <HelmetProvider>
      <Toaster position="top-right" />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categories" element={<QuizCategories />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
           
           // Routes এর মধ্যে যোগ করুন
<Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
<Route path="/admin/manage-questions/:quizId" element={<PrivateRoute adminOnly><CreateQuestions /></PrivateRoute>} />// Routes এর মধ্যে যোগ করুন
<Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
<Route path="/admin/manage-questions/:quizId" element={<PrivateRoute adminOnly><CreateQuestions /></PrivateRoute>} />


        </Routes>
      </Layout>
    </HelmetProvider>
  );
}

export default App;