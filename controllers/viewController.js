const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');

const getOverview = async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
};

const getTour = async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params?.slug });

  res.status(200).render('tour', {
    title: 'Tour Details',
    tour,
  });
};

const getLogin = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

const getProfile = (req, res) => {
  res.status(200).render('profile', {
    title: 'My Profile',
  });
};

const getPaymentStatus = async (req, res, next) => {
  const { order = 'notfound' } = req.query;

  const booking = await Booking.findOne({ order, user: req.user._id });

  res.status(200).render('payStatus', {
    title: 'Payment Status',
    booking,
  });
};

const getBookings = async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id, paid: true });

  const toursID = bookings.map(el => el.tour.id);

  const tours = await Tour.find({ _id: { $in: toursID } });

  res.status(200).render('overview', {
    title: 'My Bookings',
    tours,
  });
};

module.exports = { getOverview, getTour, getLogin, getProfile, getPaymentStatus, getBookings };
