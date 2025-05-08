const express = require('express');
const { protectRoute } = require('../controllers/authController');
const { getCheckoutSession, verifyCheckoutSession } = require('../controllers/bookingController');
const { getPaymentStatus } = require('../controllers/viewController');

const router = express.Router();

router.route('/checkout-session').get(verifyCheckoutSession, getPaymentStatus).post(protectRoute, getCheckoutSession);

module.exports = router;
