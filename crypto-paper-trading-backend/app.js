// app.js
const express = require('express');
const connectDB = require('./config');
const cors = require('cors');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/trades', require('./routes/tradeRoutes'));

module.exports = app;

