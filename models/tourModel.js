const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name is required'],
      unique: [true, 'Tour name must be unique'],
      trim: true,
      maxlength: [50, 'Name must be less than or equal to 50 characters'],
      minlength: [10, 'Name must be greater than or equal to 10 characters'],
    },
    duration: {
      type: String,
      required: [true, 'Tour duration is required'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5.0, 'Rating must be less than or equal to 5.0'],
      min: [1.0, 'Rating must be greater than or equal to 1.0'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either easy, medium or difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'Tour price is required'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'The value ({VALUE}) is greater than the actual price',
      },
    },
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
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: {
      type: [Date],
      required: [true, 'Tour starting dates is required'],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    images: [String],
    slug: String,
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return Math.round(this.duration / 7);
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre('findOne', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre('aggregate', function (next) {
  this._pipeline.unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
