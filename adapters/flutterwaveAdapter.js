const axios = require('axios');
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

if (!FLUTTERWAVE_SECRET_KEY) {
  throw new Error('FLUTTERWAVE_SECRET_KEY is not set in environment variables.');
}

const makePayment = async (paymentData) => {
  try {
    // 1. Initiate payment
    const initResponse = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: paymentData.id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        redirect_url: paymentData.redirect_url || 'https://your-default-redirect.com',
        customer: {
          email: paymentData.customer_email,
          name: paymentData.customer_name,
        },
        payment_options: 'card',
        meta: {
          payment_id: paymentData.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reference = paymentData.id; // your tx_ref

    // 2. Immediately verify the payment
    const verifyResponse = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${reference}/verify`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    const status = verifyResponse.data.data.status;

    return {
      reference,
      status: status === 'successful' ? 'success' : 'failed',
    };
  } catch (error) {
    console.error('Flutterwave makePayment error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Flutterwave payment failed');
  }
};

const retrievePayment = async (reference) => {
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${reference}/verify`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    return {
      status: response.data.data.status === 'successful' ? 'success' : 'failed',
      gateway_response: response.data.data.processor_response,
    };
  } catch (error) {
    console.error('Flutterwave retrievePayment error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error verifying payment with Flutterwave');
  }
};

module.exports = { makePayment, retrievePayment };
