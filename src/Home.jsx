// src/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [fromUser, setFromUser] = useState('');
  const [toUser, setToUser] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('owed');
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    if (!userEmail || !userName) {
      navigate('/login');
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/transaction/${userEmail}`);
        console.log('Fetched transactions:', response.data); // Debug log
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to fetch transactions');
      }
    };

    fetchTransactions();
  }, [userEmail, userName, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/transaction', { fromUser, toUser, amount, type });
      toast.success(response.data.message);
      setFromUser('');
      setToUser('');
      setAmount('');
      setType('owed');
      setTransactions([...transactions, { fromUser, toUser, amount, type, date: new Date() }]);
    } catch (error) {
      console.error('Error recording transaction:', error);
      toast.error('Error recording transaction');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleString();
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '400px',
    margin: '0 auto',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '5px 0',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
  };

  const transactionStyle = {
    padding: '10px',
    margin: '5px 0',
    border: '1px solid #ddd',
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Welcome, {userName}!</h2>
      <button onClick={handleLogout} style={buttonStyle}>Logout</button>
      <p style={{ textAlign: 'center' }}>Here are your transactions:</p>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label>From User:</label>
          <input
            type="text"
            value={fromUser}
            onChange={(e) => setFromUser(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>To User:</label>
          <input
            type="text"
            value={toUser}
            onChange={(e) => setToUser(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
            <option value="owed">Owed</option>
            <option value="received">Received</option>
          </select>
        </div>
        <button type="submit" style={buttonStyle}>Record Transaction</button>
      </form>
      <ToastContainer position="bottom-right" />

      <h2 style={{ textAlign: 'center' }}>Your Transactions</h2>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        {transactions.map((transaction, index) => (
          <div key={index} style={transactionStyle}>
            <p><strong>From:</strong> {transaction.fromUser}</p>
            <p><strong>To:</strong> {transaction.toUser}</p>
            <p><strong>Amount:</strong> ${transaction.amount}</p>
            <p><strong>Type:</strong> {transaction.type}</p>
            <p><strong>Date:</strong> {formatDate(transaction.date)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
