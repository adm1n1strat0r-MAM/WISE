const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

// Collect payment from customer
const createPaymentIntent = async (amount, currency, customerId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customerId,
      description: 'Payment for order',
      payment_method_types: ['card'],
      // Add additional options or metadata as needed
    });
    return paymentIntent;
  } catch (error) {
    // Handle error
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Initiate payout to connected account
const createPayout = async (amount, currency, destinationAccountId) => {
  try {
    const payout = await stripe.payouts.create({
      amount: amount,
      currency: currency,
      destination: destinationAccountId,
      // Add additional options or metadata as needed
    });
    return payout;
  } catch (error) {
    // Handle error
    console.error('Error creating payout:', error);
    throw error;
  }
};

// Example usage
(async () => {
  try {
    // Create a customer and charge them $100
    const customer = await stripe.customers.create({
      email: 'customer@example.com',
      source: 'tok_visa', // Replace with a valid test card token
    });

    const paymentIntent = await createPaymentIntent(10000, 'usd', customer.id);

    // Confirm the payment intent
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id);

    // Check if the payment intent is successful
    if (confirmedPaymentIntent.status === 'succeeded') {
      // Initiate a payout to a connected account
      const payout = await createPayout(8000, 'usd', 'CONNECTED_ACCOUNT_ID');
      console.log('Payout created:', payout);
    } else {
      console.error('Payment intent failed:', confirmedPaymentIntent.last_payment_error);
    }
  } catch (error) {
    // Handle error
    console.error('Error:', error);
  }
})();
