const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour name is required'],
    unique: [true, 'Tour name must be unique'],
    trim: true,
  },
  duration: {
    type: String,
    required: [true, 'Tour duration is required'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Maximum group members for tour is required'],
  },
  difficulty: {
    type: String,
    required: [true, 'Tour difficulty is required'],
  },
  price: {
    type: Number,
    required: [true, 'Tour price is required'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Tour image cover is required'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: {
    type: [Date],
    required: [true, 'Tour starting dates is required'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
