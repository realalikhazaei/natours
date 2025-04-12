const express = require('express');
const { getOverviewPage, getTourPage, getLoginPage } = require('./../controllers/viewController');
const { isLoggedIn } = require('./../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', getOverviewPage);
router.get('/tour/:slug?', getTourPage);
router.get('/login', getLoginPage);

module.exports = router;
