const express = require('express');
const mongoose = require('mongoose');
const paymentRoutes = require('./routes/paymentRoutes'); 

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

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/v1/payments', paymentRoutes); 

module.exports = app;
