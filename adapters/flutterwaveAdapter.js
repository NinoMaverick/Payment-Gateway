const axios = require('axios');
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

if (!FLUTTERWAVE_SECRET_KEY) {
  throw new Error('FLUTTERWAVE_SECRET_KEY is not set in environment variables.');
}

const makePayment = async (paymentData) => {
  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: paymentData.id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        redirect_url: paymentData.redirect_url || 'https://your-default-redirect.com',
        customer: {
          email: paymentData.customer_email,
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

    return {
      provider: 'Flutterwave',
      response: {
        authorization_url: response.data.data.link,
        reference: paymentData.id,
        status: 'success',
      },
    };
  } catch (error) {
    console.error('Flutterwave makePayment error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Flutterwave payment failed');
  }
};

const retrievePayment = async (paymentId) => {
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${paymentId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    return {
      status: response.data.data.status,
      gateway_response: response.data.data.processor_response,
    };
  } catch (error) {
    console.error('Flutterwave retrievePayment error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error verifying payment with Flutterwave');
  }
};

module.exports = { makePayment, retrievePayment };
