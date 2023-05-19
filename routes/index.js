var express = require("express");
var router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get("/index", (req, res) => {
  res.redirect("/");
});
  
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});


router.get("/chat", (req, res) => {
  res.render("chat");
});

router.get("/quiz", (req, res)=>{
  res.render("quiz");
});
router.get("/admin", (req, res)=>{
  res.render("admin");
});


router.get("/homepage_first_slider", (req, res) => {
  res.render("homepage_first_slider");
});
router.get("/result", (req, res) => {
  var jsonString = req.query.data;
  var myObject = JSON.parse(jsonString);
  res.render("result", {data: myObject});
});
router.get("/seller/:someName", (req, res) => {
  const someName = req.params.someName
  res.render("seller", { someName: someName });
});

router.get("/signup_card", (req, res) => {
  res.render("signup_card");
});

router.get("/mygigs", (req, res) => {
  res.render("mygigs");
});

router.post("/accountID", async (req, res) => {
  const { type, email, country } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const account = await stripe.accounts.create({
    type: type,
    email: email,
    country: country,
  });
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'http://localhost:4000/signup_card',
    return_url: 'http://localhost:4000/',
    type: 'account_onboarding'
  });
  // const capabilities = {
  //   card_payments: {
  //     requested: true,
  //   },
  //   transfers: {
  //     requested: true,
  //   },
  // };

  // const updatedAccount = await stripe.accounts.update(account.id, {
  //   capabilities: capabilities,
  // });
  
  res.send({
    accountID: account.id,
    accountLink: accountLink,
    
  });
});








module.exports = router;
