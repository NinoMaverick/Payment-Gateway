const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST: Make a payment
router.post('/make-payment', paymentController.makePayment);

// GET: Retrieve payment details
router.get('/retrieve-payment/:paymentId', paymentController.retrievePayment);



// Route for GET transaction logs
router.get('/get-transaction-logs', (req, res, next) => {
    console.log("Fetching transaction logs for email:", req.query.customer_email);
    next();  // pass to controller
  }, paymentController.getTransactionLogs);
  

module.exports = router;
