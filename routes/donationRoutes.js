const express = require("express");
const router = express.Router();

const Donation = require("../models/Donation");

router.post("/", async (req, res) => {
  try {
    const donation = new Donation(req.body);
    const saved = await donation.save();

    res.status(201).json({
      message: "Donation saved successfully!",
      data: saved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving donation" });
  }
});

router.get("/", async (req, res) => {
  try {
    const donors = await Donation.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json(donors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching donors" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await Donation.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

