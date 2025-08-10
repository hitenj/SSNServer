const express = require('express');
const router = express.Router();

const Member = require('../models/Member');

router.post('/', async (req, res) => {
    try{
        const member = new Member(req.body);
        const saved = await member.save();

        res.status(201).json({
            message: 'Member form saved successfully!',
            data: saved,
        }); 
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Error saving member form'});
    }
});

module.exports = router;