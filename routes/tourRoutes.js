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
  getToursWithin,
  getToursDistances,
} = require('./../controllers/tourController');
const { protectRoute, restrictTo } = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:tourID/reviews', reviewRouter);

router.get('/top-5-tours', top5Tours, getAllTours);
router.get('/tours-stats', protectRoute, restrictTo('admin', 'lead-guide', 'guide'), toursStats);
router.get('/monthly-plan/:year', protectRoute, restrictTo('admin', 'lead-guide', 'guide'), monthlyPlan);
router.get('/tours-within-range', getToursWithin);
router.get('/tours-distances', getToursDistances);

router.route('/').get(getAllTours).post(protectRoute, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTour)
  .all(protectRoute, restrictTo('admin', 'lead-guide'))
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
