const pickProvider = () => {
  // Randomly choose between Paystack or Flutterwave
  const providers = ['Paystack', 'Flutterwave'];
  const randomProvider = providers[Math.floor(Math.random() * providers.length)];
  
  return randomProvider;
};

module.exports = pickProvider;
