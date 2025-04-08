const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour name is a required field'],
      unique: [true, 'A tour name must be unique'],
      minlength: [10, 'A tour name cannot be less than 10 characters'],
      maxlength: [30, 'A tour name cannot be more than 30 characters'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Tour duration is a required field'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour difficulty is a required field'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Tour difficulty can be either easy, medium or difficult',
      },
      lowercase: true,
    },
    price: {
      type: Number,
      reuqired: [true, 'Tour price is a required field'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Price discount ({VALUE}) cannot be more than actual price',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 1.0,
      min: [1.0, 'Ratings average cannot be less than 1.0'],
      max: [5.0, 'Ratings average cannot be more than 5.0'],
      set: val => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    startDates: {
      type: [Date],
      required: [true, 'Tour starting dates is a required field'],
    },
    summary: {
      type: String,
      required: [true, 'Tour summary is a required field'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    maxGroupSize: Number,
    imageCover: String,
    images: [String],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

//Compound index for price and ratingsAverage fields
tourSchema.index({ price: 1, ratingsAverage: -1 });

//Single index for slug field
tourSchema.index({ slug: 1 });

//Geospatial index for startLocation
tourSchema.index({ startLocation: '2dsphere' });

//Virtual reference for reviews
tourSchema.virtual('reviews', { ref: 'Review', foreignField: 'tour', localField: '_id' });

//Create tour slug
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Filter out secret tours
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

//Populate guides data
tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'guides', select: 'name role photo' });
  next();
});

//Populate reviews data
tourSchema.pre(/^find/, function (next) {
  this.populate({ path: 'reviews', select: 'review rating user' });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
