const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
    price: {
      type: Number,
      required: [true, 'A booking must have a price'],
    },
    order: {
      type: String,
      unique: [true, 'Order ID must be unique'],
    },
    track: {
      type: String,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

//Populate tour and user field
bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({ path: 'tour', select: 'name' });

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
