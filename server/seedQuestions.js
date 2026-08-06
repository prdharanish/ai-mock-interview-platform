const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interview-platform';

const questions = [
  {
    title: 'Two Sum',
    content: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    category: 'DSA',
    role: 'Software Engineer',
    company: ['Google', 'Amazon', 'Facebook'],
    difficulty: 'Easy',
  },
  {
    title: 'Design a URL Shortener',
    content: 'Design a service like TinyURL, a URL shortening service, a web service that provides short aliases for redirection of long URLs.',
    category: 'System Design',
    role: 'Backend Developer',
    company: ['Facebook', 'Amazon', 'Netflix'],
    difficulty: 'Medium',
  },
  {
    title: 'React UseEffect hook',
    content: 'Explain how the useEffect hook works in React, and the purpose of the dependency array. Provide a common scenario where leaving a dependency out can cause bugs.',
    category: 'DSA', // Using DSA loosely for tech questions here, or could be a different category
    role: 'Frontend Developer',
    company: ['Meta', 'Uber'],
    difficulty: 'Medium',
  },
  {
    title: 'Tell me about a time you failed',
    content: 'Describe a situation where you failed at a task or project. How did you handle it and what did you learn from the experience?',
    category: 'HR',
    role: 'Software Engineer',
    company: ['Amazon', 'Microsoft'],
    difficulty: 'Medium',
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected for Seeding');
    
    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');
    
    // Insert new ones
    await Question.insertMany(questions);
    console.log('Inserted sample questions');
    
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error seeding data:', err);
    process.exit(1);
  });
