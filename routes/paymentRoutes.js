const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST: Make a payment
router.post('/make-payment', paymentController.makePayment);

// GET: Retrieve payment details
router.get('/retrieve-payment/:paymentId', paymentController.retrievePayment);

module.exports = router;
