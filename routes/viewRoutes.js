const express = require('express');
const { getOverview, getTour, getLogin, getProfile } = require('../controllers/viewController');
const { isLoggedIn } = require('../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/tour/{:slug}', getTour);
router.get('/my-profile', getProfile);
router.get('/login', getLogin);
router.get('/', getOverview);

module.exports = router;
