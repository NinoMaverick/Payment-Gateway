const pickProvider = require('../utils/pickProvider');
const paystackAdapter = require('../adapters/paystackAdapter');
const flutterwaveAdapter = require('../adapters/flutterwaveAdapter');

// Initiate payment with a randomly selected provider
const initiatePayment = async (paymentData) => {
  const provider = pickProvider(); // Pick Paystack or Flutterwave at payment start

  let response;

  if (provider === 'Paystack') {
    response = await paystackAdapter.initiatePayment(paymentData);
  } else if (provider === 'Flutterwave') {
    response = await flutterwaveAdapter.initiatePayment(paymentData);
  }

  return { provider, response };
};

// Retrieve payment information — based on original provider (passed as argument)
const retrievePayment = async (externalReference, provider) => {
  let response;

  if (provider === 'Paystack') {
    response = await paystackAdapter.verifyPayment(externalReference);
  } else if (provider === 'Flutterwave') {
    response = await flutterwaveAdapter.verifyPayment(externalReference);
  }

  return { response };
};

module.exports = {
  initiatePayment,
  retrievePayment,
};
