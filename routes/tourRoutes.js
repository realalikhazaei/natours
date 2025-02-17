const express = require('express');
const {
  checkID,
  checkData,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require('./../controllers/tourControllers');

const router = express.Router();

router.param('id', checkID);

router.route('/').get(getAllTours).post(checkData, createTour);
router.route('/:id').get(checkID, getTour).patch(checkID, updateTour).delete(checkID, deleteTour);

module.exports = router;
