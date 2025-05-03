const express = require('express');
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  getTourUserId,
} = require('../controllers/reviewController');
const { protectRoute, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllReviews).post(protectRoute, restrictTo('admin', 'user'), getTourUserId, createReview);
router.route('/:id').all(protectRoute).get(getReview).patch(updateReview).delete(deleteReview);

module.exports = router;
