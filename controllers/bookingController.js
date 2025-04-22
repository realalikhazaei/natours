const crypto = require('crypto');
const axios = require('axios');
const Tour = require('./../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');

const getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.body.tour);
  if (!tour) return next(`Could not access the payment page. Please try again`, 400);
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
    tour,
    price: tour.price,
    order: orderId,
    track: session.data.trackId,
    paid: false,
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

  switch (verifyPayment.data.result) {
    case 201: {
      res.redirect(`/payStatus?order=${orderId}`);
      return next();
    }
    case 203: {
      res.redirect(`/payStatus?order=notfound`);
      return next();
    }
  }

  await Booking.findOneAndUpdate({ order: orderId }, { paid: verifyPayment.data.result === 100 && true });
  res.redirect(`/payStatus?order=${orderId}`);
});

const getPaymentStatus = catchAsync(async (req, res, next) => {
  const order = req.query.order || 'notfound';
  const booking = await Booking.findOne({ order });

  res.status(200).render('payStatus', {
    title: 'Payment Status',
    booking,
  });
});

module.exports = { getCheckoutSession, verifyCheckoutSession, getPaymentStatus };
