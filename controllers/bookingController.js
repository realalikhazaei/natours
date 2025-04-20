const crypto = require('crypto');
const axios = require('axios');
const Tour = require('./../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');

const getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.body.tour);
  if (!tour) return next(`Could not access the payment page. Please try again`, 400);

  const session = await axios({
    url: 'https://gateway.zibal.ir/v1/request',
    method: 'POST',
    data: {
      merchant: 'zibal',
      amount: tour.price * 100,
      callbackUrl: `${req.protocol}://${req.get('host')}/api/v1/bookings/checkout-session`,
      description: `TourID: ${tour._id}`,
      orderId: crypto.randomUUID(),
    },
  });

  res.status(200).json({
    status: 'success',
    session: session.data.trackId,
  });
});

const verifyCheckoutSession = catchAsync(async (req, res, next) => {
  const { trackId, orderId } = req.query;
  if (!trackId) return next();

  const verifyPayment = await axios({
    url: 'https://gateway.zibal.ir/v1/verify',
    method: 'POST',
    data: {
      merchant: 'zibal',
      trackId,
    },
  });

  if (verifyPayment.data.result === 201) {
    res.redirect(`/payStatus?order=${orderId}`);
    return;
  }

  if (verifyPayment.data.result === 203) return next();

  let paid;
  switch (verifyPayment.data.result) {
    case 100:
      paid = true;
      break;

    case 202:
      paid = false;
      break;
  }

  const tour = verifyPayment.data.description?.split(' ')[1];
  const amount = verifyPayment.data.amount;

  await Booking.create({ user: req.user._id, tour, order: orderId, track: trackId, price: amount, paid });

  res.redirect(`/payStatus?order=${orderId}`);
});

const getPaymentStatus = catchAsync(async (req, res, next) => {
  const order = req.query.order || null;
  const booking = await Booking.findOne({ order });

  res.status(200).render('payStatus', {
    title: 'Payment Status',
    booking,
  });
});

module.exports = { getCheckoutSession, verifyCheckoutSession, getPaymentStatus };
