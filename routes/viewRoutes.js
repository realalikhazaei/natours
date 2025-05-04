const express = require('express');
const { getOverview } = require('../controllers/viewController');

const router = express.Router();

router.get('/', getOverview);

module.exports = router;
