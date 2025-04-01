const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    console.log(req.query);
    const features = new APIFeatures(Model.find(), req.query).filter().sort().project().pagination();
    const documents = await features.query;

    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: documents,
    });
  });

exports.getOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) return next(new AppError(`There is no document matching this ID ${req.params.id}`, 404));

    res.status(200).json({
      status: 'success',
      data: document,
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: document,
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!document) return next(new AppError(`There is no document matching this ID ${req.params.id}`, 404));

    res.status(200).json({
      status: 'success',
      data: document,
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) return next(new AppError(`There is no document matching this ID ${req.params.id}`, 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
