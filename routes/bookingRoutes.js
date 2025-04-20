const express = require('express');
const { getCheckoutSession, verifyCheckoutSession, getPaymentStatus } = require('./../controllers/bookingController');
const { protectRoute } = require('./../controllers/authController');

const router = express.Router();

router.route('/checkout-session').get(verifyCheckoutSession, getPaymentStatus).post(protectRoute, getCheckoutSession);

module.exports = router;
