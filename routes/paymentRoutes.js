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
  const { amount, donorDetails } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      payment_capture: 1,
      notes: {
        name: donorDetails?.name || "",
        city: donorDetails?.city || "",
        whatsapp: donorDetails?.whatsapp || "",
        pan: donorDetails?.pan || "",
        purpose: donorDetails?.purpose || "General Donation",
      },
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// Verify payment signature
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  }

  try {
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // ✅ Always extract donor info from Razorpay notes (works on mobile & desktop)
    const donorDetails = {
      name: payment.notes?.name || "Unknown",
      city: payment.notes?.city || "",
      whatsapp: payment.notes?.whatsapp || payment.contact,
      pan: payment.notes?.pan || "",
      purpose: payment.notes?.purpose || "General Donation",
      amount: payment.amount / 100,
    };

    const receiptNumber = await generateReceiptNumber();

    const donationDoc = new Donation({
      ...donorDetails,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      status: payment.status,
      receiptNumber,
      paymentDetails: {
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
      },
    });

    const saved = await donationDoc.save();

    if (req.headers["content-type"]?.includes("application/json")) {
      return res.json({ success: true, donation: saved });
    } else {
      return res.redirect(`${process.env.FRONTEND_URL}/receipt/${saved._id}`);
    }
  } catch (err) {
    console.error("verify error", err);
    return res
      .status(500)
      .json({ success: false, message: "Verification failed" });
  }
});

module.exports = router;
