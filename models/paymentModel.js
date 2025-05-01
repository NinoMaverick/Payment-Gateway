const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['succeeded', 'failed'],  
      required: true,  
    },
    description: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true,
    },
    customer_name: {
      type: String,
      required: true,
    },
    payment_method: {
      type: Object,  // Stores details of the payment method, like card info
      required: true,
    },
    provider: {
      type: String,  // Which provider processed the payment
      required: true,
    },
    provider_reference: {
      type: String,  // Transaction reference from the payment provider
    },
  },
  {
    timestamps: true,  
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
