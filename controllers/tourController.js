const Tour = require('./../models/tourModel');

const topTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,duration,difficulty';
  next();
};

const getAllTours = async (req, res) => {
  try {
    const APIFeatures = class {
      constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
      }

      filter() {
        const filterStr = { ...this.queryStr };
        const excludedFields = ['sort', 'fields', 'limit', 'page'];
        excludedFields.forEach(el => delete filterStr[el]);
        this.query.find(filterStr);

        return this;
      }
      sort() {
        if (this.queryStr.sort) {
          const sortBy = this.queryStr.sort.split(',').join(' ');
          this.query.sort(sortBy);
        } else this.query.sort('-createdAt');

        return this;
      }
      projection() {
        if (this.queryStr.fields) {
          const fields = this.queryStr.fields.split(',').join(' ');
          this.query.select(fields);
        } else this.query.select('-__v');

        return this;
      }
      pagination() {
        const page = +this.queryStr.page || 1;
        const limit = +this.queryStr.limit || 10;
        const skip = (page - 1) * limit;
        this.query.skip(skip).limit(limit);

        return this;
      }
    };

    //Awaiting the query
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().projection().pagination();
    const tours = await features.query;

    //Sending response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: tours,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const getTour = async (req, res) => {
  try {
    console.log(req.query);
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

module.exports = { topTours, getAllTours, createTour, getTour, updateTour, deleteTour };
