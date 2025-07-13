const mongoose = require('mongoose');

const registerCampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  postedOn: {
    type: Date,
    required: true,
  },
  place: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: String,
      // This should store file URLs or paths after upload
    }
  ],
  targetAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  otpVerified: {
    type: Boolean,
    default: false,
  },
  aadhaar: {
    type: String,
    required: true,
    // store file path or URL
  },
  pan: {
    type: String,
    required: true,
    // store file path or URL
  },
  voterId: {
    type: String,
    required: true,
    // store file path or URL
  },
  additionalDocs: [
    {
      type: String,
      // store multiple file paths or URLs
    }
  ]
}, {
  timestamps: true,
});

module.exports = mongoose.model('RegisterCampaign', registerCampaignSchema);