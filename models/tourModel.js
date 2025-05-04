const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name is a required field'],
      unique: [true, 'A tour name must be unique'],
      minlength: [10, 'A tour name cannot be less than 10 characters'],
      maxlength: [50, 'A tour name cannot be more than 50 characters'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Tour duration is a required field'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour difficulty is a required field'],
      lowercase: true,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'A tour difficulty can be either easy, medium or difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'Tour price is a required field'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Price discount ({VALUE}) is more than actual price',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 1.0,
      min: [1.0, 'Ratings average cannot be less than 1.0'],
      max: [5.0, 'Ratings average cannot be more than 5.0'],
      set: function (val) {
        return Math.round(val * 10) / 10;
      },
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour max size is a required field'],
    },
    summary: {
      type: String,
      required: 'Tour summary is a required field',
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: String,
    images: [String],
    startDates: [Date],
    slug: String,
    startLocation: {
      description: String,
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
    },
    locations: [
      {
        description: String,
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

//Data indexing
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

//Add tour slug
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Filter-out secret tours
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

//Populating tour guides
tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'guides', select: 'name photo role' });
  next();
});

//Add virtual reference for reviews
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//Populate virtual reference for reviews
tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'reviews', select: 'review rating user' });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
