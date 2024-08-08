// server/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  fromUser: { type: String, required: true },
  toUser: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['owed', 'received'], required: true },
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
