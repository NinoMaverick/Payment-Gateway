const providerService = require('../services/providerService');

const makePayment = async (req, res) => {
  try {
    // Step 1: Get payment details from the request body
    const { amount, currency, customer_email, customer_name } = req.body;

    // Step 2: Validate input (basic validation)
    if (!amount || !currency || !customer_email || !customer_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Step 3: Prepare the payment data
    const paymentData = {
      amount,
      currency,
      customer_email,
      customer_name,
      id: `payment-${Date.now()}`, // Unique ID based on timestamp
      redirect_url: 'https://yourfrontend.com/payment-success'
    };

    // Step 4: Call the provider service to initiate payment
    const { provider, response } = await providerService.initiatePayment(paymentData);

    // Step 5: Return the provider's response
    return res.status(200).json({
      message: `Payment initiated successfully with ${provider}`,
      data: response,
    });
  } catch (error) {
    // Error handling
    console.error('Error in makePayment controller:', error.message);
    return res.status(500).json({ 
      message: 'Payment initiation failed', error: error.message });
  }
};


const retrievePayment = async (req, res) => {
    try {
      const { paymentId } = req.params; 
      
      if (!paymentId) {
        return res.status(400).json({ message: 'Payment ID is required' });
      }
  
      // Step 1: Call the provider service to retrieve payment details
      const { provider, response } = await providerService.retrievePayment(paymentId);
  
      // Step 2: Return the provider's response
      return res.status(200).json({
        message: `Payment status retrieved successfully from ${provider}`,
        data: response,
      });
    } catch (error) {
      // Error handling
      console.error('Error in retrievePayment controller:', error.message);
      return res.status(500).json({ message: 'Unable to retrieve payment', error: error.message });
    }
  };
  
  module.exports = {
    makePayment,
    retrievePayment,
  };
