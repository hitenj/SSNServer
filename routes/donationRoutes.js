const express = require('express');
const router = express.Router();

const Donation = require('../models/Donation');

router.post('/', async(req, res) => {
    try {
        const donation = new Donation(req.body);
        const saved = await donation.save();

        res.status(201).json({
            message: 'Donation saved successfully!',
            data: saved,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error saving donation' });
    }
});

module.exports = router;