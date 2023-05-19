// Set up the Stripe API keys
process.env.STRIPE_PUBLIC_KEY = 'pk_test_51MviyWLyNWm6SqnzwehOoQnEGazzGElJPhB0WBQhA0OTi87OrYhDrBssUgaQtzRTfEZrt68fndvNaVEORKRwxjic00VFx93FxP';
process.env.STRIPE_SECRET_KEY = 'sk_test_51MviyWLyNWm6SqnzmD5a0n6OtxfwP2QeZ4cDcU0gRXm2Zm8mzlzjVvGLOSzafaH8klYUyWdOqhBhZwmiUF8ZDHF9001M5wt7ts';

// Retrieve the Stripe API keys from the environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

// Import required libraries and modules
const cors = require('cors');
const stripe = require('stripe')(stripeSecretKey);
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var chat = require('./routes/chat')
const exploreRouter = require("./routes/explore");
const checkoutRouter = require('./routes/checkout');

// Create an Express app
var app = express();

// Set up the app's view engine and directories for views and static files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Set up middleware for handling HTTP requests and responses
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up CORS policies to allow requests from localhost:4000
const corsOptions = {
origin: 'http://localhost:4000'
};
app.options('', cors());
app.use((req, res, next) => {
res.header('Access-Control-Allow-Headers', '');
next();
});
app.use(cors(corsOptions));

// Set up a route for serving a quiz JSON file
app.get('/quiz1.json', (req, res) => {
const filePath = path.join(__dirname, 'quiz1.json');
res.sendFile(filePath);
});
app.get('/quiz2.json', (req, res) => {
    const filePath = path.join(__dirname, 'quiz2.json');
    res.sendFile(filePath);
    });
app.get('/quiz3.json', (req, res) => {
    const filePath = path.join(__dirname, 'quiz3.json');
    res.sendFile(filePath);
    });

// Set up routes for serving various pages
app.use('/', indexRouter);
app.use('/chat', chat);
app.use("/explore", exploreRouter);
app.use("/Checkout", checkoutRouter);

// Set up error handling for 404 errors
app.use(function(req, res, next) {
next(createError(404));
});

// Export the app for use in other modules
module.exports = app;