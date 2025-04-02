const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Please enter your review'],
      minlength: [10, 'A review cannot be less than 10 characters'],
      maxlength: [300, 'A review cannot be more than 300 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Please submit your rating'],
      min: [1.0, 'A rating score cannot be less than 1.0'],
      max: [5.0, 'A rating score cannot be more than 5.0'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

//Compound unique index for tour and user fields (prevent duplicate reviews)
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//Populate user and tour data
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name' }) /* .populate({ path: 'tour', select: 'name' }) */;
  next();
});

//Function for ratingsAverage and ratingsQuantity
reviewSchema.statics.calcRatingsAverage = async function (tour) {
  const [stats] = await this.aggregate([
    {
      $match: { tour },
    },
    {
      $group: {
        _id: null,
        avgRatings: { $avg: '$rating' },
        nRatings: { $sum: 1 },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tour, {
    ratingsAverage: stats?.avgRatings || 1,
    ratingsQuantity: stats?.nRatings || 0,
  });
};

//Calling the function for ratingsAverage and ratingsQuantity
reviewSchema.post(['save', /^findOneAnd/], async function (doc) {
  await doc.constructor.calcRatingsAverage(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
