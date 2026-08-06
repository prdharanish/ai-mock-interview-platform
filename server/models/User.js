const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  targetRole: { type: String, required: true, default: 'Software Engineer' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  techStack: [{ type: String }],
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
