
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};
router.get('/', (req, res)=>{
  res.render('Checkout');
})
router.post("/create-payment-intent", async (req, res) => {
  console.log('server')
  const sellerAccountID = req.body.sellerAccountID;
  const amount = Math.round(req.body.amount*100);
  console.log(sellerAccountID);
  console.log(amount)
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ['card'],
    application_fee_amount: 5*amount/100,
    transfer_data: {
      destination: sellerAccountID,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret
    
  });
});


module.exports = router;

// app.get('/store', function(req, res) {
//   fs.readFile('items.json', function(error, data) {
//     if (error) {
//       res.status(500).end()
//     } else {
//       res.render('store.ejs', {
//         stripePublicKey: stripePublicKey,
//         items: JSON.parse(data)
//       })
//     }
//   })
// })

// app.post('/purchase', function(req, res) {
//   fs.readFile('items.json', function(error, data) {
//     if (error) {
//       res.status(500).end()
//     } else {
//       const itemsJson = JSON.parse(data)
//       const itemsArray = itemsJson.music.concat(itemsJson.merch)
//       let total = 0
//       req.body.items.forEach(function(item) {
//         const itemJson = itemsArray.find(function(i) {
//           return i.id == item.id
//         })
//         total = total + itemJson.price * item.quantity
//       })

//       stripe.charges.create({
//         amount: total,
//         source: req.body.stripeTokenId,
//         currency: 'usd'
//       }).then(function() {
//         console.log('Charge Successful')
//         res.json({ message: 'Successfully purchased items' })
//       }).catch(function() {
//         console.log('Charge Fail')
//         res.status(500).end()
//       })
//     }
//   })
// })