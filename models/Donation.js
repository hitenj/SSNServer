const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    city: {type: String, required: true},
    whatsapp: {type: String, required: true},
    amount: {type: Number, required: true},
    pan: {type: String},
    purpose: {type: String, required: true},
    paymentId: {type: String},
    orderId: {type: String},
    signature: {type: String},
    status: { type: String, default: 'success' },
    paymentDetails: {
    method: String, // 'upi', 'card', 'netbanking', etc.
    vpa: String,    // for UPI
    bank: String,   // for netbanking
    wallet: String, // for wallets like Paytm
    card: {
      last4: String,
      network: String,
      type: String
    },
    email: String,
    contact: String,
    captured_at: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);