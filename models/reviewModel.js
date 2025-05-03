const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Please enter your review'],
      minlength: [20, 'Tour review cannot be less than 20 characters'],
      maxlength: [1000, 'Tour review cannot be more than 1000 characters'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please enter your rating'],
      min: [1.0, 'Tour rating cannot be less than 1.0'],
      max: [5.0, 'Tour rating cannot be more than 5.0'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

//Populating users
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
