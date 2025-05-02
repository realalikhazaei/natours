const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: [true, 'This email already exists'],
      validate: {
        validator: isEmail,
        message: 'Please provide a valid email address',
      },
      maxlength: [100, 'Email address cannot be more than 100 characters'],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be more than 8 characters'],
      select: false,
      validate: {
        validator: function (val) {
          return !/(\$|\.)/g.test(val);
        },
        message: '$ and dot signs are not allowed to use in a password.',
      },
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Your passwords do not match',
      },
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      default: 'user',
      lowercase: true,
      enum: {
        values: ['user', 'guide', 'lead-guide', 'admin'],
        message: 'User role must be either admin, lead-guide, guide or user',
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

//Filter-out deactivated accounts
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//Update password change time
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//Encrypt password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, +process.env.BCRYPT_HASH_COST);
  this.passwordConfirm = undefined;
  next();
});

//Verify password
userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Check password not changed after JWT issue time
userSchema.methods.passwordChangedAfter = function (iat) {
  return new Date(iat * 1000) < this.passwordChangedAt;
};

//Create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
