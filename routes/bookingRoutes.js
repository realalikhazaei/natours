const express = require('express');
const { getCheckoutSession } = require('./../controllers/bookingController');
const { protectRoute } = require('./../controllers/authController');

const router = express.Router();

router.get('/checkout-session/:tourID', protectRoute, getCheckoutSession);

module.exports = router;
