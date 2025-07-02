const Payment = require('../models/paymentModel');
const providerService = require('../services/providerService');

// Initiate a payment
const makePayment = async (req, res) => {
  try {
    const { amount, currency, customer_email, customer_name } = req.body;

    // 1. Validate required fields    
    if (!amount || !currency || !customer_email || !customer_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 2. Create a unique internal payment ID
    const paymentId = `payment-${Date.now()}`;

    // 3. Prepare payment data (only this backend knows about providers)
    const paymentData = {
      amount,
      currency,
      customer_email,
      customer_name,
      id: paymentId,
      // Redirect URL might be required by providers even if you don't use it visibly
      redirect_url: 'https://yourfrontend.com/payment-success', 
    };

    // 4. Call service to pick provider and initiate payment
    const { provider, response } = await providerService.initiatePayment(paymentData);
    console.log('🔵 Provider selected:', provider);
    console.log('🔵 Provider raw response:', response);

    // 5. Determine status based on provider response
    const status = response.status === 'success' ? 'success' : 'pending'; // depending on response

    // 6. Save payment record to your database
    await Payment.create({
      paymentId,
      provider,
      externalReference: response.reference || paymentId, // provider's transaction reference
      amount,
      currency,
      customer_email,
      customer_name,
      status, // save the immediate status
    });

    // 7. Respond to the client with minimal safe info
    return res.status(200).json({
      message: 'Payment initiated successfully',
      data: {
        paymentId,
        status,
        amount,
        currency,
      },
    });

  } catch (error) {
    console.error('Error initiating payment:', error.message);
    return res.status(500).json({ message: 'Payment initiation failed', error: error.message });
  }
};

// Get payment status from your database (without revealing provider info)
const retrievePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    // 1. Fetch the payment record from database
    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // 2. Respond to client with simple information
    return res.status(200).json({
      message: 'Payment status retrieved successfully',
      data: {
        paymentId: payment.paymentId,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        createdAt: payment.createdAt,
      },
    });

  } catch (error) {
    console.error('Error retrieving payment:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve payment', error: error.message });
  }
};

// Get transaction logs for a customer (without exposing provider)
const getTransactionLogs = async (req, res) => {
  try {
    const { customer_email } = req.query; // client sends email to fetch their transactions

    if (!customer_email) {
      return res.status(400).json({ message: 'Customer email is required' });
    }

    // 1. Fetch all transactions for the customer
    const transactions = await Payment.find({ customer_email });

    // 2. Clean the data (no provider names, no sensitive info)
    const transactionLogs = transactions.map(transaction => ({
      paymentId: transaction.paymentId,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      createdAt: transaction.createdAt,
    }));

    // 3. Return to client
    return res.status(200).json({
      message: 'Transaction logs fetched successfully',
      data: transactionLogs,
    });

  } catch (error) {
    console.error('Error fetching transaction logs:', error.message);
    return res.status(500).json({ message: 'Unable to fetch transaction logs', error: error.message });
  }
};

module.exports = {
  makePayment,
  retrievePayment,
  getTransactionLogs,
};
