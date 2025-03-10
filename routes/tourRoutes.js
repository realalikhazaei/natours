const express = require('express');
const {
  topTours,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  tourStats,
  monthlyPlan,
} = require('./../controllers/tourController');
const { protectRoute, restrictTo } = require('./../controllers/authController');

const router = express.Router();

router.route('/').get(protectRoute, getAllTours).post(createTour);
router.route('/tour-stats').get(tourStats);
router.route('/top-5-tours').get(topTours, getAllTours);
router.route('/monthly-plan/:year').get(monthlyPlan);
router.route('/:id').get(getTour).patch(updateTour).delete(protectRoute, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
