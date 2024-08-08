// server/routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transactions');

// Create a new transaction
router.post('/', async (req, res) => {
  try {
    const { fromUser, toUser, amount, type } = req.body;
    const transaction = new Transaction({ fromUser, toUser, amount, type });
    await transaction.save();
    res.status(200).json({ message: 'Transaction recorded successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error recording transaction' });
  }
});

// Get transactions for a specific user
router.get('/:userEmail', async (req, res) => {
  try {
    const { userEmail } = req.params;
    const transactions = await Transaction.find({
      $or: [{ fromUser: userEmail }, { toUser: userEmail }]
    });
    console.log('Fetched transactions:', transactions); // Debug log
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching transactions' });
  }
});

module.exports = router;
