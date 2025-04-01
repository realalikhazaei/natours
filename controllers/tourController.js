const Tour = require('./../models/tourModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

const top5Tours = (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.limit = 5;
  req.query.fields = 'name,price,ratingsAverage,duration,difficulty';

  next();
};

const toursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
        avgPrice: { $avg: '$price' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    groups: stats.length,
    data: stats,
  });
});

const monthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $sort: { numTours: -1 },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: plan,
  });
});

const getAllTours = factory.getAll(Tour);

const createTour = factory.createOne(Tour);

const getTour = factory.getOne(Tour);

const updateTour = factory.updateOne(Tour);

const deleteTour = factory.deleteOne(Tour);

module.exports = { getAllTours, createTour, getTour, updateTour, deleteTour, top5Tours, toursStats, monthlyPlan };
