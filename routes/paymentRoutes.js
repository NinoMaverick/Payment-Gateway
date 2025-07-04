const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('..middleware/authMiddleware');

router.use(protect); // all routes below require auth

router.post('/make-payment', paymentController.makePayment);
router.get('/retrieve-payment/:paymentId', paymentController.retrievePayment);
router.get('/my-transactions', paymentController.getMyTransactionLogs);
 
module.exports = router;