const express = require('express');
const mongoose = require('mongoose');
const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ Connected to MongoDB'); 
})
.catch((err) => {
  console.error('❌ Error connecting to MongoDB:', err);
});

// Middleware
app.use(express.json());


// mount routes
app.use('/api/v1/payments', paymentRoutes); 
app.use('/api/v1/auth', authRoutes);

module.exports = app;
