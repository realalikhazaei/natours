const express = require('express');
const {
  getAllReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  setTourUserID,
} = require('./../controllers/reviewController');
const { protectRoute, restrictTo } = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllReviews).post(protectRoute, restrictTo('admin', 'user'), setTourUserID, createReview);
router
  .route('/:id')
  .all(protectRoute, restrictTo('admin', 'user'))
  .get(getReview)
  .patch(updateReview)
  .delete(deleteReview);

module.exports = router;
