const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

const getAllReviews = factory.getAll(Review);

const createReview = factory.createOne(Review);

const getReview = factory.getOne(Review);

const updateReview = factory.updateOne(Review);

const deleteReview = factory.deleteOne(Review);

//Sets the value path for tour ID and user ID
const setTourUserID = (req, res, next) => {
  req.body.tour ||= req.params.tourID;
  req.body.user ||= req.user._id;
  next();
};

module.exports = { getAllReviews, createReview, getReview, updateReview, deleteReview, setTourUserID };
