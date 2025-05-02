const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  top5Tours,
  toursStats,
  monthlyPlan,
} = require('../controllers/tourController');

const router = express.Router();

router.get('/top-5-tours', top5Tours, getAllTours);
router.get('/tours-stats', toursStats);
router.get('/monthly-plan/:year', monthlyPlan);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
