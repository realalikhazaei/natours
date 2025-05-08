const crypto = require('crypto');
const axios = require('axios');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');

const getCheckoutSession = async (req, res, next) => {
  const tour = await Tour.findById(req.body.tour);
  if (!tour) return next(new AppError('Could not found a payment for this tour. Please try again', 404));
  const orderId = crypto.randomUUID();

  const session = await axios({
    url: 'https://gateway.zibal.ir/v1/request',
    method: 'POST',
    data: {
      merchant: 'zibal',
      amount: tour.price * 1000,
      callbackUrl: `${req.protocol}://${req.get('host')}/api/v1/bookings/checkout-session`,
      orderId,
    },
  });

  await Booking.create({
    user: req.user._id,
    tour: tour._id,
    price: tour.price,
    order: orderId,
    track: session.data.trackId,
  });

  res.status(200).json({
    status: 'success',
    message: 'Redirecting to payment page...',
    data: { track: session.data.trackId },
  });
};

const verifyCheckoutSession = async (req, res, next) => {
  let { trackId, orderId } = req.query;
  if (!trackId) return next();

  const verifyPayment = await axios({
    url: 'https://gateway.zibal.ir/v1/verify',
    method: 'POST',
    data: {
      merchant: 'zibal',
      trackId,
    },
  });

  if (verifyPayment.data.result === 203) orderId = 'notfound';

  await Booking.findOneAndUpdate({ order: orderId }, { paid: verifyPayment.data.result === 100 });

  res.redirect(`/payStatus?order=${orderId}`);
};

const getPaymentStatus = async (req, res, next) => {
  const { order = 'notfound' } = req.query;

  const booking = await Booking.findOne({ order });

  res.status(200).render('payStatus', {
    title: 'Payment Status',
    booking,
  });
};

module.exports = { getCheckoutSession, verifyCheckoutSession, getPaymentStatus };
