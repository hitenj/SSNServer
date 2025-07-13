const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    name: {type: String, required: true },
    city: { type: String, required: true },
    mobile: { type: String, required: true },
    message: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Complaint', complaintSchema);