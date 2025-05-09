const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

//Compound index for unique user and tour ID
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

//Populating users
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

//Calculate ratingsAverage and ratingsQuantity
reviewSchema.statics.calcRatings = async function (tour) {
  const [stats] = await this.aggregate([
    {
      $match: { tour },
    },
    {
      $group: {
        _id: null,
        avgRatings: { $avg: '$rating' },
        numRatings: { $sum: 1 },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tour, {
    ratingsAverage: stats?.avgRatings || 1,
    ratingsQuantity: stats?.numRatings || 0,
  });
};
reviewSchema.post(['save', /^findOneAnd/], async function (doc) {
  await doc.constructor.calcRatings(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
