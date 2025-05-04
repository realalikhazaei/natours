const Tour = require('../models/tourModel');

const getOverview = async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
};

module.exports = { getOverview };
