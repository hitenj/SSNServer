const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    name: {type: String, required: true},
    city: {type: String, required: true},
    whatsapp: {type: String, required: true},
    amount: {type: String, required: true},
    pan: {type: String},
    paymentId: {type: String},
    orderId: {type: String},
    signature: {type: String},
    status: { type: String, default: 'success' },
}, { timestamps: true },
);

module.exports = mongoose.model('Donation', donationSchema);