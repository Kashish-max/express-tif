const mongoose = require('mongoose');
const { Snowflake } = require('@theinternetfolks/snowflake');

const CommunitySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: Snowflake.generate,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 128,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
  },
  owner: {
    type: String,
    required: true,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Community', CommunitySchema);
