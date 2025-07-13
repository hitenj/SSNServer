const express = require('express');
const multer = require('multer');
const RegisterCampaign = require('../models/RegisterCampaign');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post(
  '/',
  upload.fields([
    { name: 'aadhaar', maxCount: 1 },
    { name: 'pan', maxCount: 1 },
    { name: 'voterId', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'additionalDocs', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      // Get file paths or filenames
      const images = (req.files['images'] || []).map(f => f.path);
      const additionalDocs = (req.files['additionalDocs'] || []).map(f => f.path);

      const campaign = new RegisterCampaign({
        title: req.body.title,
        postedOn: req.body.postedOn,
        place: req.body.place,
        description: req.body.description,
        images: images,
        targetAmount: req.body.targetAmount,
        fullName: req.body.fullName,
        mobile: req.body.mobile,
        otpVerified: req.body.otpVerified === 'true',
        aadhaar: req.files['aadhaar'] ? req.files['aadhaar'][0].path : undefined,
        pan: req.files['pan'] ? req.files['pan'][0].path : undefined,
        voterId: req.files['voterId'] ? req.files['voterId'][0].path : undefined,
        additionalDocs: additionalDocs
      });

      await campaign.save();
      res.status(201).json({ message: 'Campaign registered!', data: campaign });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;