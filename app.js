const express = require('express');
const mongoose = require('mongoose');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Error connecting to MongoDB:', err));

// Middleware
app.use(express.json());

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🚀 Payment Gateway API is live. Use /api/v1/payments or /api/v1/auth.');
});

// Mount routes
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/auth', authRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
