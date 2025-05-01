const axios = require('axios');
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
if (!PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY is not set in environment variables.');
}


const initiatePayment = async (paymentData) => {
  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    {
      amount: paymentData.amount * 100, // Paystack accepts kobo, not naira
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
    authorization_url: response.data.data.authorization_url,
    reference: response.data.data.reference,
  };
};

const verifyPayment = async (reference) => {
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
};

module.exports = { initiatePayment, verifyPayment };
