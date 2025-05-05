const Tour = require('../models/tourModel');

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
    title: tour.name,
    tour,
  });
};

module.exports = { getOverview, getTour };
