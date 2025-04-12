const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const getOverviewPage = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

const getTourPage = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug });
  if (!tour) return next(new AppError('There is no tour with this name', 404));

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

const getLoginPage = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

module.exports = { getOverviewPage, getTourPage, getLoginPage };
