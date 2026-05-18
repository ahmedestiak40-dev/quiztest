const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User.model');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-platform');
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        isActive: true,
        totalScore: 0,
        quizzesTaken: 0
      });
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@example.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@example.com');
      console.log('🔑 Password: admin123');
    }
    
    // Also create a regular user for testing
    const userExists = await User.findOne({ email: 'user@example.com' });
    if (!userExists) {
      await User.create({
        name: 'Test User',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
        isActive: true,
        totalScore: 0,
        quizzesTaken: 0
      });
      console.log('✅ Regular user created successfully!');
      console.log('📧 Email: user@example.com');
      console.log('🔑 Password: user123');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();