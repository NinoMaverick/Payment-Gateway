const axios = require('axios');
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY is not set in environment variables.');
}

const makePayment = async (paymentData) => {
  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        amount: paymentData.amount * 100,
        email: paymentData.customer_email,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      provider: 'Paystack',
      response: {
        authorization_url: response.data.data.authorization_url,
        reference: response.data.data.reference,
        status: 'success',
      },
    };
  } catch (error) {
    console.error('Paystack makePayment error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Paystack payment failed');
  }
};

const retrievePayment = async (reference) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return {
      status: response.data.data.status,
      gateway_response: response.data.data.gateway_response,
    };
  } catch (error) {
    console.error('Paystack retrievePayment error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error verifying payment with Paystack');
  }
};

module.exports = { makePayment, retrievePayment };
