// utils/generateReceiptNumber.js
const Counter = require('../models/Counter');

async function generateReceiptNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  // Keep one single counter across all months
  const key = 'receipt-serial';

  const counterDoc = await Counter.findOneAndUpdate(
    { key },
    {
      $inc: { seq: 1 },
      $setOnInsert: { seq: 250 } // first insert will start at 250, then $inc will make it 251
    },
    { new: true, upsert: true }
  );

  const serial = String(counterDoc.seq).padStart(6, '0');
  return `SSF${year}${month}${serial}`;
}

module.exports = generateReceiptNumber;
