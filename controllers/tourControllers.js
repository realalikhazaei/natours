const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));

const checkID = (req, res, next, val) => {
  if (val > tours.length - 1)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  next();
};

const checkData = (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide a name for tour',
    });
  }
  if (!req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please provide a price for tour',
    });
  }
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
};

const createTour = (req, res) => {
  const id = tours.at(-1).id + 1;
  const tour = req.body;
  const newTour = { id, ...tour };
  tours.push(newTour);
  fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    if (err) return console.log('There was an error with your request.');
  });
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
  tours.splice(id, 1);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    if (err) return console.log('There was an error with your request.');
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

module.exports = {
  checkID,
  checkData,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
};
