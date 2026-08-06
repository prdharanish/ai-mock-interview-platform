require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interview-platform';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');

    const email = 'admin@interviewpro.com';
    let user = await User.findOne({ email });

    if (user) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const adminPassword = process.env.ADMIN_SEED_PASSWORD;
    
    if (!adminPassword) {
      console.error('ERROR: ADMIN_SEED_PASSWORD is not set in environment.');
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    user = new User({
      name: 'Admin',
      email,
      password: hashedPassword,
      targetRole: 'Admin',
      techStack: ['Node.js', 'React'],
      role: 'admin',
    });

    await user.save();
    console.log(`Admin user created successfully! Email: admin@interviewpro.com, Password: ${adminPassword}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
