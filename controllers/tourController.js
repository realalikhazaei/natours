const Tour = require('./../models/tourModel');

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
};

const createTour = (req, res) => {
  const tour = req.body;
  res.status(201).json({
    status: 'success',
    data: newTour,
  });
};

const getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find(el => el.id === id);
  res.status(200).json({
    status: 'success',
    data: tour,
  });
};

const updateTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find(el => el.id === id);
  res.status(200).json({
    status: 'success',
    data: tour,
  });
};

const deleteTour = (req, res) => {
  const id = +req.params.id;
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};
