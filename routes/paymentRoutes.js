const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();
const Donation = require("../models/Donation");
const generateReceiptNumber = require("../utils/generateReceiptNumber");

// Razorpay instance (uses live keys from .env)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: "INR",
      payment_capture: 1,
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      rawOrder: order,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// Verify payment signature
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donorDetails,
    } = req.body;

    console.log("Verify request payload:", req.body);

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    console.log("expectedSignature:", expectedSignature);
    console.log("incoming signature:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch");
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Fetch full payment details
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // ✅ If donorDetails missing (mobile flow), extract from payment.notes
    const details = donorDetails || {
      name: payment.notes?.name || "Unknown",
      city: payment.notes?.city || "",
      whatsapp: payment.contact || "",
      amount: payment.amount / 100,
      pan: payment.notes?.pan || "",
      purpose: payment.notes?.purpose || "General Donation",
    };

    // Generate receipt number
    const receiptNumber = await generateReceiptNumber();

    const paymentDetailsMapped = {
      method: payment.method,
      vpa: payment.vpa,
      bank: payment.bank,
      wallet: payment.wallet,
      card: payment.card
        ? {
            last4: payment.card.last4,
            network: payment.card.network,
            type: payment.card.type,
          }
        : undefined,
      email: payment.email,
      contact: payment.contact,
      created_at: new Date(payment.created_at * 1000),
    };

    const donationDoc = new Donation({
      ...details,
      amount: Number(details.amount),
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      status: payment.status,
      receiptNumber,
      paymentDetails: paymentDetailsMapped,
    });

    const saved = await donationDoc.save();

    // ✅ Handle desktop vs mobile differently
    if (donorDetails) {
      // Desktop (handler) → return JSON
      return res.json({ success: true, donation: saved });
    } else {
      // Mobile (callback_url) → redirect user to receipt
      return res.redirect(`${process.env.FRONTEND_URL}/receipt/${saved._id}`);
    }
  } catch (err) {
    console.error("verify error", err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

module.exports = router;
