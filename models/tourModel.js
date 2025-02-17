const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: 'string',
    required: [true, 'Name is required'],
    unique: [true, 'Name must be unique'],
  },
  rating: {
    type: 'number',
    default: 4.5,
  },
  price: {
    type: 'number',
    required: [true, 'Price is required'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

exports = Tour;
