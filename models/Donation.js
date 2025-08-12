const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  whatsapp: { type: String, required: true },
  amount: { type: Number, required: true },
  pan: { type: String },
  purpose: { type: String, required: true },
  paymentId: { type: String },
  orderId: { type: String },
  signature: { type: String },
  status: { type: String, default: 'success' },
  receiptNumber: { type: String, unique: true },
  paymentDetails: {
    method: { type: String },
    vpa: { type: String },
    bank: { type: String },
    wallet: { type: String },
    card: {
      type: new mongoose.Schema({
        last4: { type: String },
        network: { type: String },
        type: { type: String }
      }, { _id: false })
    },
    email: { type: String },
    contact: { type: String },
    created_at: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);