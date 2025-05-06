const express = require('express');
const { getOverview, getTour, getLogin } = require('../controllers/viewController');

const router = express.Router();

router.get('/', getOverview);
router.get('/login', getLogin);
router.get('/:slug', getTour);

module.exports = router;
