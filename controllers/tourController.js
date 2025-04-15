const Tour = require('./../models/tourModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multerUpload = require('./../utils/multerUpload');
const sharp = require('sharp');

const getAllTours = factory.getAll(Tour);

const createTour = factory.createOne(Tour);

const getTour = factory.getOne(Tour);

const updateTour = factory.updateOne(Tour);

const deleteTour = factory.deleteOne(Tour);

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

const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance = 150, latlng, unit = 'km' } = req.query;
  if (!latlng) return next(new AppError('Please allow for accessing your location and try again', 400));
  const [lat, lng] = latlng.split(',');
  const radian = unit === 'km' ? distance / 6378.1 : distance / 3963.2;

  const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[+lng, +lat], radian] } } });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

const getToursDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit = 'km' } = req.query;
  if (!latlng) return next(new AppError('Please allow for accessing your location and try again', 400));
  const [lat, lng] = latlng.split(',');
  const distanceField = `distance (${unit})`;
  const distanceMultiplier = unit === 'km' ? 0.001 : 0.000621371;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [+lng, +lat],
        },
        distanceField,
        distanceMultiplier,
      },
    },
    {
      $project: {
        name: 1,
        [distanceField]: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: distances,
  });
});

//Multer configurations
const uploadTourImages = multerUpload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
const processTourImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    }),
  );

  next();
});

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  top5Tours,
  toursStats,
  monthlyPlan,
  getToursWithin,
  getToursDistances,
  uploadTourImages,
  processTourImages,
};
