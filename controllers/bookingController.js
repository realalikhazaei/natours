const Tour = require('./../models/tourModel');
const axios = require('axios');
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
    },
  });

  res.status(200).json({
    status: 'success',
    session: session.data.trackId,
  });
});

const getCheckoutPage = catchAsync(async (req, res, next) => {
  const { success, status, trackId } = req.query;
  const checkPayment = await axios({
    url: 'https://gateway.zibal.ir/v1/verify',
    method: 'POST',
    data: {
      merchant: 'zibal',
      trackId,
    },
  });

  console.log(checkPayment.data);
  const tourID = checkPayment.data.description.split(' ')[1];
  const tour = await Tour.findById(tourID);

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

module.exports = { getCheckoutSession, getCheckoutPage };
