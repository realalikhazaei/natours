const express = require('express');
const { getCheckoutSession, getCheckoutPage } = require('./../controllers/bookingController');
const { protectRoute } = require('./../controllers/authController');

const router = express.Router();

router.route('/checkout-session').get(getCheckoutPage).post(protectRoute, getCheckoutSession);

module.exports = router;
