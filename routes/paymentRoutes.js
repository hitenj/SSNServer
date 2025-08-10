const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();

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

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// Verify payment signature
router.post("/verify", async(req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(sign)
    .digest("hex");

   if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }


  try {
    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    return res.status(200).json({
      success: true,
      message: "Payment verified",
      paymentDetails: {
        id: payment.id,
        method: payment.method, // upi, card, netbanking, wallet
        vpa: payment.vpa || null, // for UPI
        bank: payment.bank || null, // for netbanking
        wallet: payment.wallet || null, // for wallet
        email: payment.email,
        contact: payment.contact,
        created_at: payment.created_at,
        amount: payment.amount,
        currency: payment.currency,
      }
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch payment details" });
  }

});

module.exports = router;
