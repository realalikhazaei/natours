const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  top5Tours,
  toursStats,
  monthlyPlan,
} = require('./../controllers/tourController');
const { protectRoute } = require('./../controllers/authController');

const router = express.Router();

router.get('/top-5-tours', top5Tours, getAllTours);
router.get('/tours-stats', toursStats);
router.get('/monthly-plan/:year', monthlyPlan);

router.route('/').get(protectRoute, getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
