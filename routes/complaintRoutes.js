const express = require('express');
const router = express.Router();

const Complaint = require('../models/Complaint');

router.post('/', async (req, res) => {
    try{
        const complaint = new Complaint(req.body);
        const saved = await complaint.save();

        res.status(201).json({
            message: 'Complaint saved successfully!',
            data: saved,
        }); 
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Error saving complaint'});
    }
});

module.exports = router;