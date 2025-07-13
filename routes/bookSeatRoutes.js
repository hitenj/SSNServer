const express = require('express');
const router = express.Router();
const BookSeat = require('../models/BookSeat');

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const bookSeat = new BookSeat(req.body);
        const savedBooking = await bookSeat.save();
        res.status(201).json({
            message: 'Complaint saved successfully!',
            data: savedBooking,
        }); 
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error saving booking'});
    }
});

module.exports = router;

