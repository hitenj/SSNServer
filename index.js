const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const complaintRoutes = require("./routes/complaintRoutes");
const footerQuestionRoutes = require("./routes/footerQuestionRoutes");
const registerCampaignRoutes = require("./routes/registerCampaignRoutes");
const bookSeatRoutes = require("./routes/bookSeatRoutes");
const donationRoutes = require("./routes/donationRoutes.js");
const paymentRoutes = require("./routes/payment");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB, THEN start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // Only start routes AFTER DB connection
    app.use("/api/complaints", complaintRoutes);
    app.use("/api/footerQuestion", footerQuestionRoutes);
    app.use("/api/registerCampaign", registerCampaignRoutes);
    app.use('/api/bookSeat', bookSeatRoutes);
    app.use("/api/donations", donationRoutes);
    app.use("/api/payment", paymentRoutes);

    app.get("/", (req, res) => {
      res.send("Server is running and ready!");
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port: ${PORT}`));
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err);
    process.exit(1); // stop app if DB connection fails
  });
