const express = require('express');
const {
  getOverviewPage,
  getTourPage,
  getLoginPage,
  getProfilePage,
  getMyBookings,
} = require('./../controllers/viewController');
const { protectRoute, isLoggedIn } = require('./../controllers/authController');
const { getPaymentStatus } = require('./../controllers/bookingController');

const router = express.Router();

router.get('/my-profile', protectRoute, getProfilePage);

router.use(isLoggedIn);

router.get('/', getOverviewPage);
router.get('/tour/:slug?', getTourPage);
router.get('/login', getLoginPage);
router.get('/payStatus/:order?', protectRoute, getPaymentStatus);
router.get('/my-bookings', protectRoute, getMyBookings);

module.exports = router;
