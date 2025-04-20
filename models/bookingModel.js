const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    price: {
      type: Number,
      required: [true, 'A booking must have a price'],
    },
    paid: {
      type: Boolean,
      default: true,
    },
    order: {
      type: String,
      unique: [true, 'Order ID must be unique'],
    },
    track: Number,
  },
  {
    timestamps: true,
  },
);

//Populate user and tour data
bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({ path: 'tour', select: 'name' });

  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
