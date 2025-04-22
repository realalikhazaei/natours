const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Booking = require('../models/bookingModel');

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

const getSignupPage = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign Up',
  });
};

const getProfilePage = (req, res) => {
  res.status(200).render('profile', {
    title: 'User Panel',
  });
};

const getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id, paid: true });
  const tourIDs = bookings.map(doc => doc.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    status: 'success',
    tours,
  });
});

module.exports = { getOverviewPage, getTourPage, getLoginPage, getSignupPage, getProfilePage, getMyBookings };
