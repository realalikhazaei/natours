const express = require('express');
const { getOverviewPage, getTourPage, getLoginPage, getProfilePage } = require('./../controllers/viewController');
const { protectRoute, isLoggedIn } = require('./../controllers/authController');

const router = express.Router();

router.get('/my-profile', protectRoute, getProfilePage);

router.use(isLoggedIn);

router.get('/', getOverviewPage);
router.get('/tour/:slug?', getTourPage);
router.get('/login', getLoginPage);

module.exports = router;
