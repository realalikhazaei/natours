const express = require('express');
const {
  getOverview,
  getTour,
  getLogin,
  getProfile,
  getPaymentStatus,
  getBookings,
} = require('../controllers/viewController');
const { isLoggedIn, protectRoute } = require('../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/tour/{:slug}', getTour);
router.get('/payStatus', protectRoute, getPaymentStatus);
router.get('/my-profile', getProfile);
router.get('/my-bookings', protectRoute, getBookings);
router.get('/login', getLogin);
router.get('/', getOverview);

module.exports = router;
