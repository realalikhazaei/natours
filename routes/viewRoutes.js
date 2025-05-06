const express = require('express');
const { getOverview, getTour, getLogin, getProfile } = require('../controllers/viewController');
const { isLoggedIn } = require('../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', getOverview);
router.get('/login', getLogin);
router.get('/my-profile', getProfile);
router.get('/:slug', getTour);

module.exports = router;
