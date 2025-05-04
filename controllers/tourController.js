const Tour = require('../models/tourModel');
const factory = require('./handlerFactory');

const getAllTours = factory.getAll(Tour);

const getTour = factory.getOne(Tour);

const createTour = factory.createOne(Tour);

const updateTour = factory.updateOne(Tour);

const deleteTour = factory.deleteOne(Tour);

const top5Tours = (req, res, next) => {
  req.params.sort = '-ratingsAvearge,price';
  req.params.limit = 5;
  req.params.fields = 'name,price,ratingsAverage,difficulty,duration';

  next();
};

const toursStats = async (req, res, next) => {
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
    data: stats,
  });
};

const monthlyPlan = async (req, res, next) => {
  const { year } = req.params;
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
        avgPrice: { $avg: '$price' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTours: -1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: plan,
  });
};

const toursWithinRange = async (req, res, next) => {
  const { distance = 200, latlng, unit = 'km' } = req.query;
  const [lat, lng] = latlng.split(',');
  const distanceRadian = distance / (unit === 'mi' ? 3963.2 : 6378.1);

  const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[+lng, +lat], distanceRadian] } } });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
};

const toursDistances = async (req, res, next) => {
  const { latlng, unit = 'km' } = req.query;
  const [lat, lng] = latlng.split(',');
  const distanceMultiplier = unit === 'mi' ? 0.000621 : 0.001;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [+lng, +lat],
        },
        distanceField: 'distance',
        distanceMultiplier,
      },
    },
    {
      $project: { name: 1, distance: 1, price: 1, difficulty: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: distances,
  });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  top5Tours,
  toursStats,
  monthlyPlan,
  toursWithinRange,
  toursDistances,
};
