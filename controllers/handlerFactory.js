const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = Model => async (req, res, next) => {
  const query = { ...req.query, ...req.params };
  const features = new APIFeatures(Model.find(), query).filter().sort().projection().pagination();
  const documents = await features.query;

  res.status(200).json({
    status: 'success',
    results: documents.length,
    data: documents,
  });
};

exports.getOne = Model => async (req, res, next) => {
  const document = await Model.findById(req.params.id);
  if (!document) return next(new AppError(`There is no document with this ID ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    data: document,
  });
};

exports.createOne = Model => async (req, res, next) => {
  const document = await Model.create(req.body);

  res.status(201).json({
    status: 'success',
    data: document,
  });
};

exports.updateOne = Model => async (req, res, next) => {
  const document = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!document) return next(new AppError(`There is no document with this ID ${req.params.id}`, 404));

  res.status(200).json({
    status: 'success',
    data: document,
  });
};

exports.deleteOne = Model => async (req, res, next) => {
  const document = await Model.findByIdAndDelete(req.params.id);
  if (!document) return next(new AppError(`There is no document with this ID ${req.params.id}`, 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
