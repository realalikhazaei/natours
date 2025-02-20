const express = require('express');
const { topTours, getAllTours, createTour, getTour, updateTour, deleteTour } = require('../controllers/tourController');

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/top-5-tours').get(topTours, getAllTours);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
