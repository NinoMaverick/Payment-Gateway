const paystackAdapter = require('../adapters/paystackAdapter');
const flutterwaveAdapter = require('../adapters/flutterwaveAdapter');

// Initiate payment via a provider (Paystack/Flutterwave)
const initiatePayment = async (paymentData) => {
  const randomProvider = Math.random() < 0.5 ? 'Paystack' : 'Flutterwave'; // Randomly select a provider
  let response;

  if (randomProvider === 'Paystack') {
    response = await paystackAdapter.initiatePayment(paymentData);
  } else {
    response = await flutterwaveAdapter.initiatePayment(paymentData);
  }

  return { provider: randomProvider, response };
};

// Retrieve payment details (status)
const retrievePayment = async (paymentId) => {
  // Retrieve payment information based on provider
  const randomProvider = Math.random() < 0.5 ? 'Paystack' : 'Flutterwave'; // Randomly select a provider
  let response;

  if (randomProvider === 'Paystack') {
    response = await paystackAdapter.verifyPayment(paymentId); 
  } else {
    response = await flutterwaveAdapter.verifyPayment(paymentId); 
  }

  return { provider: randomProvider, response };
};

module.exports = {
  initiatePayment,
  retrievePayment,
};
