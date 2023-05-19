const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
     // Access the value of someName from the URL
    // Use the value of someName in your code
    // For example, you can pass it to the render function as a variable
    res.render("explore", { someName: 'all-projects' });
  });

router.get("/:someName", (req, res) => {
    const someName = req.params.someName; // Access the value of someName from the URL
    // Use the value of someName in your code
    // For example, you can pass it to the render function as a variable
    res.render("explore", { someName: someName });
  });


module.exports = router;