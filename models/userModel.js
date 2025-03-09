const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    unique: [true, 'This email already exists'],
    validate: [isEmail, 'The email format is not valid'],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Your passwords doesn't match",
    },
  },
  passwordLastModify: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePasswords = async function (candidatePass, hashPass) {
  return await bcrypt.compare(candidatePass, hashPass);
};

userSchema.methods.passwordChangedAfter = function (jwtIssuedTime) {
  return this.passwordLastModify / 1000 > jwtIssuedTime;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
