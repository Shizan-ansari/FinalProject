const express = require('express');
const router = express.Router();   //  use Router, not express()
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const paymentController = require('../controllers/paymentController');

// Body parser (already probably in main app.js, but safe here)
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Routes
router.post('/createOrder',isLoggedIn, paymentController.createOrder);
router.post('/razorpay/confirm',isLoggedIn, paymentController.confirmPayment);

module.exports = router;
