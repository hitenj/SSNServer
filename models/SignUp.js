const mongoose = require('mongoose');

const signUpSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    match: /^\d{10}$/, // assuming Indian 10-digit mobile
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  profileImage: {
    type: String, 
    // store path or URL of uploaded image
  },
  password: {
    type: String,
    required: true,
  },
  termsAccepted: {
    type: Boolean,
    default: false,
  },
  googleAuth: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('signUp', coordinatorSchema);
