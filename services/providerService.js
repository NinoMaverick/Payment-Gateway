const pickProvider = require('../utils/pickProvider');
const paystackAdapter = require('../adapters/paystackAdapter');
const flutterwaveAdapter = require('../adapters/flutterwaveAdapter');

// Initiate payment with a randomly selected provider
const makePayment = async (paymentData) => {
  const provider = pickProvider(); // Pick Paystack or Flutterwave at payment start

  let response;

  if (provider === 'Paystack') {
    response = await paystackAdapter.makePayment(paymentData);
  } else if (provider === 'Flutterwave') {
    response = await flutterwaveAdapter.makePayment(paymentData);
  }

  return { provider, response };
};

// Retrieve payment information — based on original provider (passed as argument)
const retrievePayment = async (externalReference, provider) => {
  let response;

  if (provider === 'Paystack') {
    response = await paystackAdapter.retrievePayment(externalReference);
  } else if (provider === 'Flutterwave') {
    response = await flutterwaveAdapter.retrievePayment(externalReference);
  }

  return { response };
};

module.exports = {
  makePayment,
  retrievePayment,
};
