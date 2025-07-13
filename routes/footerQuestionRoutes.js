const express = require('express');
const router = express.Router();

const FooterQuestion = require('../models/FooterQuestion');

router.post('/', async (req, res) => {
    try {
        const footerQuestion = new FooterQuestion(req.body);
        const saved = await footerQuestion.save();

        res.status(201).json({
            message: "Question saved successfully!",
            data: saved,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Error saving complaint'});
    }
     
});

module.exports = router;