// utils/generateReceiptNumber.js
const Counter = require('../models/Counter');

async function generateReceiptNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const key = `receipt-serial-${year}-${month}`;

  const counterDoc = await Counter.findOneAndUpdate(
  { key },
  { 
    $inc: { seq: 1 }, 
    $setOnInsert: { seq: 250 } // This will be used only on first insert
  },
  { new: true, upsert: true }
);

  const serial = String(counterDoc.seq).padStart(6, '0');
  return `SSF${year}${month}${serial}`;
}

module.exports = generateReceiptNumber;
