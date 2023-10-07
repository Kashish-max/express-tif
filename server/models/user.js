const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const { Snowflake } = require('@theinternetfolks/snowflake');

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: Snowflake.generate,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 64,
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    maxlength: 128,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 64,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function (next) {
  let user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt
    .genSalt(12)
    .then((salt) => {
      return bcrypt.hash(user.password, salt);
    })
    .then((hash) => {
      user.password = hash;
      next();
    })
    .catch((err) => next(err));
});

module.exports = mongoose.model('User', UserSchema);
