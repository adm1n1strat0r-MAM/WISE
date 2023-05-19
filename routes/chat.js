var express = require("express");
var router = express.Router();

router.get("/chat", (req, res) => {
    res.render("chat");
});

router.get('/email/:email', (req, res) => {
    const email = req.params.email; // Access the email parameter from req.params object
  
    // Handle the request and response as needed
    console.log(email);
    res.send(`Email: ${email}`);
  });

module.exports = router;
