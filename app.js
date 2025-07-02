const express = require('express');
const mongoose = require('mongoose');
const paymentRoutes = require('./routes/paymentRoutes'); 
const checkPendingPayments = require('./jobs/pendingPaymentChecker');

const app = express();


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
  checkPendingPayments(); // Start the background job here!
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

// app.get('/api/v1/payments/get-transaction-logs', (req, res) => {
//   res.send('Route is working!');
// });


// Routes
app.use('/api/v1/payments', paymentRoutes); 

module.exports = app;
