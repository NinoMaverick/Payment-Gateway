const axios = require('axios');
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY is not set in environment variables.');
}

const initiatePayment = async (paymentData) => {
  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        amount: paymentData.amount * 100, // Paystack uses kobo
        email: paymentData.customer_email,
        metadata: {
          custom_fields: [
            {
              display_name: paymentData.customer_name,
              variable_name: 'customer_name',
              value: paymentData.customer_name,
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return {
      provider: 'Paystack',
      response: {
        authorization_url: response.data.data.authorization_url,
        reference: response.data.data.reference,
        status: 'pending', // because user has not paid yet
      }
    };
  } catch (error) {
    console.error('Paystack initiate error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Paystack payment initiation failed');
  }
};

const verifyPayment = async (reference) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        }
      }
    );

    return {
      status: response.data.data.status, // 'success' or 'failed'
      gateway_response: response.data.data.gateway_response,
    };
  } catch (error) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error verifying payment with Paystack');
  }
};

module.exports = { initiatePayment, verifyPayment };
