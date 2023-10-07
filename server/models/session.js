const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const { Snowflake } = require('@theinternetfolks/snowflake');

const SessionSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: Snowflake.generate,
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['valid', 'expired'],
    default: 'valid',
  },
});

SessionSchema.plugin(uniqueValidator);

SessionSchema.statics.generateToken = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        reject(err);
      }
      const token = buf.toString('hex');
      resolve(token);
    });
  });
};

SessionSchema.statics.expireAllTokensForUser = function (user_id) {
  return this.updateMany({ user_id }, { $set: { status: 'expired' } });
};

SessionSchema.methods.expireToken = function () {
  const session = this;
  return session.update({ $set: { status: 'expired' } });
};

module.exports = mongoose.model('Session', SessionSchema);
