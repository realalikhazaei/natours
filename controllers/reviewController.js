const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const getAllReviews = factory.getAll(Review);

const getReview = factory.getOne(Review);

const createReview = factory.createOne(Review);

const updateReview = factory.updateOne(Review);

const deleteReview = factory.deleteOne(Review);

const getTourUserId = (req, res, next) => {
  req.body.tour ||= req.params.tour;
  req.body.user ||= req.user._id;
  next();
};

module.exports = { getAllReviews, getReview, createReview, updateReview, deleteReview, getTourUserId };
