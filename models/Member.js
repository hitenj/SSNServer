const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  profession: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  fatherName: {
    type: String,
    trim: true
  },
  bloodGroup: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/
  },
  whatsapp: {
    type: String,
    match: /^[0-9]{10}$/
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  pinCode: {
    type: String,
    match: /^[0-9]{6}$/
  },
  address: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String, // Will store file URL or path
    default: null
  },
  aadhar: {
    type: String, // Will store file URL or path
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Member', memberSchema);