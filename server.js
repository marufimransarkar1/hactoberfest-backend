const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('node:dns');
require('dotenv').config();

// Override DNS resolution for MongoDB Atlas connection issues on certain networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors());
// Increased payload limits to support base64 image uploads from frontend
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);

// Database Connection with explicit timeout settings
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cityreport';

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging for 10s
  })
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed!');
    console.error('Details:', err.message);
    console.error('👉 Check if your .env file has valid MONGO_URI or whitelist your IP in Atlas.');
  });

// Global Error Handler for unexpected server issues
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));