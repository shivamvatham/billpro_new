const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);