// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const Transaction = require('./models/Transactions');
const transactionsRoutes = require('./routes/transaction.js')

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Trans_Man', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.use('/api/transaction',transactionsRoutes)

// User registration
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).send({ message: 'Name, email, and password are required' });
  }

  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).send({ message: 'Error registering user', error: error.message });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      res.status(200).send({
        message: 'Login successful',
        email: user.email,
        name: user.name
      });
    } else {
      res.status(400).send({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(400).send({ message: 'Error logging in' });
  }
});

app.post('/api/transaction', async (req, res) => {
  const { fromUser ,toUser, amount, type } = req.body;
  const transaction = new Transaction({ fromUser, toUser, amount, type });
  try {
    await transaction.save();
    res.status(201).send({ message: 'Transaction recorded successfully' });
  } catch (error) {
    res.status(400).send({ message: 'Error recording transaction' });
  }
});

app.get('/api/transactions/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const transactions = await Transaction.find({
      $or: [{ fromUser: email }, { toUser: email }]
    });
    res.status(200).send(transactions);
  } catch (error) {
    res.status(400).send({ message: 'Error fetching transactions' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
