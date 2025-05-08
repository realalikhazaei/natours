const express = require('express');
const { getOverview, getTour, getLogin, getProfile } = require('../controllers/viewController');
const { isLoggedIn, protectRoute } = require('../controllers/authController');
const { getPaymentStatus } = require('../controllers/bookingController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/tour/{:slug}', getTour);
router.get('/payStatus', protectRoute, getPaymentStatus);
router.get('/my-profile', getProfile);
router.get('/login', getLogin);
router.get('/', getOverview);

module.exports = router;
